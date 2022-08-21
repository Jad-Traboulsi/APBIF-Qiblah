import needle from './media/Needle Silva.png';
import back from './media/Back.png';
import {useState} from 'react'
import axios from 'axios'
import './App.css';

function App() {
  let [compassAngleDegree, setcompassAngleDegree] = useState(0)
  let [compassAngleGrad, setcompassAngleGrad] = useState(0)
  let [bearingCalculated, setBearingCalculated] = useState(0)
  let [magneticDeclination, setMagneticDeclination] = useState(0)
  let [lat, setLat] = useState(0)
  let [long, setLong] = useState(0)
  const kaabaLat = 21.422493;
  const kaabaLong = 39.826202;

  function getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latFound = position.coords.latitude.toFixed(4)
        const longFound = position.coords.longitude.toFixed(4)
        setLat(latFound);
        setLong(longFound);
        getBearing(longFound, latFound)
        getDeviation(longFound, latFound)
      });
    } else {
      console.log("Not Available");
    }
  }
  function changeDegToRad(x) {
    return x * Math.PI / 180;
  }
  function changeDegToGrad(x){
    return x/0.9;
  }
  function getBearing(long1,lat1){

    const y = Math.sin(changeDegToRad(kaabaLong) - changeDegToRad(long1)) * Math.cos(changeDegToRad(kaabaLat));
    const x = Math.cos(changeDegToRad(lat1)) * Math.sin(changeDegToRad(kaabaLat)) -
      Math.sin(changeDegToRad(lat1)) * Math.cos(changeDegToRad(kaabaLat)) * Math.cos(changeDegToRad(kaabaLong) - changeDegToRad(long1));

    const θ = Math.atan2(y, x);
    const brng = (θ * 180 / Math.PI + 360) % 360; // in degrees
    console.log(`Bearing Calculated = ${brng.toFixed(3)}`)
    setBearingCalculated(brng.toFixed(3))
  }
  function getAngle() {
    setcompassAngleDegree(bearingCalculated);
    setcompassAngleGrad(changeDegToGrad(bearingCalculated))
  }
  async function getDeviation(longitute,latitude){
    const res = await axios.get(`https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination`,{
      params: {
        key: "zNEw7",
        lat1: latitude.toString(),
        lon1: longitute.toString(),
        resultFormat: "json"
      }
    })
    setMagneticDeclination(res.data.result[0].declination)
    console.log(`Magnetic declination of location = ${res.data.result[0].declination}`);
  }
  function toggle(){
    let text = document.getElementById('showHideCompass').innerHTML;
    if(text==="Show"){
      document.getElementsByClassName('compassContainer')[0].style.top = "0%";
      document.getElementById('showHideCompass').innerHTML = 'Hide';
      setTimeout(function(){
        getAngle();
      },550);
    }else if(text === 'Hide'){
      document.getElementsByClassName('compassContainer')[0].style.top = "-100%";
      document.getElementById('showHideCompass').innerHTML = 'Show';
      setTimeout(function () {
        setcompassAngleDegree(0);
      }, 500);
    }
  }

  return (
    <div className="main">
      <button onClick={getLocation}>
        Get Location
      </button>
      <br />
      <span>Your location is {lat}, {long}</span>
      <br />
      <br />
      <button id="showHideCompass" onClick={toggle}>
        Show
      </button>
      <br />
      <div className='compassBox'> 
        <div className='compassContainer'>
          <div className='compass'>
            <img src={back} alt="back" className='back'/> 
            <img src={needle} className='needle' alt="needle" style={{ transform: `rotate(${compassAngleDegree}deg)` }} />
            <br/>
          </div>
          <span className='compassIndicator'>{compassAngleGrad}</span>
        </div>
      </div>

    </div>
  );
}

export default App;
