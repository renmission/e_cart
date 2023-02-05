/* eslint-disable react/jsx-no-useless-fragment */
import React, { memo } from 'react';
import { useTodo } from '../contexts/TodoListProvider';
import TodoListItem from './TodoListItem';

function TodoList() {
  const { todoList } = useTodo();
  console.log(todoList);
  return (
    <>
      {todoList?.map(item => (
        <TodoListItem key={item.id} item={item} />
      ))}
    </>
  );
}

// function TodoList1() {
//   return (
//     <TodoListContext.Consumer>
//       {({ todoList }) => (
//         <>
//           {todoList.map(item => (
//             <TodoListItem key={item.id} item={item} />
//           ))}
//         </>
//       )}
//     </TodoListContext.Consumer>
//   );
// }

export default memo(TodoList);
