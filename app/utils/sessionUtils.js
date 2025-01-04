export function isTokenExpired(expiresAt) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return expiresAt ? currentTime > expiresAt : true; // Default to expired if expiresAt is missing
}
