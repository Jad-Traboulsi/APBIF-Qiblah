import configs from '../data/configs';
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayersControl } from 'react-leaflet'

function Map(input){
    const {location,bearing,mapRef,markerRef} = input.input

    const { BaseLayer } = LayersControl

    return(
        <MapContainer
            center={[location.coordinates.lat, location.coordinates.lng]}
            zoom={18}
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
    )

}

export default Map