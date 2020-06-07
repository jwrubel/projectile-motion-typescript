export const getFinalLatLong = (
  latitude: number,
  longitude: number,
  bearing: number,
  horizontalRange: number
): { finalLatitude: number; finalLongitude: number } => {
  const R = 6378.1; // Radius of the Earth in km
  const bearingRadians = (Math.PI * bearing) / 180; //Bearing is converted to radians.
  const d = horizontalRange / 1000; //Distance in km

  //lat2  52.20444 - the lat result I'm hoping for
  //lon2  0.36056 - the long result I'm hoping for.

  const lat1 = (Math.PI * latitude) / 180; //Current lat point converted to radians
  const lon1 = (Math.PI * longitude) / 180; //Current long point converted to radians

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d / R) +
      Math.cos(lat1) * Math.sin(d / R) * Math.cos(bearingRadians)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRadians) * Math.sin(d / R) * Math.cos(lat1),
      Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
    );

  const finalLatitude = (180 * lat2) / Math.PI; //convert back to degrees
  const finalLongitude = (180 * lon2) / Math.PI; //convert back to degrees

  return { finalLatitude, finalLongitude };
};
