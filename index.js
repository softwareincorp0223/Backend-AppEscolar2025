/*
//FUNCIONALIDAD ANTES 
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const routesPath = path.resolve("./routes");
for (const file of fs.readdirSync(routesPath)) {
  if (file.endsWith(".js")) {
    const routeModule = await import(pathToFileURL(path.join(routesPath, file)));
    const router = routeModule.default;
    const basePath = routeModule.basePath || "/api/" + file.replace("Routes.js", "").replace(".js", "").toLowerCase();
    app.use(basePath, router);
  }
}
try { await sequelize.authenticate(); console.log('✅ Conexión a MySQL exitosa'); } catch (err) { console.error('❌ Error de conexión:', err); }
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
*/
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

dotenv.config();
const app = express();

app.use(express.json());

const allowedOrigins = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    const isAllowed = allowedOrigins.some(o => origin?.startsWith(o));

    if (!origin || isAllowed) {
      callback(null, true);
    } else {
      console.warn("❌ CORS bloqueado para:", origin);
      callback(new Error("No permitido por CORS"));
    }

  },
  credentials: true,
};

app.use(cors(corsOptions));

// Cargar rutas
const routesPath = path.resolve("./routes");
for (const file of fs.readdirSync(routesPath)) {
  if (file.endsWith(".js")) {
    const routeModule = await import(pathToFileURL(path.join(routesPath, file)));
    const router = routeModule.default;
    const basePath = routeModule.basePath || "/api/" + file.replace("Routes.js", "").replace(".js", "").toLowerCase();
    app.use(basePath, router);
  }
}

// DB
try {
  await sequelize.authenticate();
  console.log("✅ Conexión a MySQL exitosa");
} catch (err) {
  console.error("❌ Error de conexión:", err);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

