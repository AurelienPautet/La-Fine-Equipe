import { request, Request, Response } from "express";
import fileUpload from "express-fileupload";
import { put, del } from "@vercel/blob";

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.files?.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  let folder = req.params.folder || "";

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
  const { searchParams } = new URL(req.url);
  const urlToDelete = searchParams.get("url") as string;
  await del(urlToDelete);
  return res.status(204).send();
};
