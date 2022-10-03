const joi = require("joi");

function authValidation(creds) {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return schema.validate(creds, { abortEarly: false });
}

function passwordResetValidation(creds) {
  const schema = joi.object({
    email: joi.string().email().required(),
  });
  return schema.validate(creds, { abortEarly: false });
}

exports.authValidation = authValidation;
exports.passwordResetValidation = passwordResetValidation;
