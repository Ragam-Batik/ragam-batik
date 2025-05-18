import * as predictService from "../services/predictService.js";

export const predictBatik = async (req, h) => {
  try {
    const { img, email } = req.payload;
    const result = await predictService.handlePrediction(img, email);
    return h.response(result).code(result.status ? 200 : 400);
  } catch (err) {
    return h.response({ status: false, message: err.message }).code(500);
  }
};

export const predictBatikFromImage = async (image_url) => {
  return await predictService.predictBatikFromImage(image_url);
}; 