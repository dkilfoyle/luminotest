import { selectCount } from "../../store/counterSlice";
import { useSelector } from "react-redux";

import "./Watcher.css";
import { ReactWidget } from "../lumino/Lumino";

const Watcher: ReactWidget = () => {
  const count = useSelector(selectCount);
  return <div className="watcher">The current count is {count}</div>;
};

export default Watcher;
