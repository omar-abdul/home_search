import Joi from "joi";
import { UserObject } from "./user_model";

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
export const UserSchema = Joi.object(<UserObject>(<unknown>{
  id: Joi.string().required(),
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
  salt: Joi.string().min(16).required(),
  active: Joi.bool().required().default(false),
  password: Joi.string().pattern(
    new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$")
  ),
  repeatPassword: Joi.ref("password"),
}))
  .with("phoneNumber", "password")
  .with("id", userarray);
