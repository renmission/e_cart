import React, { memo } from 'react';
import { TodoListContext, useTodo } from '../contexts/TodoListProvider';

function TodoForm() {
  const { addTodo, todoTextRef, getRequestStatus, getErrorStatus } = useTodo();
  const error = getErrorStatus({ type: 'ADD_TODO' });
  console.log('TODO TEXT!!!', todoTextRef);
  return (
    <div>
      <form className="todo__form todo_form" onSubmit={addTodo}>
        <input
          ref={todoTextRef}
          type="text"
          className="todo_form__input"
          required
        />
        <button
          disabled={getRequestStatus({ type: 'ADD_TODO' })}
          type="submit"
          className="todo_form__btn"
        >
          Add Todo
        </button>
      </form>
      {error && (
        <p className="text-center text-red-400 text-md">{error.errorMessage}</p>
      )}
    </div>
  );
}

// function TodoForm() {
//   // const { addTodo, todoText, getRequestStatus, getErrorStatus } = useTodo();
//   // const error = getErrorStatus({ type: 'ADD_TODO' });
//   // console.log('TODO TEXT!!!', todoText);
//   return (
//     <TodoListContext.Consumer>
//       {({ addTodo, todoText, getRequestStatus, getErrorStatus }) => {
//         const error = getErrorStatus({ type: 'ADD_TODO' });
//         console.log('TODO TEXT!!!', todoText);
//         return (
//           <div>
//             <form className="todo__form todo_form" onSubmit={addTodo}>
//               <input ref={todoText} type="text" className="todo_form__input" />
//               <button
//                 disabled={getRequestStatus({ type: 'ADD_TODO' })}
//                 type="submit"
//                 className="todo_form__btn"
//               >
//                 Add Todo
//               </button>
//             </form>
//             {error && (
//               <p className="text-center text-red-400 text-md">
//                 {error.errorMessage}
//               </p>
//             )}
//           </div>
//         );
//       }}
//     </TodoListContext.Consumer>
//   );
// }

export default memo(TodoForm);
