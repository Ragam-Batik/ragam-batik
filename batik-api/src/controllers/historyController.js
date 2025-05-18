import * as historyService from "../services/historyService.js";

export const getHistory = async (req, h) => {
  const email = req.query.email;
  return await historyService.fetchHistories(email, h);
};
