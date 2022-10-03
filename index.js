const express = require("express");
const config = require("config");
const cors = require("cors");

const { connect } = require("./config/db");
const auth = require("./router/apis/auth");
const users = require("./router/apis/users");
const orders = require("./router/apis/orders");
const charges = require("./router/apis/charges");
const couriers = require("./router/apis/courierOrders");

const app = express();
connect();

if (!config.get("jwtPrivateKey")) {
  console.log(config.get("jwtPrivateKey"));
  console.error(
    "Fatal Error: Encryption key for the authentication token is not defined"
  );
  process.exit(1);
}

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use("/assets", express.static("assets"));

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/orders", orders);
app.use("/api/charges", charges);
app.use("/api/couriers", couriers);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
