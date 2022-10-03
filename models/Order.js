const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "INTERCITY",
    },
    status: {
      type: String,
      required: true,
      default: "PENDING",
    },
    pickupCoords: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    PickupTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    deliveryCoords: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    mover: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    customer: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    vehicle: {
      type: {
        type: String,
        required: true,
      },
      regNo: {
        type: String,
        required: true,
      },
    },
    totalCost: {
      type: Number,
      required: true,
    },
    moversShare: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

OrderSchema.index({ pickupCoords: "2dsphere", deliveryCoords: "2dsphere" });

const Order = mongoose.model("order", OrderSchema);

exports.Order = Order;
