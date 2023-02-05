import React from 'react';
import './todo.css';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoFilter from './TodoFilter';

function Todo() {
  return (
    <div className="todo">
      <h1 className="text-6xl font-thin pt-8">Todo APP</h1>
      <TodoForm />
      <div className="w-full flex-1 overflow-y-auto">
        <TodoList />
      </div>
      <TodoFilter />
    </div>
  );
}

export default Todo;
