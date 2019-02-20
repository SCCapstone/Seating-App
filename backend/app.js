const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const reservationsRoutes = require("./routes/reservations");
const floorplansRoutes = require("./routes/floorplans");
const storesRoutes = require("./routes/stores");
const serversRoutes = require("./routes/servers");

const app = express();

mongoose
  .connect(
    // "mongodb+srv://dalton:1llhfy52mo31vnMB@cluster0-xbpdg.mongodb.net/test?retryWrites=true"
    "mongodb+srv://eddie:" +
      process.env.MONGO_ATLAS_PW +
      "@web-db-lv45x.mongodb.net/seating-app"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "angular")));

//app.use((req, res, next) => {
//  res.setHeader("Access-Control-Allow-Origin", "*");
//  res.setHeader(
//    "Access-Control-Allow-Headers",
//    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//  );
//  res.setHeader(
//    "Access-Control-Allow-Methods",
//    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//  );
//  next();
//});

app.use("/api/user", userRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/floorplans", floorplansRoutes);
app.use("/api/stores", storesRoutes);
app.use("/api/servers", serversRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
