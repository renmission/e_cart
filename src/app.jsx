import React from 'react';
import TodoListProvider from './contexts/TodoListProvider';
import Todo from './TodoList';

function App() {
  return (
    <TodoListProvider>
      <Todo />
    </TodoListProvider>
  );
}

export default App;
