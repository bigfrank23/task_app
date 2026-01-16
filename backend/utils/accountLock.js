export const MAX_ATTEMPTS = 5;
export const LOCK_TIME = 10 * 60 * 1000;

export const isLocked = (user) =>
  user.lockUntil && user.lockUntil > Date.now();
