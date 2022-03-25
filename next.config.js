/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || "http://localhost:3000",
    AUTH_SECRET: "secret",
  },
}
