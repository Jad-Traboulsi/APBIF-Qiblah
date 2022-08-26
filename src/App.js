import './styles/App.css';
import configs from './data/configs';
import { useState } from 'react';
import { GetBearing, GetDeclination, isAcceptable } from './components/LocationHelper';
import Information from './components/Info';
import Canvas from './components/Canvas';

function App() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "", name: {} },
  });
  const [declination, setDeclination] = useState({
    value: 0
  });
  const [bearing, setBearing] = useState({
    value: 0
  });
  const [latInput, setLatInput] = useState(0);
  const [lngInput, setLngInput] = useState(0);
  const [addressInput, setAddressInput] = useState("")

  const [errorMessage, setErrorMessage] = useState({
    error: false,
    message: ""
  })
  const [addressErrorMessage, setAddressErrorMessage] = useState({
    error:false,
    message:"",
  })
  async function getGeoLocation() {
    const onError = (error) => {
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
      const addressFetched = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latFetched}&lon=${lngFetched}&format=json`).then(response => response.json())
      let addressName = {}
      if (addressFetched.error) {
        addressName.error = true;
        addressName.message = addressFetched.error
      } else {
        addressName.error = false;
        addressName.display = addressFetched.display_name
      }
      setLocation({
        loaded: true,
        coordinates: {
          lat: latFetched,
          lng: lngFetched,
          name:addressName
        },
      });
      setErrorMessage({
        error: false,
        message: ""
      })
      setAddressErrorMessage({
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
      const addressFetched = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${parseFloat(latInput).toFixed(configs.decimal)}&lon=${parseFloat(lngInput).toFixed(configs.decimal) }&format=json`).then(response => response.json())
      let addressName = {}
      if(addressFetched.error){
        addressName.error = true;
        addressName.message = addressFetched.error
      } else {
        addressName.error = false;
        addressName.display = addressFetched.display_name
      }
      console.log(addressFetched);
      setLocation({
        loaded: true,
        coordinates: {
          lat: parseFloat(latInput).toFixed(configs.decimal),
          lng: parseFloat(lngInput).toFixed(configs.decimal),
          name: addressName
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
      setAddressErrorMessage({
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
  async function getLatLngFromAddress(){
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=3&addressdetails=1&q=${addressInput}`)
      .then(response => response.json())
      .then(async (data) => {
        if(data.length>0){
          
          const latFetched = Number(data[0].lat).toFixed(configs.decimal);
          const lngFetched = Number(data[0].lon).toFixed(configs.decimal)
          const addressName = { error: false, display: data[0].display_name }
          setAddressErrorMessage({
            error: false,
            message: "",
          })
          setLocation({
            loaded: true,
            coordinates: {
              lat: latFetched,
              lng: lngFetched,
              name: addressName
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
        }else{
          setAddressErrorMessage({
            error: true,
            message: "Input a valid address",
          })
        }

      })
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
      Address: 
      <input
        type="text"
        value={addressInput}
        onChange={(e) => { setAddressInput(e.target.value); }}
      />
      <br />
      <button onClick={getLatLngFromAddress}>
        Locate this Address
      </button>
      <br />
      {addressErrorMessage.error && (
        <>
          {addressErrorMessage.message}
        </>
      )}
      <br />
      <br />
      <br />
      {/* <Canvas/> */}
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
