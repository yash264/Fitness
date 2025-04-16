import React from "react";
import FitnessDetector from './FitnessDetector';
import FitnessTracker from './FitnessTracker';

function App() {

  
  return (
    <>
      <header >

        <p>
          welcome to client side.
        </p>

        <FitnessDetector mode="pushup" />

        <FitnessTracker />

      </header>
    </>
  );
}

export default App;
