const joi = require("joi");

function validateCourier(order) {
  const Schema = joi.object({
    to: joi.string().required(),
    from: joi.string().required(),
    customerName: joi.string().required(),
    customerPhone: joi.string().required(),
    customerAddress: joi.string().required(),
  });
  return Schema.validate(order);
}

function validateCourierTracking(data) {
  const Schema = joi.object({
    id: joi.string().required(),
  });
  return Schema.validate(data);
}

function validateCourierStatus(status) {
  const Schema = joi.object({
    status: joi
      .string()
      .valid("PENDING", "ONROUTE", "ARRIVEDATPICKUP", "CANCELED", "PICKEDUP")
      .required(),
  });
  return Schema.validate(status);
}

exports.validateCourier = validateCourier;
exports.validateCourierTracking = validateCourierTracking;
exports.validateCourierStatus = validateCourierStatus;
