import React, { useState } from "react";

export const AppStateContext = React.createContext(null);

export default function AppStateProvider({ children }) {
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const state = {
    cartChanged,
    setCartChanged,
    searchedProducts,
    setSearchedProducts,
  };

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
}
