import React from "react";
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
        <FitnessTracker />

      </header>
    </>
  );
}

export default App;
