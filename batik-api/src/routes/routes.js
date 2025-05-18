// const Joi = require("@hapi/joi");
// const handlers = require("./handlers");

// const routes = [
//   // Authentication routes
//   {
//     method: "POST",
//     path: "/auth/register",
//     handler: handlers.auth.register,
//     options: {
//       auth: false,
//       validate: {
//         payload: Joi.object({
//           email: Joi.string().email().required(),
//           password: Joi.string().min(6).required(),
//           name: Joi.string().required(),
//         }),
//       },
//     },
//   },
//   {
//     method: "POST",
//     path: "/auth/login",
//     handler: handlers.auth.login,
//     options: {
//       auth: false,
//       validate: {
//         payload: Joi.object({
//           email: Joi.string().email().required(),
//           password: Joi.string().required(),
//         }),
//       },
//     },
//   },
//   // Predict route
//   {
//     method: "POST",
//     path: "/predict",
//     handler: handlers.predict.predictBatik,
//     options: {
//       auth: "jwt",
//       payload: {
//         maxBytes: 2 * 1024 * 1024, // 2MB max size
//         output: "stream",
//         parse: true,
//         multipart: true,
//       },
//       validate: {
//         payload: Joi.object({
//           img: Joi.any().required(),
//         }),
//       },
//     },
//   },
//   // History route
//   {
//     method: "GET",
//     path: "/predict/histories",
//     handler: handlers.predict.getHistories,
//     options: {
//       auth: "jwt",
//     },
//   },
//   // Catalog route
//   {
//     method: "GET",
//     path: "/catalog",
//     handler: handlers.catalog.getCatalog,
//     options: {
//       auth: "jwt",
//     },
//   },
// ];

// module.exports = routes;

import { getCatalog } from "../controllers/catalogController.js";
import { predictBatik } from "../controllers/predictController.js";
import { getHistory } from "../controllers/historyController.js";

export default [
  // ===========================================
  // routes/catalogRoutes.js
  // ===========================================
  {
    method: "GET",
    path: "/catalog",
    pre: [{ method: verifyToken }],
    handler: getCatalog,
  },

  // ===========================================
  // routes/predictRoutes.js
  // ===========================================

  {
    method: "POST",
    path: "/predict",
    pre: [{ method: verifyToken }],
    options: {
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        maxBytes: 2 * 1024 * 1024,
      },
    },
    handler: predictBatik,
  },

  // ===========================================
  // routes/historyRoutes.js
  // ===========================================

  {
    method: "GET",
    path: "/histories",
    pre: [{ method: verifyToken }],
    handler: getHistory,
  },
];
