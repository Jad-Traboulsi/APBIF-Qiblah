import needle from './media/Needle Silva.png';
import back from './media/Back Silva.png';
import {useState} from 'react'
import './App.css';
function App() {
  let [angle,setAngle] = useState(0)
  function activateLasers(){
    setAngle(angle+45)
    console.log(angle+45);
  }
  return (
    <div className="main">
      <button onClick={activateLasers}>
        Activate Lasers
      </button>
      <div className='compass'>
        <img src={back} alt="back" className='back'/> 
        <img src={needle} className='needle' alt="needle" style={{ transform: `rotate(${angle}deg)` }} />
      </div>
    </div>
  );
}

export default App;
