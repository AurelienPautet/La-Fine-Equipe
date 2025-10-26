import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { put, del } from "@vercel/blob";

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.files?.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  const folder = req.params.folder || "";

  const file = req.files.file as fileUpload.UploadedFile;

  const blob = await put(`${folder}/${file.name}`, file.data, {
    access: "public",
    contentType: file.mimetype,
    addRandomSuffix: true,
  });

  res.json({
    success: true,
    url: blob.url,
    name: file.name,
    type: file.mimetype,
  });
};

export const deleteFile = async (req: Request, res: Response) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.url}`;
  const { searchParams } = new URL(fullUrl);
  let urlToDelete = searchParams.get("url") as string;
  urlToDelete = decodeURIComponent(urlToDelete);
  try {
    await del(urlToDelete);
  } catch (error) {
    console.error("Error deleting file:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting file" });
  }
  return res.status(204).send();
};
