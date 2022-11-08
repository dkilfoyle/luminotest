import React from "react";
import Lumino from "./components/lumino/Lumino";
import { useAppDispatch } from "./store/store";
import { addIncrementor, addDecrementor, addWatcher } from "./store/widgetsSlice";

import "./App.css";

function App() {
  const dispatch = useAppDispatch();
  return (
    <div className="App">
      <button onClick={() => dispatch(addIncrementor())}>Add Incrementor!</button>
      <button onClick={() => dispatch(addDecrementor())}>Add Decrementor!</button>
      <button onClick={() => dispatch(addWatcher())}>Add Watcher!</button>
      <Lumino />
    </div>
  );
}

export default App;
