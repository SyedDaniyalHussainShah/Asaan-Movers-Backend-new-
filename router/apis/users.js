const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { User } = require("../../models/User");
const {
  validateUser,
  passwordChangeValidation,
  statusValidation,
  validateMover,
  validateStaff,
} = require("../../validators/userValidation");
const { connection } = require("../../config/db");

const router = express.Router();

//@route        api/users/
//@desc         get all users
//@access       admin
router.get("/", [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-_id");
    res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/customer
//@desc         add a customer/ customer signup
//@access       public
router.post("/customer/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    user = await User.findOne({ phone: req.body.phone });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    const { name, email, phone, password } = req.body;
    user = new User({ name, email, phone });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const token = user.generateAuthToken();

    user.password = undefined;
    res.send({ user, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/mover
//@desc         add a mover/mover signup
//@access       admin
router.post("/mover/", auth, admin, async (req, res) => {
  try {
    const { error } = validateMover(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists!!");
    }
    user = await User.findOne({ phone: req.body.phone });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    const {
      name,
      email,
      phone,
      lat,
      long,
      password,
      vehicleType,
      vehicleRegNo,
    } = req.body;
    user = new User({ name, email, phone });

    user.location = {
      type: "Point",
      coordinates: [long, lat],
    };

    user.vehicle = {
      type: vehicleType,
      regNo: vehicleRegNo,
    };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.role = "MOVER";
    user.status = "ACTIVE";
    user.availale = true;

    await user.save();
    const token = user.generateAuthToken();

    user.password = undefined;
    res.send({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/staff
//@desc         add a staff
//@access       admin
router.post("/staff/", auth, admin, async (req, res) => {
  try {
    const { error } = validateStaff(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("User already exists!!");
    }
    user = await User.findOne({ phone: req.body.phone });
    if (user) {
      return res.status(400).send("User already exists!!");
    }

    const { name, email, phone, lat, long, city, password } = req.body;
    user = new User({ name, email, phone, city });

    user.location = {
      type: "Point",
      coordinates: [long, lat],
    };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.role = "STAFF";
    user.status = "ACTIVE";
    if (city) {
      user.city = city;
    }

    await user.save();
    const token = user.generateAuthToken();

    user.password = undefined;
    res.send({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/changePassword
//@desc         change password
//@access       auth
router.put("/changePassword/", auth, async (req, res) => {
  try {
    const { error } = passwordChangeValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const { password, passwordNew } = req.body;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).send("invalid credentials");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(passwordNew, salt);

    await User.updateOne({ _id: user._id }, user);
    user.password = undefined;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/users/status/:id
//@desc         change user status
//@access       admin
router.put("/status/:id", [auth, admin], async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send("User not found!");
    }
    const { error } = statusValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found!");
    }

    const status = req.body.status.toUpperCase();
    user.status = status;

    await User.updateOne({ _id: user._id }, user);

    user.password = undefined;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// //@route        api/users/
// //@desc         delete user
// //@access       admin
// router.delete("/:id", auth, async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(400).send("User not found!");
//     }
//     if (req.params.id === "62a879d429104d571a0c984a") {
//       return res.status(403).send("request forbidden");
//     }
//     let user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).send("User not found!");
//     }

//     await User.deleteOne({ _id: user._id });
//     res.send("user deleted!");
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
