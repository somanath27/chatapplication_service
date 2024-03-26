/* eslint-disable no-undef */
const config= require('dotenv')
config({ path: `.env` });

//set all env defaults values here
module.exports.CREDENTIALS = process.env.CREDENTIALS == 'true';
module.exports= {
  NODE_ENV = 'development',
  PORT = 5000,
  TLS_ENABLE,
  MONGO_URI,
  TEST_DB_PATH,
  JWT_SECRET,
} = process.env;
