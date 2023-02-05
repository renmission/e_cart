import React, { memo } from 'react';
import clsx from 'clsx';
import { useTodo } from '../contexts/TodoListProvider';

const filterBtns = [
  {
    text: 'All',
    value: 'all',
  },
  {
    text: 'Pending',
    value: 'pending',
  },
  {
    text: 'Completed',
    value: 'completed',
  },
];

function TodoFilter() {
  const { filterType, loadTodo } = useTodo();
  return (
    <div className="w-full flex">
      {filterBtns.map(x => (
        <button
          key={x.value}
          type="button"
          className={clsx('btn flex-1', {
            'btn--active': filterType === x.value,
          })}
          onClick={() => loadTodo(x.value)}
        >
          {x.text}
        </button>
      ))}
    </div>
  );
}

export default memo(TodoFilter);
