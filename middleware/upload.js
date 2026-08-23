import multer from "multer";

// =========================
// Storage temporal en memoria
// =========================

const storage = multer.memoryStorage();

// =========================
// Configuración
// =========================

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {

    console.log("===============");
    console.log("MULTER FILE");
    console.log("===============");
    console.log(file);

    cb(null, true);

  },
});

export default upload;
