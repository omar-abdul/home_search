import { ValidationError } from "@lib/customerrors";
import Joi from "joi";
import { HomeObject } from "./home_model";
import { UserObject, User } from "./user_model";

export const userPartialSchema = Joi.object({
  userName: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phoneNumber: Joi.number().required().min(8).max(10),
  whatsappNumber: Joi.number().required().min(8),
  firstName: Joi.string().required().max(20),
  lastName: Joi.string().required().max(20),
  middleName: Joi.string().max(20),
});
export const idValidate = Joi.string().required().min(5);
const userarray = [
  "userName",
  "email",
  "phoneNumber",
  "whatsappNumber",
  "firstName",
  "lastName",
  "middleName",
  "salt",
  "active",
];
export const UserSchema = Joi.object(<User>(<unknown>{
  userName: Joi.string().alphanum().min(4).max(20).required().messages({
    "string.empty": "Username cannot be left empty",
    "string.min": "Username should have at least a min of 4 characters",
    "any.required": "Username is a required field",
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .message("Email must be a valid email"),
  phoneNumber: Joi.string()
    .min(8)
    .max(15)
    .required()
    .messages({ "*": "Invalid phone number" }),
  whatsappNumber: Joi.string()
    .min(8)
    .max(15)
    .messages({ "*": "Invalid phone number" }),
  firstName: Joi.string().required().max(20),
  lastName: Joi.string().required().max(20),
  middleName: Joi.string().max(20),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$"))
    .error(
      (errors) =>
        new ValidationError(
          "Password must be 8 characters with a mix of uppercase,lowercase and numbers"
        )
    ),
  repeatPassword: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),
})).with("phoneNumber", "password");

export const HomeSchema = Joi.object({
  description: Joi.string().required().min(10),
  roomNumbers: Joi.number().required().greater(0),
  price: Joi.number().required(),
  furnish: Joi.string(),
  lat: Joi.number().required().min(-90).max(90),
  lon: Joi.number().required().min(-180).max(180),
  userId: Joi.string().required(),
  type: Joi.string().pattern(/Rent|Sale/),
  images: Joi.array(),
  id: Joi.string(),
  is_paid: Joi.boolean(),
});
