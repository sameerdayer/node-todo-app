import { ObjectId } from "mongodb";
import { todos } from "./config/db.js";

export async function handleTodos(req, res) {
  if (req.method === "GET") {
    try {
      const todoList = await todos.find({}).toArray();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(todoList));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        if (!body) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Bad Request: No data provided" }));
          return;
        }
        const todo = JSON.parse(body);
        todo.completed = false;
        todo.createdAt = new Date();
        todo.updatedAt = new Date();
        const result = await todos.insertOne(todo);
        if (!result.acknowledged) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to create todo" }));
          return;
        }
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Todo created", _id: result.insertedId })
        );
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
      }
    });
  } else if (req.method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        if (!body) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Bad Request: No data provided" }));
          return;
        }
        const todo = JSON.parse(body);
        const result = await todos.updateOne(
          { _id: new ObjectId(todo._id) },
          {
            $set: {
              task: todo.task,
              completed: todo.completed,
              updatedAt: new Date(),
            },
          }
        );
        if (result.modifiedCount === 0) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Todo not found" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Todo updated successfully" }));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
      }
    });
  } else if (req.method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        if (!body) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Bad Request: No data provided" }));
          return;
        }
        const todo = JSON.parse(body);
        const result = await todos.deleteOne({ _id: new ObjectId(todo._id) });
        if (result.deletedCount === 0) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Todo not found" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Todo deleted successfully" }));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
      }
    });
  }
}
