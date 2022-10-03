const joi = require("joi");

function validateUser(user) {
  const Schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().required(),
  });
  return Schema.validate(user);
}

function validateMover(mover) {
  const Schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().required(),
    lat: joi.number().required(),
    long: joi.number().required(),
    vehicleType: joi
      .string()
      .valid("MINI-VAN", "SMALL-TRUCK", "TRUCK", "10-WHEELER")
      .required(),
    vehicleRegNo: joi.string().required(),
  });
  return Schema.validate(mover);
}

function validateStaff(staff) {
  const Schema = joi.object({
    name: joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi.string().required(),
    city: joi.string(),
    lat: joi.number().required(),
    long: joi.number().required(),
  });
  return Schema.validate(staff);
}

function passwordChangeValidation(data) {
  const Schema = joi.object({
    password: joi.string().required(),

    city: joi.string(),
    passwordNew: joi.string().required(),
  });
  return Schema.validate(data);
}

function statusValidation(data) {
  const Schema = joi.object({
    status: joi
      .string()
      .valid("active", "banned", "ACTIVE", "BANNED")
      .required(),
  });
  return Schema.validate(data);
}

exports.validateUser = validateUser;
exports.validateMover = validateMover;
exports.validateStaff = validateStaff;
exports.statusValidation = statusValidation;
exports.passwordChangeValidation = passwordChangeValidation;
