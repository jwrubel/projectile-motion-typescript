import { getTimeHeightAndDistanceOfFlight } from "./get-time-height-distance-of-flight";
import { getFinalLatLong } from "./get-final-lat-long";

// Parameter initialization
const latitude: number = 1; // latitude in degrees
const longitude: number = 1; // longitude in degrees
const bearing: number = 1; // Bearing in degrees
const V_0: number = 44.7; // Initial velocity (m/s)
const g: number = 9.81; // Acceleration due to gravity (m/s^2)
const degrees: number = 75; // Launch angle (deg.)
const c: number = 0.5; // Drag coefficient (spherical projectile)
const r: number = 0.0366; // Radius of projectile (m)
const m: number = 0.145; // Mass of projectile (kg)
const rho_air: number = 1.29; // Air density (kg/m^3)
const a: number = Math.PI * Math.pow(r, 2); // Cross-sectional area of projectile (m^2)
const psi: number = (degrees * Math.PI) / 180; // Convert to radians

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

// get the final latitude, and final longitude of the projectile
const { finalLatitude, finalLongitude } = getFinalLatLong(
  longitude,
  latitude,
  bearing,
  horizontalRange
);

console.log("RESULTS:");
console.log("Maximum height (m)", maximumHeight);
console.log("Horizontal range (m)", horizontalRange);
console.log("Time of flight (s)", timeOfFlight);
console.log("Final latitude", finalLatitude);
console.log("Final longitude", finalLongitude);
