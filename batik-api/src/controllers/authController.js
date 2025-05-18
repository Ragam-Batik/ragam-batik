import * as authService from "../services/authService.js";

export const signup = async (req, h) => {
  return await authService.signup(req.payload, h);
};

export const signin = async (req, h) => {
  return await authService.signin(req.payload, h);
};

export const signout = async (req, h) => {
  return await authService.signout(h);
};
