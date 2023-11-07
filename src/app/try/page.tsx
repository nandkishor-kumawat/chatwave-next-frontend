"use client";

import { decrement, increment } from "@/redux/features/counterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";




export default function Home() {
  //useSelector gets the state from store
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1> {/* Display the counter state */}
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}