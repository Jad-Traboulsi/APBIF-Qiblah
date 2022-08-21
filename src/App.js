import needle from './data/media/Needle Silva.png';
import back from './data/media/Back.png';
import './App.css';
import { MapContainer, TileLayer, Marker,Popup,Polyline} from 'react-leaflet'
import useGeoLocation from './components/getLocation';
import configs from './data/configs';

function App() {

  const elements = {
    compass400: {
      buttonId: "showHideCompass400",
      buttonName: "Compass 400",
      containerId: "compass400Container",
      needleId:"compass400Needle"
    },
    map: {
      buttonId: "showHideMap",
      buttonName: "Map",
      containerId: "mapContainer",
      userLocationId:"userLocation",
    }
  }
  const { location, declination, bearing } = useGeoLocation();

  
  function toggle(event){
    if (event.target.id === elements.compass400.buttonId){
      if (event.target.innerHTML === `Show ${elements.compass400.buttonName}`){
        document.getElementById(elements.compass400.containerId).style.top = "0%";
        document.getElementById(elements.compass400.buttonId).innerHTML = `Hide ${elements.compass400.buttonName}`;
        setTimeout(function(){
          document.getElementById(elements.compass400.needleId).style.transform = `rotate(${(360 - (bearing.value - Number(declination.value))).toFixed(configs.decimal)}deg)`;
        },550);
      } else if (event.target.innerHTML === `Hide ${elements.compass400.buttonName}`){
        document.getElementById(elements.compass400.containerId).style.top = "-100%";
        document.getElementById(elements.compass400.buttonId).innerHTML = `Show ${elements.compass400.buttonName}`;
        setTimeout(function () {
          document.getElementById(elements.compass400.needleId).style.transform="rotate(0deg)"
        }, 550);
      }
    } else if (event.target.id === elements.map.buttonId) {
      if (event.target.innerHTML === `Show ${elements.map.buttonName}`) {
          document.getElementById(elements.map.containerId).style.top = "0%";
        document.getElementById(elements.map.buttonId).innerHTML = `Hide ${elements.map.buttonName}`;
      } else if (event.target.innerHTML === 'Hide Map') {
        document.getElementById(elements.map.containerId).style.top = "-100%";
        document.getElementById(elements.map.buttonId).innerHTML = `Show ${elements.map.buttonName}`;
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
      {location.loaded && !location.error && declination.loaded && !declination.error && (<>
        <span>Your location is {location.coordinates.lat}, {location.coordinates.lng}</span>
        <br />
        <span>Your location has magnetic declination of {declination.value}</span>

        <br/>
        Qiblah Heading: {bearing.value}
        <br/>
        Qiblah Magnetic: {(bearing.value - Number(declination.value)).toFixed(configs.decimal)}
        <br/>
        Compass 360 number: {(360 - (bearing.value - Number(declination.value))).toFixed(configs.decimal)}
        <br/>
        Compass 400 number: {((360 - (bearing.value - Number(declination.value)))/0.9).toFixed(configs.decimal)}
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
        <div id='compassBox'>
          <div id={elements.compass400.containerId}>
            <div className='compass'>
              <img src={back} alt="back" className='back' />
              <img src={needle} id={elements.compass400.needleId} className='needle' alt="needle"/>
              <br />
            </div>
            <span className='compassIndicator'>{((360 - (bearing.value - Number(declination.value))) / 0.9).toFixed(configs.decimal)}</span>
          </div>
        </div>
        <div id='mapBox'>
          <div id={elements.map.containerId}>
            <MapContainer center={[location.coordinates.lat, location.coordinates.lng]} zoom={18}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.coordinates.lat, location.coordinates.lng]} className={elements.map.userLocationId}>
                <Popup>
                  Your location: {location.coordinates.lat}, {location.coordinates.lng}
                  <br/>
                  Qiblah Heading: {bearing.value}
                </Popup>
              </Marker>
              <Marker position={[configs.kaaba.lat, configs.kaaba.lng]}>
                <Popup >
                  Kaaba {configs.kaaba.lat}, {configs.kaaba.lng}
                </Popup>
              </Marker>
              <Polyline positions={[[location.coordinates.lat, location.coordinates.lng], [configs.kaaba.lat, configs.kaaba.lng]]} />
            </MapContainer>
          </div>
        </div>
      </>)}

    </div>
  );
}

export default App;
