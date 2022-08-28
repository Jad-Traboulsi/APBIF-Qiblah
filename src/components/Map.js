import configs from '../data/configs';
import '../styles/Map.css'
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet'
import { MapContext } from './Contexts';
import { useContext, useEffect, useRef } from 'react';

function Map({ location, bearing, boxId, containerId, buttonId }) {
    const [showMap] = useContext(MapContext)

    const mapRef = useRef(null)
    const markerRef = useRef(null)
    useEffect(() => {
        function openAndCenterMarker() {
            const map = mapRef.current
            if (!map) {
                return
            }
            map.attributionControl.setPrefix("")
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
                openAndCenterMarker()
            }, 200)
        } else {
            document.getElementById(boxId).style.display = "block";
            document.getElementById(containerId).style.top = "-100%";

            setTimeout(() => {
                document.getElementById(boxId).style.display = "none";
            }, 700)
        }

    }, [buttonId, boxId, containerId, location, showMap])

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
                    }}
                    >
                    <LayersControl>
                        <BaseLayer checked name="Basic View 1">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='Edited by <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                        </BaseLayer>

                        <BaseLayer name="Basic View 2">
                            <TileLayer
                                url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png'
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                subdomains={['a', 'b', 'c', 'd']}
                                maxZoom={20}
                            />
                        </BaseLayer>

                        <BaseLayer name="Basic View 3">
                            <TileLayer
                                url='https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png'
                                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                                maxZoom={20}
                            />
                        </BaseLayer>

                        <BaseLayer name="Satellite View 1">
                            <TileLayer
                                url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                                maxZoom={20}
                                subdomains={['mt1', 'mt2', 'mt3']}
                                attribution='Edited by Google Map contributors'
                            />
                        </BaseLayer>

                        <BaseLayer name="Satellite View 2">
                            <TileLayer
                                url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            />
                        </BaseLayer>

                    </LayersControl>

                    <Marker ref={markerRef} position={[location.coordinates.lat, location.coordinates.lng]}>
                        <Popup>
                            Location: {location.coordinates.lat}, {location.coordinates.lng}
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