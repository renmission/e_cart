/* eslint-disable react/prop-types */
import React, { createContext, Component, createRef } from 'react';

export const TodoContext = createContext();

export default class TodoProvider extends Component {
  state = {
    todoList: [],
    appStatus: [],
    filterType: 'all',
  };

  todoText = createRef();

  async componentDidMount() {
    this.loadTodo('all');
  }

  loadStatus = ({ type, id = -1 }) => {
    this.setState(({ appStatus }) => ({
      appStatus: [...appStatus, { type, action: 'REQUEST', id }],
    }));
  };

  errorStatus = ({ type, id = -1, error }) => {
    this.setState(({ appStatus }) => ({
      appStatus: appStatus.map(x => {
        if (x.type === type && x.id === id) {
          return { ...x, action: 'ERROR', errorMessage: error.message };
        }
        return x;
      }),
    }));
  };

  successStatus = ({ type, id = -1 }) => {
    this.setState(({ appStatus }) => ({
      appStatus: appStatus.filter(x => !(x.type === type && x.id === id)),
    }));
  };

  loadTodo = async filterType => {
    const type = 'LOAD_TODO';
    try {
      this.loadStatus({ type });
      let url = 'http://localhost:3000/todoList';

      if (filterType !== 'all') {
        url += `?isDone=${filterType === 'completed'}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json);
      }

      this.setState({ todoList: json, filterType });
      this.successStatus({ type });
    } catch (error) {
      this.errorStatus({ type, error });
    }
  };

  getRequestStatus = ({ type, id = -1 }) => {
    const { appStatus } = this.state;

    return appStatus.find(
      x => x.type === type && x.action === 'REQUEST' && x.id === id,
    );
  };

  getErrorStatus = ({ type, id = -1 }) => {
    const { appStatus } = this.state;

    return appStatus.find(
      x => x.type === type && x.action === 'ERROR' && x.id === id,
    );
  };

  addTodo = async event => {
    const type = 'ADD_TODO';
    try {
      this.loadStatus({ type });
      event.preventDefault();

      const todoText = this.todoText.current.value;

      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: todoText,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json);
      }

      this.setState(
        ({ todoList }) => ({
          todoList: [...todoList, json],
        }),
        () => {
          this.todoText.current.value = '';
        },
      );
      this.successStatus({ type });
    } catch (error) {
      this.errorStatus({ type, error });
    }
  };

  updateTodo = async item => {
    const type = 'UPDATE_TODO';
    try {
      this.loadStatus({ type, id: item.id });
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json);
      }

      this.setState(({ todoList }) => {
        // O(logN)
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
      this.successStatus({ type, id: item.id });
    } catch (error) {
      this.errorStatus({ type, error, id: item.id });
    }
  };

  deleteTodo = async item => {
    const type = 'DELETE_TODO';
    try {
      this.loadStatus({ type, id: item.id });
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json);
      }

      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
        };
      });
      this.successStatus({ type, id: item.id });
    } catch (error) {
      this.errorStatus({ type, error, id: item.id });
    }
  };

  editTodo = async item => {
    const type = 'EDIT_TODO';
    try {
      this.loadStatus({ type, id: item.id });
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, text: item.text }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json);
      }

      this.setState(({ todoList }) => {
        // O(logN)
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
      this.successStatus({ type, id: item.id });
    } catch (error) {
      this.errorStatus({ type, error, id: item.id });
    }
  };

  render() {
    const { children } = this.props;
    const { todoList, filterType } = this.state;

    return (
      <TodoContext.Provider
        value={{
          loadTodo: this.loadTodo,
          addTodo: this.addTodo,
          updateTodo: this.updateTodo,
          deleteTodo: this.deleteTodo,

          todoList,
          filterType,

          todoText: this.todoText,
          getRequestStatus: this.getRequestStatus,
          getErrorStatus: this.getErrorStatus,

          editTodo: this.editTodo,
        }}
      >
        {children}
      </TodoContext.Provider>
    );
  }
}
