import { increment } from "../../store/counterSlice";
import "./Incrementor.css";
import { useAppDispatch } from "../../store/store";
import { ReactWidget } from "../lumino/Lumino";

const Incrementor: ReactWidget = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="incrementor">
      <button onClick={() => dispatch(increment())}>Increment Count</button>
    </div>
  );
};

export default Incrementor;
