import { useState, useEffect } from "react";
import axios from "axios";
import configs from "../data/configs";

const useGeoLocation = () => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" },
    });
    const [declination, setDeclination] = useState({
        loaded: false,
        value: 0
    });
    const [bearing, setBearing] = useState({
        loaded: false,
        value: 0
    });

    

    

    const onError = (error) => {
        setLocation({
            loaded: true,
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            onError({
                code: 0,
                message: "Geolocation not supported",
            });
        }
        function changeDegToRad(x) {
            return x * Math.PI / 180;
        }
        const getBearing = (lat1, lng1) => {

            let Δλ = changeDegToRad(configs.kaaba.lng) - changeDegToRad(lng1)

            const Δψ = Math.log(Math.tan(Math.PI / 4 + changeDegToRad(configs.kaaba.lat) / 2) / Math.tan(Math.PI / 4 + changeDegToRad(lat1) / 2));

            // if dLon over 180° take shorter rhumb line across the anti-meridian:
            if (Math.abs(Δλ) > Math.PI) Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);

            const brng = Math.atan2(Δλ, Δψ) * 180 / Math.PI;
            setBearing({
                loaded: false,
                value: brng.toFixed(configs.decimal)
            })
        }
        const onSuccess = (location) => {
            const latFetched = location.coords.latitude.toFixed(configs.decimal)
            const lngFetched = location.coords.longitude.toFixed(configs.decimal)
            setLocation({
                loaded: true,
                coordinates: {
                    lat: latFetched,
                    lng: lngFetched,
                },
            });
            axios.get(`https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination`, {
                params: {
                    key: "zNEw7",
                    lat1: latFetched,
                    lon1: lngFetched,
                    resultFormat: "json"
                }
            }).then((res) => {
                setDeclination({
                    loaded: true,
                    value: res.data.result[0].declination.toFixed(configs.decimal)
                })
                getBearing(latFetched, lngFetched)
            }).catch(() => {
                setDeclination({
                    loaded: false,
                    error: "Error fetching Declination"
                })
                setBearing({
                    loaded: false,
                    error: "Error fetching Bearing"
                })
            })
        };
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return {location,declination,bearing};
};

export default useGeoLocation;
