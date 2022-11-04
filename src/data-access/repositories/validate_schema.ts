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
  userName: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phoneNumber: Joi.string().min(8).max(10).required(),
  whatsappNumber: Joi.string().required().min(8).max(11),
  firstName: Joi.string().required().max(20),
  lastName: Joi.string().required().max(20),
  middleName: Joi.string().max(20),
  password: Joi.string().pattern(
    new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$")
  ),
  repeatPassword: Joi.ref("password"),
})).with("phoneNumber", "password");

export const HomeSchema = Joi.object({
  description: Joi.string().required().min(10),
  roomNumbers: Joi.number().required(),
  price: Joi.number().required(),
  furnish: Joi.string(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
});
