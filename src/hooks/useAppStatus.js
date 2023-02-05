import { useState, useCallback } from 'react';

export default function useAppStatus() {
  const [appStatus, setAppStatus] = useState([]);

  const loadStatus = useCallback(({ type, id = -1 }) => {
    setAppStatus(status => [...status, { type, action: 'REQUEST', id }]);
  });

  const errorStatus = useCallback(({ type, id = -1, error }) => {
    setAppStatus(status =>
      status.map(x => {
        if (x.type === type && x.id === id) {
          return { ...x, action: 'ERROR', errorMessage: error.message };
        }
        return x;
      }),
    );
  });

  const successStatus = useCallback(({ type, id = -1 }) => {
    setAppStatus(status =>
      status.filter(x => !(x.type === type && x.id === id)),
    );
  });

  return {
    appStatus,
    loadStatus,
    errorStatus,
    successStatus,
  };
}
