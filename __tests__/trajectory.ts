import calculateTrajectory from '../src/index';

test('calculates basic trajectory', () => {
  const shotParams = {
    initialCoords: [40.21034, -80.604],
    thrust: 224.5,
    azimuth: 141,
    elevation: 60
  };
  
  const {
    finalCoords,
    distance,
    duration
  } = calculateTrajectory(shotParams, {}, {});

  expect(+finalCoords[0].toFixed(3)).toBe(40.209);
  expect(+finalCoords[1].toFixed(3)).toBe(-80.603);
  expect(+distance.toFixed(3)).toBe(187.794);
  expect(+duration.toFixed(3)).toBe(11.792);
});

test('applies projectile parameters', () => {
  const shotParams = {
    initialCoords: [40.21034, -80.604],
    thrust: 224.5,
    azimuth: 141,
    elevation: 60
  };
  const projectileParams = {
    dragCoefficient: 0.295,
    radius: 0.02,
    mass: 0.77
  };
  
  const {
    finalCoords,
    distance,
    duration
  } = calculateTrajectory(shotParams, projectileParams, {});
  expect(+finalCoords[0].toFixed(3)).toBe(40.196);
  expect(+finalCoords[1].toFixed(3)).toBe(-80.589);
  expect(+distance.toFixed(3)).toBe(2067.467);
  expect(+duration.toFixed(3)).toBe(30.948);
});

test('applies environment parameters', () => {
  const azimuth = 141
  const shotParams = {
    initialCoords: [40.21034, -80.604],
    thrust: 224.5,
    azimuth: azimuth,
    elevation: 60
  };

  const environmentParams = {
    airDensity: 1.22524, 
    windSpeed: 4.6,
    windDirection: azimuth - 90 // crosswind 
  };
  
  const {
    finalCoords,
    distance,
    duration
  } = calculateTrajectory(shotParams, {}, environmentParams);
  expect(+finalCoords[0].toFixed(3)).toBe(40.209);
  expect(+finalCoords[1].toFixed(3)).toBe(-80.602);
  expect(+distance.toFixed(3)).toBe(196.025);
  expect(+duration.toFixed(3)).toBe(12.012);
});
