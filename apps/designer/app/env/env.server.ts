const env = {
  // Authentication
  DEV_LOGIN: process.env.DEV_LOGIN,
  GH_CLIENT_ID: process.env.GH_CLIENT_ID,
  GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  // Secret session key, context encode
  AUTH_SECRET: process.env.AUTH_SECRET,

  // Publishing
  PUBLISHER_ENDPOINT: process.env.PUBLISHER_ENDPOINT,
  PUBLISHER_TOKEN: process.env.PUBLISHER_TOKEN,

  DEPLOYMENT_ENVIRONMENT: process.env.DEPLOYMENT_ENVIRONMENT,
  DEPLOYMENT_URL: process.env.DEPLOYMENT_URL,

  // Trpc on SaaS
  TRPC_SERVER_URL: process.env.TRPC_SERVER_URL,
  TRPC_SERVER_API_TOKEN: process.env.TRPC_SERVER_API_TOKEN,

  // Canvas build logic
  BUILD_ORIGIN: process.env.BUILD_ORIGIN,
  BUILD_REQUIRE_SUBDOMAIN: process.env.BUILD_REQUIRE_SUBDOMAIN,

  PORT: process.env.PORT,

  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_ENV,
} as const;

export default env;

export type ServerEnv = typeof env;
