import { google } from "googleapis";
import { Readable } from "stream";

// =========================
// Auth
// =========================

const auth = new google.auth.GoogleAuth({
  keyFile: "google-drive-key.json",
  scopes: [
    "https://www.googleapis.com/auth/drive",
  ],
});

const drive = google.drive({
  version: "v3",
  auth,
});

// =========================
// Subir un archivo
// =========================

const uploadFileToDrive = async (file) => {

  const bufferStream = new Readable();

  bufferStream.push(file.buffer);
  bufferStream.push(null);

  const response = await drive.files.create({

    requestBody: {

      name: file.originalname,

      parents: [
        "1oWv-gNi37p6ej7mgDGwHCYNuXwfIbVP9"
      ],

    },

    media: {

      mimeType: file.mimetype,

      body: bufferStream,

    },

  });

  await drive.permissions.create({

    fileId: response.data.id,

    requestBody: {
      role: "reader",
      type: "anyone",
    },

  });

  return {

    id: response.data.id,

    url: `https://drive.google.com/uc?id=${response.data.id}`,

    nombre: file.originalname,

  };

};

// =========================
// Endpoint
// =========================

export const upload = async (req, res) => {

  try {

    if (!req.files || req.files.length === 0) {

      return res.status(400).json({
        ok: false,
        message: "No se recibieron archivos."
      });

    }

    const archivos = [];

    for (const file of req.files) {

      const resultado = await uploadFileToDrive(file);

      archivos.push(resultado);

    }

    return res.json({

      ok: true,

      files: archivos,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      ok: false,

      message: "Error al subir archivos."

    });

  }

};