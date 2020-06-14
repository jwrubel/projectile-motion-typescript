import { degreesToRadians, radiansToDegrees } from '@turf/helpers';
export const adjustBearingAndDistanceForWind = (
  horizontalRange: number,
  bearing: number,
  timeOfFlight: number,
  windSpeed: number,
  windBearing: number,
  m,
  rho_air,
  a,
  c
): { bearingWithWind: number; horizontalRangeWithWind: number } => {
  // find distance from wind
  // break that into lat and lon distances and adjust

  const distanceFromWind =
    (c * rho_air * a * Math.pow(windSpeed, 2) * Math.pow(timeOfFlight, 2)) /
    (m * 4); // 1/2 * a * t^2 = 1/2 * dragForce/mass * time^2

  const windBearingRadians = degreesToRadians(windBearing);
  const distanceFromWindLat =
    distanceFromWind * Math.sin((Math.PI * windBearingRadians) / 180);
  const distanceFromWindLon =
    distanceFromWind * Math.cos((Math.PI * windBearingRadians) / 180);

  const horizontalRangeLon =
    horizontalRange * Math.cos((Math.PI * bearing) / 180) + distanceFromWindLon;
  const horizontalRangeLat =
    horizontalRange * Math.sin((Math.PI * bearing) / 180) + distanceFromWindLat;

  const bearingWithWind =
    (Math.atan(horizontalRangeLat / horizontalRangeLon) * 180) / Math.PI; // radians to degrees
  const horizontalRangeWithWind = Math.sqrt(
    Math.pow(horizontalRangeLon, 2) + Math.pow(horizontalRangeLat, 2)
  );
  return { bearingWithWind, horizontalRangeWithWind };
};
