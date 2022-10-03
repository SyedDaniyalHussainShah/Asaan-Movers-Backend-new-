const express = require("express");

const { User } = require("../../models/User");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const staff = require("../../middlewares/staff");
const { Charges } = require("../../models/Charges");
const customer = require("../../middlewares/customer");
const { CourierOrder } = require("../../models/CourierOrder");
const {
  validateCourier,
  validateCourierStatus,
} = require("../../validators/courierValidation");

const router = express.Router();

//@route        api/courier/
//@desc         get self courier orders
//@access       private
router.get("/", auth, async (req, res) => {
  try {
    let orders = await CourierOrder.find({ "staff._id": req.user.id });
    if (orders.length == 0) {
      orders = await CourierOrder.find({ "customer._id": req.user.id });
    }
    res.send(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/courier/admin
//@desc         get all courier orders
//@access       admin
router.get("/admin/", auth, admin, async (req, res) => {
  try {
    let orders = await CourierOrder.find();
    res.send(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/courier/
//@desc         add courier order
//@access       customer
router.post("/", auth, staff, async (req, res) => {
  try {
    const { error } = validateCourier(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    const { to, from, customerName, customerPhone, customerAddress } = req.body;

    const charges = await Charges.findOne();
    let cityFrom = "none";
    let cityTo = "none";
    for (let i = 0; i < charges.parcel.length; i++) {
      if (from === charges.parcel[i].from) {
        cityFrom = charges.parcel[i];
        for (let j = 0; j < charges.parcel[i].to.length; j++) {
          if (to === charges.parcel[i].to[j].city) {
            cityTo = charges.parcel[i].to[j];
            break;
          }
        }
        break;
      }
    }

    if (cityFrom === "none" || cityTo === "none") {
      return res
        .status(400)
        .send("we are sorry but we do not provide services in that city");
    }

    const staff = await User.findById(req.user.id).select("_id name phone");

    if (!staff) {
      return res.status(404).send("No movers available in your area!");
    }

    const totalCost = cityTo.charge;
    const customer = {
      name: customerName,
      phone: customerPhone,
      address: customerAddress,
    };

    const courier = new CourierOrder({
      from,
      to,
      totalCost,
      customer,
      staff,
    });

    await courier.save();

    res.send(courier);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/couriers/status/:id
//@desc         change order status
//@access       mover
router.put("/status/:id", auth, staff, async (req, res) => {
  try {
    const { error } = validateCourierStatus(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    const courier = await CourierOrder.findById(req.params.id);
    if (!courier.staff._id.equals(req.user.id)) {
      return res.status(403).send("Request Forbidden");
    }

    courier.status = req.body.status;

    await CourierOrder.updateOne({ _id: courier._id }, courier);

    res.send(courier);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
