const Joi = require("joi");

const userValidationSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .max(30)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,30}$"))
    .messages({
      "string.pattern.base": "Doesn't follow password criteria",
      "string.min": "Doesn't follow password criteria",
      "string.max": "Doesn't follow password criteria",
      "any.required": "Doesn't follow password criteria",
    }),
});

const validateUser = (userData) => {
  return userValidationSchema.validate(userData, { abortEarly: false });
};

module.exports = {
  validateUser,
};
