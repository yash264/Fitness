import React from "react";
import FitnessDetector from './FitnessDetector';
import FitnessTracker from './FitnessTracker';
import PushupCounter from "./PushupCounter";

function App() {

  
  return (
    <>
      <header >

        <p>
          welcome to client side.
        </p>

        {/* <FitnessDetector mode="pushup" /> */}
        <PushupCounter />

        <FitnessTracker />

      </header>
    </>
  );
}

export default App;
