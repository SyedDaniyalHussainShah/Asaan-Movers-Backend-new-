const joi = require("joi");

function validateOrder(order) {
  const Schema = joi.object({
    type: joi.string().valid("INTERCITY", "INTERACITY").required(),
    pickupTime: joi.date().required(),
    pickupLat: joi.number().required(),
    pickupLong: joi.number().required(),
    deliveryLat: joi.number().required(),
    deliveryLong: joi.number().required(),
  });
  return Schema.validate(order);
}

function validateOrderChange(data) {
  const Schema = joi.object({
    status: joi.string().valid("CANCELED"),
    deliveryLat: joi.number(),
    deliveryLong: joi.number(),
  });
  return Schema.validate(data);
}

function validateOrderStatus(status) {
  const Schema = joi.object({
    status: joi
      .string()
      .valid(
        "PENDING",
        "ONROUTEFORPICKUP",
        "ONROUTEFORDELIVERY",
        "DELIVERED",
        "CANCELED"
      )
      .required(),
  });
  return Schema.validate(status);
}

exports.validateOrder = validateOrder;
exports.validateOrderChange = validateOrderChange;
exports.validateOrderStatus = validateOrderStatus;
