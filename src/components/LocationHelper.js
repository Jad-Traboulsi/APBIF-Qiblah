import configs from "../data/configs";
import geoMagFactory from "./getDeviation";

export const GetBearing = (lat, lng) => {

    let Δλ = changeDegToRad(configs.kaaba.lng) - changeDegToRad(lng)

    const Δψ = Math.log(Math.tan(Math.PI / 4 + changeDegToRad(configs.kaaba.lat) / 2) / Math.tan(Math.PI / 4 + changeDegToRad(lat) / 2));

    // if dLon over 180° take shorter rhumb line across the anti-meridian:
    if (Math.abs(Δλ) > Math.PI) Δλ = Δλ > 0 ? -(2 * Math.PI - Δλ) : (2 * Math.PI + Δλ);

    const brng = Math.atan2(Δλ, Δψ) * 180 / Math.PI;
    if (brng < 0)
        return (360 + brng).toFixed(configs.decimal)
    else
        return brng.toFixed(configs.decimal)
}
function changeDegToRad(x) {
    return x * Math.PI / 180;
}
export const GetDeclination = async (lat, lng) => {
    fetch(`https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?key=zNEw7&resultFormat=json&lat1=${lat}&lon1=${lng}`).then((res) => res.json()).then((f) => { console.log(`By API Call, Declination of (${lat}, ${lng}) = ${f.result[0].declination.toFixed(configs.decimal)}`); });
    let geoMag = await geoMagFactory();
    const myGeoMag = geoMag(lat, lng, 0.0, new Date());
    if (myGeoMag.error)
        return {
            error: myGeoMag.error
        }
    else {
        console.log(`By Calculation, Declination of (${lat}, ${lng}) = ${myGeoMag.dec.toFixed(configs.decimal)}`)
        return {
            value: myGeoMag.dec.toFixed(configs.decimal)
        }
    }

}
export const isAcceptable = (lat, lng) => {
    // latitude between - 90 and 90 
    // longitude between - 180 and 180
    if (!isNaN(lat)) {
        const latInt = parseInt(lat);
        if (latInt > 90 || latInt < -90) {
            return {
                acceptable: false,
                message: "Lat out of range"
            };
        }
        if (!isNaN(lng)) {
            const lngInt = parseInt(lng);
            if (lngInt > 180 || lngInt < -180) {
                return {
                    acceptable: false,
                    message: "Long out of range"
                };
            }
            return {
                acceptable: true,
                message: ""
            };
        } else {
            return {
                acceptable: false,
                message: "Format Error in Long"
            };
        }
    }
    return {
        acceptable: false,
        message: "Format Error in Lat"
    };
}
