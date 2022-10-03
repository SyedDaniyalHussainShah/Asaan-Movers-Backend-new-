const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "CUSTOMER",
  },
  status: {
    type: String,
    required: true,
    default: "ACTIVE",
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  vehicle: {
    required: false,
    type: new mongoose.Schema(
      {
        type: {
          type: String,
          required: true,
        },
        regNo: {
          type: String,
          required: true,
        },
      },
      { _id: false }
    ),
  },
  availale: {
    type: Boolean,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.id, role: this.role },
    config.get("jwtPrivateKey"),
    { expiresIn: 3600000 }
  );
  return token;
};

UserSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", UserSchema);

exports.User = User;
