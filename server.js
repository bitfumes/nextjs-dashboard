const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const port = process.env.PORT || 3000;
const handle = app.getRequestHandler();
if (dev || process.env.APP_ENV == "local") {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
}

const authCheck = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        res.clearCookie("token");
        console.error("jwt not verified");
        res.redirect("/");
      }

      next();
    });
  } else {
    next();
  }
};

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(cookieParser());
    server.use(authCheck);

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
