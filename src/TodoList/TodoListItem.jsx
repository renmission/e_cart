import clsx from 'clsx';
import React, { useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useTodo } from '../contexts/TodoListProvider';

function TodoListItem({ item }) {
  const [isEdit, setIsEdit] = useState(false);

  const { updateTodo, getRequestStatus, deleteTodo } = useTodo();

  const editInputText = useRef();

  const toggleEdit = () => {
    setIsEdit(isEditing => !isEditing);
  };

  return (
    <div>
      <div key={item.id} className="flex items-center m-4">
        <input
          type="checkbox"
          checked={item.isDone}
          disabled={getRequestStatus({ type: 'UPDATE_TODO', id: item.id })}
          className="disabled:accent-slate-400 disabled:cursor-wait"
          onChange={() => updateTodo({ ...item, isDone: !item.isDone })}
        />

        {isEdit ? (
          <form
            className={clsx('flex-1 px-4 flex', {
              'line-through': item.isDone,
            })}
            onSubmit={async () => {
              await updateTodo({
                ...item,
                text: editInputText.current.value,
              });
              toggleEdit();
            }}
          >
            <input
              type="text"
              ref={editInputText}
              className="flex-1"
              required
            />
            <div>
              <button type="submit" className="btn">
                Edit
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => toggleEdit()}
              >
                Reset
              </button>
            </div>
          </form>
        ) : (
          <div
            onClick={toggleEdit}
            role="button"
            className={clsx('flex-1 px-4', {
              'line-through': item.isDone,
            })}
            tabIndex={0}
          >
            {item.text}
          </div>
        )}

        <button
          type="button"
          disabled={getRequestStatus({ type: 'DELETE_TODO', id: item.id })}
          className="btn"
          onClick={() => deleteTodo(item)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default memo(TodoListItem);

TodoListItem.propTypes = {
  item: PropTypes.exact({
    id: PropTypes.number,
    text: PropTypes.string,
    isDone: PropTypes.bool,
  }).isRequired,
};
