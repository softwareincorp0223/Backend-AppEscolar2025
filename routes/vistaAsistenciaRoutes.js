import express from "express";
import Asistencia from "../models/asistencia.js";
import Alumno from "../models/alumno.js";
import AlumnoCiclo from "../models/alumno_ciclo.js";
import Ciclo from "../models/ciclo.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/grupo.js";
import Usuario from "../models/usuario.js";

const router = express.Router();

const formatAsistencia = (row) => {
  const asistencia = row.toJSON();
  const alumno = asistencia.Alumno || {};
  const cicloActivo = alumno.AlumnoCiclos?.[0] || {};

  return {
    id_asistencia: asistencia.id_asistencia,
    sid_alumno: asistencia.sid_alumno,
    sid_usuario: asistencia.sid_usuario,
    sid_instituto: alumno.sid_instituto,
    fecha_ingreso: asistencia.fecha_ingreso,
    hora: asistencia.hora,
    tipo: asistencia.tipo,
    nombre_alumno: alumno.nombre,
    apellido_alumno: alumno.apellido,
    matricula: alumno.matricula,
    sid_nivel: cicloActivo.sid_nivel,
    sid_grado: cicloActivo.sid_grado,
    sid_grupo: cicloActivo.sid_grupo,
    sid_ciclo: cicloActivo.sid_ciclo,
    nombre_ciclo: cicloActivo.Ciclo?.nombre,
    nombre_nivel: cicloActivo.Nivel?.nombre,
    nombre_grado: cicloActivo.Grado?.nombre,
    nombre_grupo: cicloActivo.Grupo?.nombre,
    nombre_usuario: asistencia.Usuario?.nombre,
    apellido_usuario: asistencia.Usuario?.apellido,
  };
};

const getAsistencias = async (sid_instituto) => {
  return Asistencia.findAll({
    include: [
      {
        model: Alumno,
        required: true,
        where: { sid_instituto },
        include: [
          {
            model: AlumnoCiclo,
            required: true,
            where: { estado: "activo" },
            include: [
              { model: Ciclo, required: true, where: { ciclo_cerrado: 0 } },
              { model: Nivel, required: false },
              { model: Grado, required: false },
              { model: Grupo, required: false },
            ],
          },
        ],
      },
      { model: Usuario, required: false },
    ],
    order: [["fecha_ingreso", "DESC"], ["hora", "DESC"]],
  });
};

router.get("/excel/:sid_instituto", async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const data = await getAsistencias(sid_instituto);

    return res.json(data.map(formatAsistencia));
  } catch (error) {
    console.error("[getAllExcel]", error);
    return res.status(500).json({ error: "Error al obtener asistencias" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { sid_instituto } = req.query;
    if (!sid_instituto) return res.status(400).json({ error: "sid_instituto es requerido" });

    const data = await getAsistencias(sid_instituto);

    return res.json(data.map(formatAsistencia));
  } catch (error) {
    console.error("[getAll asistencias]", error);
    return res.status(500).json({ error: "Error al obtener asistencias" });
  }
});

export default router;
