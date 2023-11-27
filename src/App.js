import React, { useState, useEffect } from "react";
import needle from "./data/image/needle_1.png";
import back from "./data/image/back_1.png";
import "./styles/App.css";

function App() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRotation((prevRotation) => prevRotation + 1);
    }, 40);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <img
        src={back}
        alt="back"
        className="backImage"
      />
      <img
        src={needle}
        alt="needle"
        className="needleImage"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </div>
  );
}

export default App;
