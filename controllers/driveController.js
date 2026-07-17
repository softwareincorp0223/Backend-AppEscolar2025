import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

// =========================
// Configuración
// =========================

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// =========================
// Subir un archivo
// =========================

const uploadFileToImageKit = async (file) => {

  const response = await imagekit.upload({

    file: file.buffer,

    fileName: file.originalname,

    useUniqueFileName: true,

  });

  return {

    id: response.fileId,

    nombre: response.name,

    url: response.url,

    tamaño: response.size,

    tipo: response.fileType,

  };

};

// =========================
// Endpoint
// =========================

export const upload = async (req, res) => {

  try {

    if (!req.files?.length) {

      return res.status(400).json({

        ok: false,

        message: "No se recibieron archivos.",

      });

    }

    const archivos = await Promise.all(

      req.files.map(uploadFileToImageKit)

    );

    return res.status(200).json({

      ok: true,

      total: archivos.length,

      files: archivos,

    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({

      ok: false,

      message: error.message,

    });

  }

};