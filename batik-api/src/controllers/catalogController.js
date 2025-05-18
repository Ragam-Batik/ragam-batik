import catalog from "../data/catalog.json" assert { type: "json" };

export const getCatalog = async (req, h) => {
  return h.response({ status: true, data: catalog });
};
