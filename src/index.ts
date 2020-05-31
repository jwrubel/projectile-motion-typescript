import { getTimeHeightAndDistanceOfFlight } from "./get-time-height-distance-of-flight";

// Parameters of projectile (Modelled after a baseball)
const V_0 = 44.7; // Initial velocity (m/s)
const g = 9.81; // Acceleration due to gravity (m/s^2)
const degrees = 75; // Launch angle (deg.)
const c = 0.5; // Drag coefficient (spherical projectile)
const r = 0.0366; // Radius of projectile (m)
const m = 0.145; // Mass of projectile (kg)
const rho_air = 1.29; // Air density (kg/m^3)
const a = Math.PI * r ** 2.0; // Cross-sectional area of projectile (m^2)
const psi = (degrees * Math.PI) / 180; // Convert to radians

// Log parameters for visibility
console.log("Parameters:");
console.log("Launch angle (deg.)", degrees);
console.log("Launch speed (m/s)", V_0);
console.log("Drag coefficient - Spherical projectil", c);
console.log("Radius of spherical projectile (m)", r);
console.log("Mass of projectile (kg)", m);
console.log("Air density (kg/m^3)", rho_air);
console.log("Cross-sectional area of projectile", a);

// Initalize function input
const shotParameters = { initialVelocity: V_0, launchAngleInRadians: psi };
const projectileParameters = {
  dragCoefficient: c,
  radius: r,
  mass: m,
  crossSectionalArea: a,
};
const environmentParameters = {
  gravitationalCoefficient: g,
  airDensity: rho_air,
};

// Call function
const {
  maximumHeight,
  horizontalRange,
  timeOfFlight,
} = getTimeHeightAndDistanceOfFlight(
  shotParameters,
  projectileParameters,
  environmentParameters
);

console.log("RESULTS:");
console.log("Maximum height (m)", maximumHeight);
console.log("Horizontal range (m)", horizontalRange);
console.log("Time of flight (s)", timeOfFlight);
