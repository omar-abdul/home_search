import Joi from "joi";
import { join } from "path";

export const userSchema = Joi.object({
  userName: Joi.string().alphanum().min(4).max(20).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!@#$&]{8,20}$")),
});
