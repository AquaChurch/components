import React, { useState, useCallback, ChangeEvent, useMemo } from 'react';
import { debounce } from 'lodash';
const SearchFixed = () => {
  const [userQuery, setUserQuery] = useState('');
  const sendQuery = (str: string) => {
    //todo
    console.log(str);
  };
  // const delayedQuery = useCallback(debounce(sendQuery, 500), []);
  const delayedQuery = useMemo(() => {
    return debounce(sendQuery, 500);
  }, []);
  // const delayedQuery = debounce(sendQuery, 500); //error
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserQuery(e.target.value);
    delayedQuery(e.target.value);
  };
  return (
    <div>
      <label>Search Fixed:</label>
      <input onChange={onChange} value={userQuery} />
    </div>
  );
};

export default SearchFixed;
