
import L from 'leaflet';
import 'leaflet-simple-map-screenshoter'
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

function ScreenShooter(props) {
    const map = useMap();
    useEffect(() => {
        const control = L.simpleMapScreenshoter({
            ...props
        });
        map.addControl(control)
        return () => {
            map.removeControl(control);
        }
    }, [map,props]);


    return null;
}
export default ScreenShooter