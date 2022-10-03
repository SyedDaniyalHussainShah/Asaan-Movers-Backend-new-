const mongoose = require("mongoose");

const ChargesSchema = new mongoose.Schema({
  interCity: {
    type: Number,
    required: true,
  },
  interaCity: {
    type: Number,
    required: true,
  },
  moversShare: {
    type: Number,
    required: true,
  },
  parcel: [
    {
      type: new mongoose.Schema(
        {
          from: {
            type: String,
            required: true,
          },
          to: [
            {
              type: new mongoose.Schema(
                {
                  city: {
                    type: String,
                    required: true,
                  },
                  charge: {
                    type: Number,
                    required: true,
                  },
                },
                { _id: false }
              ),
            },
          ],
        },
        { _id: false }
      ),
    },
  ],
});

const Charges = mongoose.model("charge", ChargesSchema);

exports.Charges = Charges;
