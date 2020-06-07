import { getTimeHeightAndDistanceOfFlight } from "./get-time-height-distance-of-flight";
import { getFinalLatLong } from "./get-final-lat-long";
import { adjustBearingAndDistanceForWind } from "./adjust-bearing-distance-for-wind";

// Parameter initialization
const latitude: number = 10; // latitude in degrees
const longitude: number = 80; // longitude in degrees
const bearing: number = 10; // Bearing in degrees
const V_0: number = 44.7; // Initial velocity (m/s)
const g: number = 9.81; // Acceleration due to gravity (m/s^2)
const degrees: number = 75; // Launch angle (deg.)
const c: number = 0.5; // Drag coefficient (spherical projectile)
const r: number = 0.0366; // Radius of projectile (m)
const m: number = 0.145; // Mass of projectile (kg)
const rho_air: number = 1.29; // Air density (kg/m^3)
const a: number = Math.PI * Math.pow(r, 2); // Cross-sectional area of projectile (m^2)
const psi: number = (degrees * Math.PI) / 180; // Convert to radians
const windSpeed: number = 1000; // wind speed in m/s
const windBearing: number = 10; // wind bearing in degrees

// Log parameters for visibility
console.log("Parameters:");
console.log("Latitude (deg.)", latitude);
console.log("Longitude (deg.)", longitude);
console.log("Bearing (deg.)", bearing);
console.log("Launch angle (deg.)", degrees);
console.log("Launch speed (m/s)", V_0);
console.log("Drag coefficient - Spherical projectil", c);
console.log("Radius of spherical projectile (m)", r);
console.log("Mass of projectile (kg)", m);
console.log("Air density (kg/m^3)", rho_air);
console.log("Cross-sectional area of projectile", a);
console.log("Wind Speed:", windSpeed);
console.log("Wind Bearing:", windBearing);

// Separate parameters into 3 function inputs
const shotParameters: {
  initialVelocity: number;
  launchAngleInRadians: number;
} = {
  initialVelocity: V_0,
  launchAngleInRadians: psi,
};
const projectileParameters: {
  dragCoefficient: number;
  radius: number;
  mass: number;
  crossSectionalArea: number;
} = {
  dragCoefficient: c,
  radius: r,
  mass: m,
  crossSectionalArea: a,
};
const environmentParameters: {
  gravitationalCoefficient: number;
  airDensity: number;
} = {
  gravitationalCoefficient: g,
  airDensity: rho_air,
};

// Get the time, maximum height, and distance of flight
const {
  maximumHeight,
  horizontalRange,
  timeOfFlight,
} = getTimeHeightAndDistanceOfFlight(
  shotParameters,
  projectileParameters,
  environmentParameters
);
// adjust the bearing and distance for the wind
const {
  bearingWithWind,
  horizontalRangeWithWind,
} = adjustBearingAndDistanceForWind(
  horizontalRange,
  bearing,
  timeOfFlight,
  windSpeed,
  windBearing,
  m,
  rho_air,
  a,
  c
);
// get the final latitude, and final longitude of the projectile
const { finalLatitude, finalLongitude } = getFinalLatLong(
  longitude,
  latitude,
  bearingWithWind,
  horizontalRangeWithWind
);

console.log("RESULTS:");
console.log("Maximum height (m)", maximumHeight);
console.log("Horizontal range (m)", horizontalRange);
console.log("Horizontal range with wind (m)", horizontalRangeWithWind);
console.log("Bearing (degrees)", bearing);
console.log("Bearing with wind (degrees)", bearingWithWind);
console.log("Time of flight (s)", timeOfFlight);
console.log("Final latitude", finalLatitude);
console.log("Final longitude", finalLongitude);
