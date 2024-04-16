const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

console.log("rabbitmq", process.env.MONGODB_URI, process.env.NODE_ENV);

module.exports = {
  API_PORT: process.env.API_PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};
