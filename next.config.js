const withCSS = require("@zeit/next-css");
require("dotenv").config();

module.exports = withCSS({
  env: {
    PORT: process.env.PORT,
    API_URL: process.env.API_URL,
    APP_ENV: process.env.APP_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    VIMEO_TOKEN: process.env.VIMEO_TOKEN,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    DO_CDN: process.env.DO_CDN,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET
  }
});
