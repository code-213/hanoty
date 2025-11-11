export const jwtConfig = {
  accessTokenSecret:
    process.env.JWT_ACCESS_SECRET || "your-access-token-secret",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET || "your-refresh-token-secret",
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || "1h",
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
};
