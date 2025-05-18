import tf from "@tensorflow/tfjs-node";
import { supabase } from "../app.js";
import catalog from "../models/catalog.js" assert { type: "json" };
import { uploadToS3 } from "./storageService.js";

const classLabels = Object.keys(catalog).map((k) => k.replace(/_/g, " "));
const model = await tf.loadLayersModel(
  ``
);

export const handlePrediction = async (img, email) => {
  if (!img || !email)
    return { status: false, message: "Email dan gambar wajib" };

  const chunks = [];
  for await (const chunk of img) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  const tensor = tf.node
    .decodeImage(buffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims(0);

  const predictions = model.predict(tensor);
  const values = await predictions.data();
  const index = values.indexOf(Math.max(...values));
  const confidence = Math.round(values[index] * 100);
  if (confidence < 90) return { status: false, message: "Mungkin bukan batik" };

  const filename = `${email}_${Date.now()}.jpg`;

  // Upload to AWS S3 instead of Supabase
  let imageUrl;
  try {
    imageUrl = await uploadToS3(buffer, filename);
  } catch (err) {
    return { status: false, message: "Gagal upload ke S3: " + err.message };
  }

  const predictedKey = Object.keys(catalog)[index];

  await supabase.from("histories").insert({
    email,
    result: classLabels[index],
    imageUrl: imageUrl,
    createdAt: new Date().toISOString(),
    data: catalog[predictedKey],
  });

  return {
    status: true,
    result: classLabels[index],
    confidence,
    imageUrl: imageUrl,
    data: catalog[predictedKey],
  };
};

// import tf from "@tensorflow/tfjs-node";
// import { supabase } from "../app.js";
// import catalog from "../data/catalog.json" assert { type: "json" };
// import { uploadToS3 } from "./storageService.js";

// const classLabels = Object.keys(catalog).map((k) => k.replace(/_/g, " "));
// const model = await tf.loadLayersModel(
//   `file://${process.cwd()}/public/model/model.json`
// );

// export const handlePrediction = async (img, email) => {
//   if (!img || !email)
//     return { status: false, message: "Email dan gambar wajib" };

//   const chunks = [];
//   for await (const chunk of img) chunks.push(chunk);
//   const buffer = Buffer.concat(chunks);
//   const tensor = tf.node
//     .decodeImage(buffer)
//     .resizeNearestNeighbor([224, 224])
//     .expandDims(0);

//   const predictions = model.predict(tensor);
//   const values = await predictions.data();
//   const index = values.indexOf(Math.max(...values));
//   const confidence = Math.round(values[index] * 100);
//   if (confidence < 90) return { status: false, message: "Mungkin bukan batik" };

//   const filename = `${email}_${Date.now()}.jpg`;
//   const { error: uploadError } = await supabase.storage
//     .from("batik-images")
//     .upload(`predictions/${filename}`, buffer, { contentType: "image/jpeg" });
//   if (uploadError) return { status: false, message: uploadError.message };

//   const { data: publicUrl } = supabase.storage
//     .from("batik-images")
//     .getPublicUrl(`predictions/${filename}`);
//   const predictedKey = Object.keys(catalog)[index];

//   await supabase.from("histories").insert({
//     email,
//     result: classLabels[index],
//     imageUrl: publicUrl.publicUrl,
//     createdAt: new Date().toISOString(),
//     data: catalog[predictedKey],
//   });

//   return {
//     status: true,
//     result: classLabels[index],
//     confidence,
//     imageUrl: publicUrl.publicUrl,
//     data: catalog[predictedKey],
//   };
// };
