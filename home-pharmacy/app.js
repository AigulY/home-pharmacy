require("dotenv").config();
const express = require("express");
require("express-async-errors");
const session = require("express-session");
const flash = require("connect-flash");
const rateLimiter = require("express-rate-limit"); //SECURITY
const helmet = require("helmet"); //SECURITY
const xss = require("xss-clean"); //SECURITY
const passport = require("passport");
const MongoDBStore = require("connect-mongodb-session")(session);

const passport_init = require("./passport/passport_init");
const connectDB = require("./db/connect");
const auth_router = require("./routes/authRoutes");
const medications_router = require("./routes/medicationsRoutes");
const vitamins_router = require("./routes/vitaminsRoutes");
const { authMiddleware, setCurrentUser, csrf } = require("./middlewares/authMiddleware");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const app = express();

app.set("view engine", "ejs");

// app.use(cookie_parser(process.env.SESSION_SECRET));
const session_parms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  //SECURITY
  app.set("trust proxy", 1); // trust first proxy
  session_parms.cookie.secure = true; // serve secure cookies
}
app.use(session(session_parms));
passport_init();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  rateLimiter({
    windowMs: 60 * 1000, // 15 minutes
    max: 60, // each IP is limited to make 100 requests per windowMs
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
        "'self'",           
        "public/images/Pharmacy2.jpg",
        "public/images/Pharmacy3.jpg",
        "public/images/1.jpg",
      ],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js",
          "'unsafe-inline'",
        ],
        objectSrc: ["'none'"],
        styleSrc: [
          "'self'",
          "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
          "'unsafe-inline'",
        ],
        upgradeInsecureRequests: null,
      },
    },
  })
);
app.use(xss());
app.use(csrf);
app.use(setCurrentUser);
app.use("/", auth_router);
app.use("/medications", authMiddleware, medications_router);
app.use("/vitamins", authMiddleware, vitamins_router);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;