const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      default: "PENDING",
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    staff: {
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
  },
  { timestamps: true }
);

const CourierOrder = mongoose.model("courier", OrderSchema);

exports.CourierOrder = CourierOrder;
