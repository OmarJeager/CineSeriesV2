import React, { createContext, useState, useContext } from "react";

const ListContext = createContext();

export const ListProvider = ({ children }) => {
  const [addToList, setAddToList] = useState([]);

  return (
    <ListContext.Provider value={{ addToList, setAddToList }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => useContext(ListContext);