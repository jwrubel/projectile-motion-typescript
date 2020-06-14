const integrate = require("integrate-adaptive-simpson");
const nr = require("newton-raphson-method");

export const getTimeHeightAndDistanceOfFlight = (
  shotParameters: { initialVelocity: number; launchAngleInRadians: number },
  projectileParameters: {
    dragCoefficient: number;
    mass: number;
    crossSectionalArea: number;
  },
  environmentParameters: {
    gravitationalCoefficient: number;
    airDensity: number;
  }
): { maximumHeight: number; horizontalRange: number; timeOfFlight: number } => {
  const { initialVelocity, launchAngleInRadians } = shotParameters;
  const {
    dragCoefficient,
    mass,
    crossSectionalArea,
  } = projectileParameters;

  const { gravitationalCoefficient, airDensity } = environmentParameters;

  // Initial position and launch velocity
  const x_0 = 0.0;
  const u_0 = initialVelocity * Math.cos(launchAngleInRadians); // horizontal velocity
  const y_0 = 0.0;
  const v_0 = initialVelocity * Math.sin(launchAngleInRadians); // vertical velocity

  // Constants and function definitions for solution
  const mu = (0.5 * dragCoefficient * airDensity * crossSectionalArea) / mass;
  const Q_0 = Math.asinh(v_0 / u_0);
  const A =
    gravitationalCoefficient / (mu * u_0 ** 2.0) +
    (Q_0 + 0.5 * Math.sinh(2.0 * Q_0));

  const lam = (Q) => {
    return A - (Q + 0.5 * Math.sinh(2.0 * Q));
  };

  const u_s = (Q) => {
    return Math.sqrt(gravitationalCoefficient / mu) / Math.sqrt(lam(Q));
  };
  const v_s = (Q) => {
    return (
      (Math.sqrt(gravitationalCoefficient / mu) * Math.sinh(Q)) /
      Math.sqrt(lam(Q))
    );
  };
  const f_t = (Q) => {
    // time function
    return Math.cosh(Q) / Math.sqrt(lam(Q));
  };
  const f_x = (Q) => {
    // x function
    return Math.cosh(Q) / lam(Q);
  };
  const f_y = (Q) => {
    // y function
    return Math.sinh(2.0 * Q) / lam(Q);
  };

  const t_s = (Q) => {
    return -integrate(f_t, Q_0, Q) / Math.sqrt(gravitationalCoefficient * mu);
  };
  const x_s = (Q) => {
    return x_0 - integrate(f_x, Q_0, Q) / mu;
  };
  const y_s = (Q) => {
    return y_0 - integrate(f_y, Q_0, Q) / (2.0 * mu);
  };
  const y_s_p = (Q) => {
    return (-(1.0 / (2.0 * mu)) * Math.sinh(2.0 * Q)) / lam(Q);
  };

  // Time of flight
  const Q_T_est = Math.asinh(-v_0 / u_0); // Initial estimate for Newton's method
  const Q_T = nr(y_s, y_s_p, Q_T_est); //newton(y_s, Q_T_est, y_s_p);
  const timeOfFlight = t_s(Q_T);

  // Horizontal range
  const horizontalRange = x_s(Q_T);

  // Maximum height
  const maximumHeight = y_s(0.0);

  return { maximumHeight, horizontalRange, timeOfFlight };
};
