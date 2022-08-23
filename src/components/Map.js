import configs from '../data/configs';
import '../styles/Map.css'
import '../styles/Compass400.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet'
import { MapContext } from './Contexts';
import { useContext, useEffect, useRef } from 'react';

function Map({ location, bearing, boxId, containerId, buttonId, buttonName }) {
    const [showMap] = useContext(MapContext)

    const mapRef = useRef(null)
    const markerRef = useRef(null)
    useEffect(() => {
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
        if (showMap) {
            document.getElementById(boxId).style.display = "block";
            setTimeout(() => {
                document.getElementById(containerId).style.top = "0%";
                document.getElementById(buttonId).innerHTML = `Hide ${buttonName}`;
                openAndCenterMarker()
            }, 200)
        } else {
            document.getElementById(boxId).style.display = "block";
            document.getElementById(containerId).style.top = "-100%";
            document.getElementById(buttonId).innerHTML = `Show ${buttonName}`;

            setTimeout(() => {
                document.getElementById(boxId).style.display = "none";
            }, 700)
        }

    }, [buttonId, boxId, buttonName, containerId, location, showMap])

    const { BaseLayer } = LayersControl

    return (
        <div id={boxId}>
            <div id={containerId}>
                <MapContainer
                    center={[location.coordinates.lat, location.coordinates.lng]}
                    zoom={configs.zoomLevel}
                    ref={mapRef}
                    whenReady={(map) => {
                        mapRef.current = map
                    }}>
                    <LayersControl>
                        <BaseLayer checked name="Basic View">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </BaseLayer>

                        <BaseLayer name="Satellite View">
                            <TileLayer
                                url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                maxZoom={20}
                                subdomains={['mt1', 'mt2', 'mt3']}
                            />
                        </BaseLayer>
                    </LayersControl>

                    <Marker ref={markerRef} position={[location.coordinates.lat, location.coordinates.lng]}>
                        <Popup>
                            Your location: {location.coordinates.lat}, {location.coordinates.lng}
                            <br />
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
    )

}

export default Map