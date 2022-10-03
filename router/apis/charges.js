const express = require("express");

const { Charges } = require("../../models/Charges");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { validateCharge } = require("../../validators/chargesValidation");

const router = express.Router();

//@route        api/charges/
//@desc         get charges
//@access       admin
router.get("/", auth, admin, async (req, res) => {
  try {
    const charges = await Charges.findOne();
    res.send(charges);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/charges/
//@desc         add charges object
//@access       admin
router.post("/", auth, admin, async (req, res) => {
  try {
    const { error } = validateCharge(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    const already = await Charges.findOne();
    if (already) {
      return res.status(400).send("Only one charges object allowed!");
    }

    const { interCity, interaCity, moversShare, parcel } = req.body;

    const charge = new Charges({
      interCity,
      interaCity,
      moversShare,
      parcel,
    });

    await charge.save();

    res.send(charge);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/charges/
//@desc         change charges object
//@access       admin
router.put("/", auth, admin, async (req, res) => {
  try {
    const { error } = validateCharge(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }

    let charges = await Charges.findOne();

    const { interCity, interaCity, moversShare, parcel } = req.body;

    charges.interCity = interCity;
    charges.interaCity = interaCity;
    charges.moversShare = moversShare;
    charges.parcel = parcel;

    await Charges.updateOne({ _id: charges._id }, charges);

    res.send(charges);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
