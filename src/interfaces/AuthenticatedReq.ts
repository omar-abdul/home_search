import { Request } from "express";
import { UserObject } from "../data-access/repositories/user_model";

export interface AuthenticatedReq extends Request {
  user?: any;
}
