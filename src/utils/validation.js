const Joi=require('joi');
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name must be at most 50 characters long"
    }),

  email: Joi.string().email().required().trim()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address"
    }),

  password: Joi.string().min(8).max(128).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$")).required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }),

  confirmPassword: Joi.any().valid(Joi.ref("password")).required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm password is required"
    })
});

const signInSchema = registerSchema.fork(["name","confirmPassword"], field => field.optional());

const emailSchema =registerSchema.fork(["name","password","confirmPassword"], field => field.optional());

module.exports={
    registerSchema,signInSchema,emailSchema
}