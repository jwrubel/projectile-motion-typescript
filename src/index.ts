import { degreesToRadians, point } from '@turf/helpers';
import destination from '@turf/destination';
import { getTimeHeightAndDistanceOfFlight } from "./get-time-height-distance-of-flight";
import { adjustBearingAndDistanceForWind } from "./adjust-bearing-distance-for-wind";
import { azimuthToBearing } from './azimuthToBearing';

// constants 
const GRAVITY = 9.80665; // m/s^2

// projectile default data
const DRAG_COEFFICIENT = 0.5; // Drag coefficient (spherical projectile)
const PROJECTILE_RADIUS = 0.0366; // Radius of projectile (m)
const PROJECTILE_MASS = 0.145; // Mass of projectile (kg)

// environment default parameters
const RHO_AIR = 1.29; // Air density (kg/m^3)
const WIND_SPEED = 0; // wind speed in m/s
const WIND_BEARING = 0; // wind bearing in degrees (0 - 360)

interface ShotParams {
  initialCoords: Array<number>, // [latitude, longitude] pair
  thrust: number,               // The projectile's initial velocity (m/s)
  azimuth: number,              // The projectile's initial bearing, in degrees (0 to 360)
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
    azimuthToBearing(azimuth), // function takes bearing in -180 - 180
    timeOfFlight,
    windSpeed,
    windDirection,
    mass,
    airDensity,
    area,
    dragCoefficient
  );

  const dest = destination(point([longitude, latitude]), horizontalRangeWithWind, bearingWithWind, {units: 'meters'})
  // get the final latitude, and final longitude of the projectile
  const finalCoords = dest.geometry.coordinates

  /* DEBUG */
  /*
  console.log("RESULTS:");
  console.log("Maximum height (m)", maximumHeight);
  console.log("Horizontal range (m)", horizontalRange);
  console.log("Horizontal range with wind (m)", horizontalRangeWithWind);
  console.log("Bearing (degrees)", azimuth);
  console.log("Bearing with wind (degrees)", bearingWithWind);
  console.log("Time of flight (s)", timeOfFlight);
  console.log("Final latitude", finalCoords[1]);
  console.log("Final longitude", finalCoords[0]);
  */

  return {
    finalCoords: [finalCoords[1], finalCoords[0]], // return to [lat, long]
    distance: horizontalRange,
    duration: timeOfFlight
  }
}

export { azimuthToBearing, calculateTrajectory };
