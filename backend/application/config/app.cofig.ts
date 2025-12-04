export const APP_CONFIG = {
  PORT: process.env.PORT || 8080,
  jwt: {
    SECRET: process.env.JWT_SECRET || "your-secret-key",
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  },
} as const;
