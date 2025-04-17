import React from "react";
import PlankHoldTimer from "./PlankHoldCounter";
import FitnessTracker from './FitnessTracker';
import PushupCounter from "./PushupCounter";
import BicepCurlCounter from "./BicepCurlCounter";
import SquatCounter from "./SquatCounter";

function App() {

  
  return (
    <>
      <header >

        <p>
          welcome to client side.
        </p>

        {/* <FitnessDetector mode="pushup" /> */}
        <PushupCounter />
        <BicepCurlCounter/>
        <PlankHoldTimer />
        <FitnessTracker />
        <SquatCounter />

      </header>
    </>
  );
}

export default App;
