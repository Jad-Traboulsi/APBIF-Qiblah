import { useState } from "react"
import configs from "../data/configs"
import Compass400 from "./Compass400"
import { MapContext, Compass400Context, CompassPhoneContext } from "./Contexts"
import Map from "./Map"
import CompassPhone from "./CompassPhone"

const Information = ({ declination, bearing, location }) => {

    const [showCompass400, setShowCompass400] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [showCompassPhone, setShowCompassPhone] = useState(false)
    const [buttons, setButtons] = useState({
        compass400: "Show Compass 400",
        map: "Show Map",
        compassPhone: "Show Compass Phone"
    })
    const buttonIds = {
        compass400: "showHideCompass400",
        map: "showHideMap",
        compassPhone: "showHideCompassPhone",
    }
    function toggle(event) {
        let old = buttons
        if (event.target.id === buttonIds.compass400) {
            if (showCompass400) {
                old.compass400 = "Show Compass 400"
                setButtons(old)
                setShowCompass400(false)
            }
            else {
                old.compass400 = "Hide Compass 400"
                setButtons(old)
                setShowCompass400(true)

                old.map = "Show Map"
                setButtons(old)
                setShowMap(false)
                
                old.compassPhone = "Show Compass Phone"
                setButtons(old)
                setShowCompassPhone(false)
            }

        } else if (event.target.id === buttonIds.map) {
            if (showMap) {
                old.map = "Show Map"
                setButtons(old)
                setShowMap(false)
            }
            else {
                old.map = "Hide Map"
                setButtons(old)
                setShowMap(true)

                old.compass400 = "Show Compass 400"
                setButtons(old)
                setShowCompass400(false)

                old.compassPhone = "Show Compass Phone"
                setButtons(old)
                setShowCompassPhone(false)
            }
        } else if (event.target.id === buttonIds.compassPhone) {
            if (showCompassPhone) {
                old.compassPhone = "Show Compass Phone"
                setButtons(old)
                setShowCompassPhone(false)
            }
            else {
                old.compassPhone = "Hide Compass Phone"
                setButtons(old)
                setShowCompassPhone(true)

                old.map = "Show Map"
                setButtons(old)
                setShowMap(false)

                old.compass400 = "Show Compass 400"
                setButtons(old)
                setShowCompass400(false)
            }
        }
    }

    return (
        <>
            <div className="infoText" style={{ marginTop: '20px' }}>
                {location.coordinates.name.error ? (<span>{location.coordinates.name.message}</span>) : (<span>Your location name {location.coordinates.name.display}</span>)}
                <br />
                <span>Your location coordinates {location.coordinates.lat}, {location.coordinates.lng}</span>
                <br />
                <span>Your location has magnetic declination of {declination.value}</span>
                <br />
                Qiblah Heading: {bearing.value}
                <br />
                Qiblah Magnetic: {(bearing.value - Number(declination.value)).toFixed(configs.decimal)}
                <br />
                Compass 360 number: {(360 - (bearing.value - Number(declination.value))).toFixed(configs.decimal)}
                <br />
                Compass 400 number: {((360 - (bearing.value - Number(declination.value))) / 9).toFixed(configs.decimal)}
                <br />
            </div>
            <br />
            <button id={buttonIds.compass400} onClick={toggle}>
                {buttons.compass400}
            </button>
            <br />
            <button id={buttonIds.map} onClick={toggle}>
                {buttons.map}
            </button>
            <br />
            <button id={buttonIds.compassPhone} onClick={toggle}>
                {buttons.compassPhone}
            </button>
            <br />
            <Compass400Context.Provider value={[showCompass400]} >
                <Compass400
                    bearing={bearing.value}
                    declination={declination.value}
                    location={location.coordinates.name.address}
                />
            </Compass400Context.Provider>
            <MapContext.Provider value={[showMap]} >
                <Map
                    location={location}
                    bearing={bearing}
                />
            </MapContext.Provider>
            <CompassPhoneContext.Provider value={[showCompassPhone]} >
                <CompassPhone
                    angle={Number((bearing.value - Number(declination.value)).toFixed(0))}
                    location={location.coordinates.name.address}
                />
            </CompassPhoneContext.Provider>
        </>
    )
}

export default Information