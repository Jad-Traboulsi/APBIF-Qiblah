import './styles/App.css';
import configs from './data/configs';
import { useState } from 'react';
import { GetBearing, GetDeclination, isAcceptable } from './components/LocationHelper';
import Information from './components/Info';

function App() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });
  const [declination, setDeclination] = useState({
    value: 0
  });
  const [bearing, setBearing] = useState({
    value: 0
  });
  const [latInput, setLatInput] = useState(0);
  const [lngInput, setLngInput] = useState(0);
  const [errorMessage, setErrorMessage] = useState({
    error: false,
    message: ""
  })
  async function getGeoLocation() {
    const onError = (error) => {
      console.log(error);
      setLocation({
        loaded: true,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    };
    const onSuccess = async (location) => {
      const latFetched = location.coords.latitude.toFixed(configs.decimal)
      const lngFetched = location.coords.longitude.toFixed(configs.decimal)
      setLocation({
        loaded: true,
        coordinates: {
          lat: latFetched,
          lng: lngFetched,
        },
      });
      setErrorMessage({
        error: false,
        message: ""
      })
      setLatInput(latFetched)
      setLngInput(lngFetched)
      setBearing({
        value: GetBearing(latFetched, lngFetched)
      })
      setDeclination(await GetDeclination(latFetched, lngFetched))
    }
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }
  async function getCustomLocation() {
    const result = isAcceptable(latInput, lngInput)
    if (result.acceptable) {
      setLocation({
        loaded: true,
        coordinates: {
          lat: parseFloat(latInput).toFixed(configs.decimal),
          lng: parseFloat(lngInput).toFixed(configs.decimal),
        },
      });
      setBearing({
        value: GetBearing(latInput, lngInput)
      })
      setDeclination(await GetDeclination(latInput, lngInput))
      setErrorMessage({
        error: false,
        message: ""
      })
    } else {
      setErrorMessage({
        error: true,
        message: result.message
      })
    }
  }

  

  return (
    <div className="main">
      {location.loaded && location.error && (<>
        {location.error.message}
      </>)}
      <br />

      Lat:
      <input
        type="text"
        value={latInput}
        onChange={(e) => { setLatInput(e.target.value); }}
      />
      <br />
      Long:
      <input
        type="text"
        value={lngInput}
        onChange={(e) => { setLngInput(e.target.value); }}
      />
      <br />
      <button onClick={getCustomLocation}>
        Locate this position
      </button>
      <br />
      {errorMessage.error && (
        <>
          {errorMessage.message}
        </>
      )}
      <br />
      <button onClick={getGeoLocation}>
        Locate Me
      </button>
      <br />
      <br />
      <br />
      <br />
      {location.loaded && !location.error && !bearing.error && !declination.error && !errorMessage.error && (<>
        <Information
          bearing={bearing}
          location={location}
          declination={declination}
        />
      </>)}


    </div>
  );
}

export default App;
