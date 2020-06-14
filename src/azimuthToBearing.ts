// not part of turfjs for some reason
export const azimuthToBearing = (azimuth: number) => {
  return azimuth < 0 ? 360 + azimuth : azimuth;
}