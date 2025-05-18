import { signup, signin, signout } from "../controllers/authController.js";
import Joi from 'joi';

export default [
  // { method: "POST", path: "/auth/signup", handler: signup },
  {
    method: 'POST',
    path: '/auth/signup',
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        }),
        failAction: (req, h, err) => {
          return h.response({ status: false, message: err.message }).code(400).takeover();
        }
      }
    },
    handler: signup
  },
  { method: "POST", path: "/auth/signin", options: { auth: false } ,handler: signin },
  { method: "POST", path: "/auth/signout", handler: signout },
];


