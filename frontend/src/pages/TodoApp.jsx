import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { FaPlus, FaCircleCheck, FaRegCircle, FaCheck } from 'react-icons/fa6';
import { MdDelete, MdDeleteOutline, MdEdit } from 'react-icons/md';
function TodoApp() {
  const [todos, setTodos] = useState([
    // { id: 1, task: 'Learn React', completed: false },
    // { id: 2, task: 'Build a Todo App', completed: false },
    // { id: 3, task: 'Deploy the App', completed: false },
    // { id: 4, task: 'Share with friends', completed: false },
    // { id: 5, task: 'Get feedback', completed: false },
    // { id: 6, task: 'Improve the app', completed: false },
    // { id: 7, task: 'Add more features', completed: false },
    // { id: 8, task: 'Refactor code', completed: false },
    // { id: 9, task: 'Write tests', completed: false },
    // { id: 10, task: 'Document the code', completed: false },
  ])
  const [editValue, setEditValue] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const inputRef = useRef(null);

  const handleEditTodo = (todo) => {
    setEditValue(todo.task);
    setEditingId(todo._id);
  }

  const handleSaveEdit = (todo) => {
    if (!editValue.trim()) return;
    updateData({ ...todo, task: editValue });
    setEditValue(null);
    setEditingId(null);
  }

  const handleCancelEdit = () => {
    setEditValue(null);
    setEditingId(null);
  }

  const handleAddTodo = () => {
    const value = inputRef.current.value.trim();
    if (!value) return;
    postData({ task: value })
    inputRef.current.value = ""
  }

  const toggleTodoCompleted = (todo) => {
    updateData({ ...todo, completed: !todo.completed });
  }

  const handleDeleteTodo = (todo) => {
    deleteData(todo._id);
  }

  const deleteData = async (todoId) => {
    try {
      console.log(todoId)
      const response = await fetch(`http://localhost:3000/api/todos`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: todoId }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  const updateData = async (todo) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error)
    }
  }

  const postData = async (todo) => {
    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      fetchTodos();
    } catch (error) {
      console.error("Error posting todo:", error);
    }
  }

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Expected an array of todos');
      }
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div style={{ boxShadow: '-10px -10px 100px #f0f9ff' }} className="w-[30vw] h-[80vh] bg-[linear-gradient(to_bottom_right,_#dee9ef_10%,_white_50%,_#dee9ef)] overflow-hidden rounded-lg border-2 border-white shadow-2xl backdrop-blur-sm">
        <div className='p-4 flex flex-col w-full h-full'>
          <div className='flex flex-col items-center justify-center h-full'>
            <h1 className='text-2xl text-center font-bold mb-4 text-[#151b35]'>Todo App</h1>
            <div className='pr-1.5 custom-scrollbar flex-grow overflow-y-auto h-0 max-h-[60vh] text-base select-none flex flex-col gap-2 w-full
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'>
              {todos.map((todo) => (
                <div key={todo._id} className='px-4 py-2 rounded-md shadow-white shadow-2xl bg-[#fff]  transition-colors duration-200'>
                  <div className='flex items-center gap-2 justify-between'>
                    <span>
                      {todo.completed ? (
                        <FaCircleCheck onClick={() => toggleTodoCompleted(todo)} className='text-[#151b35] text-base cursor-pointer' />
                      ) : (
                        <FaRegCircle onClick={() => toggleTodoCompleted(todo)} className='text-[#151b35] text-base cursor-pointer' />
                      )}
                    </span>
                    <span className='flex-grow py-1 text-[#151b35]'>
                      {editingId === todo._id ? (
                        <input type='text' className='border-[#151b35]  rounded px-2 outline-[#151b35] w-full' value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={e => {
                          if (e.key === "Enter") handleSaveEdit(todo);
                          if (e.key === "Escape") handleCancelEdit();
                        }} autoFocus />
                      ) : (todo.task)}
                    </span>
                    <span className='flex items-center justify-center gap-1'>
                      {editingId === todo._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(todo)}
                            className="text-[#151b35] text-lg cursor-pointer"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-[#151b35] text-lg cursor-pointer"
                          >
                            <FaPlus className='rotate-45' />
                          </button>
                        </>
                      ) : (<MdEdit onClick={() => handleEditTodo(todo)} className='text-[#151b35] text-lg cursor-pointer' />)}
                      <MdDeleteOutline onClick={() => handleDeleteTodo(todo)} className='text-[#151b35] text-lg cursor-pointer' />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-4 text-base'>
            <div className='flex gap-2 w-full'>
              <input type="text" ref={inputRef} onKeyDown={(e) => { if (e.key === "Enter") handleAddTodo(); }} placeholder="Add a new task" className='border-[#151b35] select-none rounded-3xl py-2 px-4 border-2 text-[#151b35] outline-[#151b35] w-full bg-transparent' />
              <button onClick={handleAddTodo} className='flex-nowrap text-nowrap bg-[#151b35] text-white rounded-md p-2 px-3 border-2 border-[#151b35] hover:bg-transparent hover:text-[#151b35] transition-colors cursor-pointer duration-200'>
                <FaPlus />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoApp