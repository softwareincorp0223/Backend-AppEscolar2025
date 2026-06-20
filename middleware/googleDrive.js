import fs from "fs";
import path from "path";

import { google } from "googleapis";

import { Readable } from "stream";

// =========================
// Auth
// =========================

const auth = new google.auth.GoogleAuth({
  keyFile: "../google-drive-key.json",
  scopes: [
    "https://www.googleapis.com/auth/drive",
  ],
});

const drive = google.drive({
  version: "v3",
  auth,
});

// =========================
// Upload file
// =========================

export const uploadFileToDrive = async (
  file,
) => {
  try {

    // Convertir buffer a stream
    const bufferStream =
      new Readable();

    bufferStream.push(file.buffer);

    bufferStream.push(null);

    // Upload
    const response =
      await drive.files.create({
        requestBody: {
          name: file.originalname,

          parents: [
            "1oWv-gNi37p6ej7mgDGwHCYNuXwfIbVP9?usp=drive_link",
          ],
        },

        media: {
          mimeType: file.mimetype,

          body: bufferStream,
        },
      });

    // Permiso público
    await drive.permissions.create({
      fileId: response.data.id,

      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Obtener links
    const result =
      await drive.files.get({
        fileId: response.data.id,

        fields:
          "id, webViewLink, webContentLink",
      });

    return result.data;

  } catch (error) {
    console.error(error);

    throw error;
  }
};