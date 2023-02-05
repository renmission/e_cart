import clsx from 'clsx';
import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { TodoContext } from '../contexts/todoContext';

export default class TodoListItem extends PureComponent {
  static propTypes = {
    item: PropTypes.exact({
      id: PropTypes.number,
      text: PropTypes.string,
      isDone: PropTypes.bool,
    }).isRequired,
  };

  state = {
    isEdit: false,
  };

  editInputText = createRef();

  toggleEdit = () => {
    this.setState(({ isEdit }) => ({ isEdit: !isEdit }));
  };

  render() {
    const { item } = this.props;
    const { isEdit } = this.state;

    // console.log(isEdit);

    return (
      <TodoContext.Consumer>
        {({ updateTodo, getRequestStatus, deleteTodo }) => (
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
                    text: this.editInputText.current.value,
                  });
                  this.toggleEdit();
                }}
              >
                <input
                  type="text"
                  ref={this.editInputText}
                  className="flex-1"
                />
                <div>
                  <button type="submit" className="btn">
                    Edit
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      this.toggleEdit();
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            ) : (
              <div
                onClick={this.toggleEdit}
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
        )}
      </TodoContext.Consumer>
    );
  }
}
