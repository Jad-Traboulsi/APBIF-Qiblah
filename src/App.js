import './styles/App.css';
import useGeoLocation from './components/getLocation';
import configs from './data/configs';
import { useRef, useState } from 'react';
import Compass400 from './components/Compass400';
import Map from './components/Map';

function App() {
  const [show, setShow] = useState({
    compass400: false,
    map: false
  })
  const elements = {
    compass400: {
      buttonId: "showHideCompass400",
      buttonName: "Compass 400",
      containerId: "compass400Container",
      needleId: "compass400Needle",
      compassTextId: "compass400Text",
      compassBoxId: "compass400Box"
    },
    map: {
      buttonId: "showHideMap",
      buttonName: "Map",
      containerId: "mapContainer",
      mapBoxId: "mapBox"
    }
  }
  const { location, declination, bearing } = useGeoLocation();

  const mapRef = useRef(null)
  const markerRef = useRef(null)

  function openAndCenterMarker() {
    const map = mapRef.current
    if (!map) {
      return
    }
    map.flyTo([Number(location.coordinates.lat), Number(location.coordinates.lng)], configs.zoomLevel)
    const marker = markerRef.current
    if (marker) {
      marker.openPopup()
    }
  }
  function toggle(event) {
    if (event.target.id === elements.compass400.buttonId) {
      let temp = show;
      if (temp.compass400)
        temp.compass400 = false;
      else
        temp.compass400 = true;
      setShow(temp)
      console.log(temp);
      if (event.target.innerHTML === `Show ${elements.compass400.buttonName}`) {
        document.getElementById(elements.compass400.compassBoxId).style.display = "block";
        setTimeout(() => {
          document.getElementById(elements.compass400.containerId).style.top = "0%";
          document.getElementById(elements.compass400.buttonId).innerHTML = `Hide ${elements.compass400.buttonName}`;
          setTimeout(function () {
            document.getElementById(elements.compass400.needleId).style.transform = `rotate(${(360 - (bearing.value - Number(declination.value))).toFixed(configs.decimal)}deg)`;
            document.getElementById(elements.compass400.compassTextId).innerHTML = `${((360 - (bearing.value - Number(declination.value))) / 0.9).toFixed(configs.decimal)}`;
          }, 550);
        }, 200)

      } else if (event.target.innerHTML === `Hide ${elements.compass400.buttonName}`) {
        document.getElementById(elements.compass400.compassBoxId).style.display = "block";
        setTimeout(() => {
          document.getElementById(elements.compass400.containerId).style.top = "-100%";
          document.getElementById(elements.compass400.buttonId).innerHTML = `Show ${elements.compass400.buttonName}`;
          setTimeout(function () {
            document.getElementById(elements.compass400.needleId).style.transform = "rotate(0deg)"
            document.getElementById(elements.compass400.compassTextId).innerHTML = `0`;
            document.getElementById(elements.compass400.compassBoxId).style.display = "none";
          }, 550);
        }, 200)

      }
    } else if (event.target.id === elements.map.buttonId) {

      let temp = show;
      if (temp.map)
        temp.map = false;
      else
        temp.map = true;
      setShow(temp)
      if (event.target.innerHTML === `Show ${elements.map.buttonName}`) {
        document.getElementById(elements.map.mapBoxId).style.display = "block";
        setTimeout(() => {
          document.getElementById(elements.map.containerId).style.top = "0%";
          document.getElementById(elements.map.buttonId).innerHTML = `Hide ${elements.map.buttonName}`;
          openAndCenterMarker()
        }, 200)
      } else if (event.target.innerHTML === `Hide ${elements.map.buttonName}`) {
        document.getElementById(elements.map.mapBoxId).style.display = "block";
        document.getElementById(elements.map.containerId).style.top = "-100%";
        document.getElementById(elements.map.buttonId).innerHTML = `Show ${elements.map.buttonName}`;

        setTimeout(() => {
          document.getElementById(elements.map.mapBoxId).style.display = "none";
        }, 700)
      }
    }
  }

  return (
    <div className="main">
      {location.loaded && location.error && (<>
        {location.error.message}
      </>)}
      {!location.loaded && (<>
        Loading location
      </>)}
      {declination.error && (<>
        {declination.error}
      </>)}
      {location.loaded && !location.error && !bearing.error && !declination.error && (<>
        <span>Your location is {location.coordinates.lat}, {location.coordinates.lng}</span>
        <br />
        <span>Your location has magnetic declination of {declination.value}</span>

        <br />
        Qiblah Heading: {bearing.value}
        <br />
        Qiblah Magnetic: {(bearing.value - Number(declination.value)).toFixed(configs.decimal)}
        <br />
        Compass 360 number: {(360 - (bearing.value - Number(declination.value))).toFixed(configs.decimal)}
        <br />
        Compass 400 number: {((360 - (bearing.value - Number(declination.value))) / 0.9).toFixed(configs.decimal)}
        <br />
        <br />
        <button id={elements.compass400.buttonId} onClick={toggle}>
          Show {elements.compass400.buttonName}
        </button>
        <br />
        <button id={elements.map.buttonId} onClick={toggle}>
          Show {elements.map.buttonName}
        </button>
        <br />
        <Compass400 
          boxId={elements.compass400.compassBoxId}
          containerId={elements.compass400.containerId}
          needleId={elements.compass400.needleId}
          compassTextId={elements.compass400.compassTextId}
          clicked={show} />
        <Map 
          location={location}
          bearing={bearing}
          mapRef={mapRef}
          markerRef={markerRef}
          boxId={elements.map.mapBoxId}
          containerId={elements.map.containerId} />
      </>)}

    </div>
  );
}

export default App;
