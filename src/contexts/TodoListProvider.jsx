import PropTypes from 'prop-types';
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import useAppStatus from '../hooks/useAppStatus';

export const TodoListContext = createContext();

export default function TodoListProvider({ children }) {
  const [todoList, setTodoList] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const { appStatus, errorStatus, successStatus, loadStatus } = useAppStatus();
  const todoTextRef = useRef(null);

  const loadTodo = useCallback(
    async ft => {
      const type = 'LOAD_TODO';
      try {
        loadStatus({ type });
        let url = 'http://localhost:3000/todoList';

        if (ft !== 'all') {
          url += `?isDone=${ft === 'completed'}`;
        }

        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json);
        }

        setTodoList(json);
        setFilterType(ft);
        successStatus({ type });
      } catch (error) {
        errorStatus({ type, error });
      }
    },
    [errorStatus, successStatus, loadStatus],
  );

  const addTodo = useCallback(
    async event => {
      const type = 'ADD_TODO';
      try {
        loadStatus({ type });
        event.preventDefault();

        const todoText = todoTextRef.current.value;

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

        console.log('RESPONSE', res);

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json);
        }

        setTodoList(val => [...val, json]);

        todoTextRef.current.value = '';

        successStatus({ type });
      } catch (error) {
        errorStatus({ type, error });
      }
    },
    [errorStatus, successStatus, loadStatus],
  );

  const updateTodo = useCallback(
    async item => {
      const type = 'UPDATE_TODO';
      try {
        loadStatus({ type, id: item.id });
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

        setTodoList(todo => {
          const index = todo.findIndex(x => x.id === item.id);
          return [...todo.slice(0, index), json, ...todo.slice(index + 1)];
        });

        successStatus({ type, id: item.id });
      } catch (error) {
        errorStatus({ type, error, id: item.id });
      }
    },
    [errorStatus, successStatus, loadStatus],
  );

  const deleteTodo = useCallback(
    async item => {
      const type = 'DELETE_TODO';
      try {
        loadStatus({ type, id: item.id });
        const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
          method: 'DELETE',
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json);
        }

        setTodoList(todo => {
          const index = todo.findIndex(x => x.id === item.id);
          return [...todo.slice(0, index), ...todo.slice(index + 1)];
        });

        successStatus({ type, id: item.id });
      } catch (error) {
        errorStatus({ type, error, id: item.id });
      }
    },
    [errorStatus, successStatus, loadStatus],
  );

  const editTodo = useCallback(
    async item => {
      const type = 'EDIT_TODO';
      try {
        loadStatus({ type, id: item.id });
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

        setTodoList(todo => {
          const index = todo.findIndex(x => x.id === item.id);
          return [...todo.slice(0, index), json, ...todo.slice(index + 1)];
        });

        successStatus({ type, id: item.id });
      } catch (error) {
        errorStatus({ type, error, id: item.id });
      }
    },
    [errorStatus, successStatus, loadStatus],
  );

  const getRequestStatus = useCallback(
    ({ type, id = -1 }) =>
      appStatus.find(
        x => x.type === type && x.action === 'REQUEST' && x.id === id,
      ),
    [appStatus],
  );

  const getErrorStatus = useCallback(
    ({ type, id = -1 }) =>
      appStatus.find(
        x => x.type === type && x.action === 'ERROR' && x.id === id,
      ),
    [appStatus],
  );

  useEffect(() => {
    loadTodo('all');
  }, []);

  const value = useMemo(
    () => ({
      todoList,
      appStatus,
      filterType,
      todoTextRef,
      loadTodo,
      addTodo,
      updateTodo,
      deleteTodo,
      editTodo,
      getRequestStatus,
      getErrorStatus,
    }),
    [
      todoList,
      appStatus,
      filterType,
      loadTodo,
      addTodo,
      updateTodo,
      deleteTodo,
      getRequestStatus,
      getErrorStatus,
    ],
  );

  return (
    <TodoListContext.Provider value={value}>
      {children}
    </TodoListContext.Provider>
  );
}

export const useTodo = () => useContext(TodoListContext);

TodoListProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
