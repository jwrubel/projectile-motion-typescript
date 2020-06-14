import { degreesToRadians, radiansToDegrees } from '@turf/helpers';
import { getTimeHeightAndDistanceOfFlight } from "./get-time-height-distance-of-flight";
import { getFinalLatLong } from "./get-final-lat-long";
import { adjustBearingAndDistanceForWind } from "./adjust-bearing-distance-for-wind";

// constants 
const GRAVITY = 9.80665; // m/s^2

// projectile default data
const DRAG_COEFFICIENT = 0.5; // Drag coefficient (spherical projectile)
const PROJECTILE_RADIUS = 0.0366; // Radius of projectile (m)
const PROJECTILE_MASS = 0.145; // Mass of projectile (kg)

// environment default parameters
const RHO_AIR = 1.29; // Air density (kg/m^3)
const WIND_SPEED = 0; // wind speed in m/s
const WIND_BEARING = 0; // wind bearing in degrees

interface ShotParams {
  initialCoords: Array<number>, // [latitude, longitude] pair
  thrust: number,               // The projectile's initial velocity (m/s)
  azimuth: number,              // The projectile's initial bearing, in degrees
  elevation: number             // The initial firing angle (degrees)
}
interface ProjectileParams {
  dragCoefficient?: number,     // https://en.wikipedia.org/wiki/Drag_coefficient
  radius?: number,              // Radius of projectile (m)
  mass?: number,                // Mass of projectile (kg)
}
interface EnvironmentParams {
  airDensity?: number,
  windSpeed?: number,
  windDirection?: number
}

const calculateTrajectory = (
  shotParams: ShotParams,
  projectileParams: ProjectileParams,
  environmentParams: EnvironmentParams
  ) => {
  
  // destructure inputs to specific functions
  const { initialCoords, thrust, azimuth, elevation } = shotParams;
  const latitude = initialCoords[0];
  const longitude = initialCoords[1];

  const { 
    dragCoefficient = DRAG_COEFFICIENT,
    radius = PROJECTILE_RADIUS,
    mass = PROJECTILE_MASS,
  } = projectileParams;
  const area =  Math.PI * Math.pow(radius, 2);

  const { 
    airDensity = RHO_AIR,
    windSpeed = WIND_SPEED,
    windDirection = WIND_BEARING
  } = environmentParams;

  // get time and distance of flight
  const {
    maximumHeight,
    horizontalRange,
    timeOfFlight,
  } = getTimeHeightAndDistanceOfFlight(
    {
      initialVelocity: thrust,
      launchAngleInRadians: degreesToRadians(elevation)
    },
    {
      dragCoefficient: dragCoefficient,
      mass: mass,
      crossSectionalArea: area
    },
    {
      gravitationalCoefficient: GRAVITY,
      airDensity: airDensity
    }
  );

  // adjust the bearing and distance for the wind
  const {
    bearingWithWind,
    horizontalRangeWithWind,
  } = adjustBearingAndDistanceForWind(
    horizontalRange,
    degreesToRadians(azimuth),
    timeOfFlight,
    windSpeed,
    windDirection,
    mass,
    airDensity,
    area,
    dragCoefficient
  );

  // get the final latitude, and final longitude of the projectile
  const { finalLatitude, finalLongitude } = getFinalLatLong(
    latitude,
    longitude,
    bearingWithWind,
    horizontalRangeWithWind
  );

  /* DEBUG */
  /*
  console.log("RESULTS:");
  console.log("Maximum height (m)", maximumHeight);
  console.log("Horizontal range (m)", horizontalRange);
  console.log("Horizontal range with wind (m)", horizontalRangeWithWind);
  console.log("Bearing (degrees)", azimuth);
  console.log("Bearing with wind (degrees)", radiansToDegrees(bearingWithWind));
  console.log("Time of flight (s)", timeOfFlight);
  console.log("Final latitude", finalLatitude);
  console.log("Final longitude", finalLongitude);
  */

  return {
    finalCoords: [finalLatitude, finalLongitude],
    distance: horizontalRange,
    duration: timeOfFlight
  }
}

export default calculateTrajectory;
