const bcrypt = require("bcrypt");
const express = require("express");

const { User } = require("../../models/User");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const {
  authValidation,
  passwordResetValidation,
} = require("../../validators/authValidation");

const router = express.Router();

//@route        api/auth/
//@desc         get authenticated for all
//@access       public
router.post("/", async (req, res) => {
  try {
    const { error } = authValidation(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid credentials!!");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid credentials!!");

    const token = user.generateAuthToken();
    user.password = undefined;
    res.json({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/
//@desc         get authenticated admin
//@access       public
router.post("/admin/", async (req, res) => {
  try {
    const { error } = authValidation(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid credentials!!");
    }

    if (user.role !== "ADMIN") {
      return res.status(400).send("Invalid credentials!");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid credentials!!");

    const token = user.generateAuthToken();
    user.password = undefined;
    res.json({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// //@route        api/auth/
// //@desc         get user admin
// //@access       admin
// router.get("/", auth, admin, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).send("user not found!!");
//     }

//     user.password = undefined;
//     res.json(user);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

//@route        api/auth/customer
//@desc         get customer authenticated
//@access       public
router.post("/customer/", async (req, res) => {
  try {
    const { error } = authValidation(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid credentials!!");
    }

    if (user.role !== "CUSTOMER") {
      return res.status(400).send("Invalid credentials!");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid credentials!!");

    const token = user.generateAuthToken();
    user.password = undefined;
    res.json({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/mover
//@desc         get mover authenticated
//@access       public
router.post("/mover/", async (req, res) => {
  try {
    const { error } = authValidation(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid credentials!!");
    }

    if (user.role !== "MOVER") {
      return res.status(400).send("Invalid credentials!");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid credentials!!");

    const token = user.generateAuthToken();
    user.password = undefined;
    res.json({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//@route        api/auth/staff
//@desc         get staff authenticated
//@access       public
router.post("/staff/", async (req, res) => {
  try {
    const { error } = authValidation(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("Invalid credentials!!");
    }

    if (user.role !== "STAFF") {
      return res.status(400).send("Invalid credentials!");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid credentials!!");

    const token = user.generateAuthToken();
    user.password = undefined;
    res.json({ token, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// //@route        api/auth/forgetPassword
// //@desc         reset Password
// //@access       public
// router.put("/passwordReset/", async (req, res) => {
//   try {
//     const { error } = passwordResetValidation(req.body);
//     if (error) {
//       return res.status(400).send(error.details);
//     }
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(404).send("user not found!!");
//     }

//     function makepassword(length) {
//       var result = "";
//       var characters =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//       var charactersLength = characters.length;
//       for (var i = 0; i < length; i++) {
//         result += characters.charAt(
//           Math.floor(Math.random() * charactersLength)
//         );
//       }
//       return result;
//     }

//     const password = makepassword(6);

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await User.updateOne({ _id: user._id }, user);

//     const transporter = mailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "ahmadtahir999at@gmail.com",
//         pass: "swkwteqvegfmejkq",
//       },
//     });

//     const mailOptions = {
//       from: "ahmadtahir999at@gmail.com",
//       to: req.body.email,
//       subject: "Password Reset for the squash-Site",
//       text: `Your password for the squash site account has been reset. The new password is "${password}", you can use this to login and change it to something else.`,
//     };

//     await transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//         return res.status(500).send(error.message);
//       } else {
//         res.send(
//           "Your password have been reset. New password have been sent to you via email. In case you do not find it please make sure that you provided the correct email address and check your spam folder!"
//         );
//       }
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

module.exports = router;
