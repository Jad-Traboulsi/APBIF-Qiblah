import { useState } from "react"
import configs from "../data/configs"
import Compass400 from "./Compass400"
import { MapContext,Compass400Context } from "./Contexts"
import Map from "./Map"

const Information = ({declination,bearing,location}) => {

    const [showCompass400, setShowCompass400] = useState(false)
    const [showMap, setShowMap] = useState(false)
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
    function toggle(event) {
        if (event.target.id === elements.compass400.buttonId) {
            if (showCompass400)
                setShowCompass400(false)
            else
                setShowCompass400(true)

        } else if (event.target.id === elements.map.buttonId) {
            if (showMap)
                setShowMap(false)
            else
                setShowMap(true)
        }
    }

    return (
        <>
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

            <Compass400Context.Provider value={[showCompass400]} >
                <Compass400
                    boxId={elements.compass400.compassBoxId}
                    containerId={elements.compass400.containerId}
                    needleId={elements.compass400.needleId}
                    compassTextId={elements.compass400.compassTextId}
                    buttonId={elements.compass400.buttonId}
                    buttonName={elements.compass400.buttonName}
                    bearing={bearing.value}
                    declination={declination.value} />
            </Compass400Context.Provider>
            <MapContext.Provider value={[showMap]} >
                <Map
                    location={location}
                    bearing={bearing}
                    boxId={elements.map.mapBoxId}
                    containerId={elements.map.containerId}
                    buttonId={elements.map.buttonId}
                    buttonName={elements.map.buttonName}
                />
            </MapContext.Provider>
        </>
    )
}

export default Information