const express = require("express");

const { User } = require("../../models/User");
const auth = require("../../middlewares/auth");
const { Order } = require("../../models/Order");
const admin = require("../../middlewares/admin");
const mover = require("../../middlewares/mover");
const { Charges } = require("../../models/Charges");
const customer = require("../../middlewares/customer");
const { getDistanceFromLatLonInKm } = require("../../utils/distanceCal");
const {
  validateOrder,
  validateOrderStatus,
  validateOrderChange,
} = require("../../validators/orderValidation");

const router = express.Router();

//@route        api/auth/
//@desc         get self orders
//@access       private
router.get("/", auth, async (req, res) => {
  try {
    let orders = await Order.find({ "mover._id": req.user.id });
    if (orders.length == 0) {
      orders = await Order.find({ "customer._id": req.user.id });
    }
    res.send(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/admin
//@desc         get all orders
//@access       admin
router.get("/admin/", auth, admin, async (req, res) => {
  try {
    let orders = await Order.find();
    res.send(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/
//@desc         add order
//@access       customer
router.post("/", auth, customer, async (req, res) => {
  try {
    const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    const {
      type,
      pickupTime,
      pickupLat,
      pickupLong,
      deliveryLat,
      deliveryLong,
    } = req.body;

    const completeMover = await User.findOne({
      availale: true,
      role: "MOVER",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [pickupLong, pickupLat],
          },
          $maxDistance: 10 * 1000,
        },
      },
    }).select("_id name phone vehicle");

    const customer = await User.findById(req.user.id).select("_id name phone");
    const charges = await Charges.findOne();

    if (!completeMover) {
      return res.status(404).send("No movers available in your area!");
    }
    if (!customer) {
      return res.status(404).send("user Profile not found!");
    }

    // const vehicle = mover.vehicle;
    const { vehicle, ...mover } = completeMover;
    // console.log(vehicle);
    // console.log(mover);
    const pickupCoords = {
      coordinates: [pickupLong, pickupLat],
    };
    const deliveryCoords = {
      coordinates: [deliveryLong, deliveryLat],
    };

    const dis = getDistanceFromLatLonInKm(
      pickupLat,
      pickupLong,
      deliveryLat,
      deliveryLong
    );

    let totalCost = 0;
    if (type === "INTERCITY") {
      totalCost = dis * charges.interCity;
    } else {
      totalCost = dis * charges.interaCity;
    }

    const moversShare = (totalCost * charges.moversShare) / 100;

    const order = new Order({
      type,
      pickupCoords,
      pickupTime,
      deliveryCoords,
      mover,
      customer,
      vehicle,
      totalCost,
      moversShare,
    });

    await order.save();
    completeMover.availale = false;
    await User.updateOne({ _id: completeMover._id }, completeMover);

    res.send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/status/:id
//@desc         change order status
//@access       mover
router.put("/status/:id", auth, mover, async (req, res) => {
  try {
    const { error } = validateOrderStatus(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    const order = await Order.findById(req.params.id);
    if (!order.mover._id.equals(req.user.id)) {
      return res.status(403).send("Request Forbidden");
    }

    order.status = req.body.status;

    await Order.updateOne({ _id: order._id }, order);
    if (req.body.status === "DELIVERED") {
      await User.updateOne({ _id: req.user.id }, { availale: true });
    }

    res.send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/status/customer/:id
//@desc         order change by customer
//@status       api not functional
//@access       mover
router.put("/status/customer/:id", auth, customer, async (req, res) => {
  try {
    const { error } = validateOrderChange(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    const order = await Order.findById(req.params.id);
    if (!order.customer._id.equals(req.user.id)) {
      return res.status(403).send("Request Forbidden");
    }

    if (order.status === "CANCELED") {
      return res.status(403).send("Order alredy canceled!");
    }

    if (order.status === "DELIVERED") {
      return res.status(403).send("Can not change a delivered order!");
    }

    if (order.status) {
      order.status = req.body.status;
    }

    await Order.updateOne({ _id: order._id }, order);

    res.send(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
