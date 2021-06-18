import React, { useState } from "react";

export const AppStateContext = React.createContext(null);

export default function AppStateProvider({ children }) {
  const [cartChanged, setCartChanged] = useState(false);
  const state = { cartChanged, setCartChanged };

  return (
    <AppStateContext.Provider value={state}>
      {children}
    </AppStateContext.Provider>
  );
}
