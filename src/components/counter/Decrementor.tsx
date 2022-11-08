import { decrement } from "../../store/counterSlice";
import "./Decrementor.css";
import { useAppDispatch } from "../../store/store";
import { ReactWidget } from "../lumino/Lumino";

const Decrementor: ReactWidget = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="decrementor">
      <button onClick={() => dispatch(decrement())}>Decrement Count</button>
    </div>
  );
};

export default Decrementor;
