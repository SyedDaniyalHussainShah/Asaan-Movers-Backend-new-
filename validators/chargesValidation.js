const joi = require("joi");

function validateCharge(charge) {
  const Schema = joi.object({
    interCity: joi.number().integer().positive().required(),
    interaCity: joi.number().integer().positive().required(),
    moversShare: joi.number().positive().required(),
    parcel: joi.array().items(
      joi.object({
        from: joi.string().required(),
        to: joi.array().items(
          joi.object({
            city: joi.string().required(),
            charge: joi.number().integer().positive().required(),
          })
        ),
      })
    ),
  });
  return Schema.validate(charge);
}

exports.validateCharge = validateCharge;
