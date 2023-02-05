import React, { memo } from 'react';
import { TodoContext } from '../contexts/todoContext';

function TodoForm() {
  return (
    <TodoContext.Consumer>
      {({ addTodo, todoText, getRequestStatus, getErrorStatus }) => {
        const error = getErrorStatus({ type: 'ADD_TODO' });
        return (
          <div>
            <form className="todo__form todo_form" onSubmit={addTodo}>
              <input ref={todoText} type="text" className="todo_form__input" />
              <button
                disabled={getRequestStatus({ type: 'ADD_TODO' })}
                type="submit"
                className="todo_form__btn"
              >
                Add Todo
              </button>
            </form>
            {error && (
              <p className="text-center text-red-400 text-md">
                {error.errorMessage}
              </p>
            )}
          </div>
        );
      }}
    </TodoContext.Consumer>
  );
}

export default memo(TodoForm);
