import React from "react";
import PlankHoldTimer from "./PlankHoldCounter";
import FitnessDetector from './FitnessDetector';
import FitnessTracker from './FitnessTracker';
import PushupCounter from "./PushupCounter";
import BicepCurlCounter from "./BicepCurlCounter";

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


      </header>
    </>
  );
}

export default App;
