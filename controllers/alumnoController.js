import Alumno from "../models/alumno.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/alumnoSchema.js";
import sequelize from "../config/database.js";
import AlumnoCiclo from "../models/alumno_ciclo.js";
import Ciclo from "../models/ciclo.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/grupo.js";
import Instituto from "../models/instituto.js";
import { generadorID } from "../helpers/generadorID.js";

const crud = createCRUD(Alumno, "id_alumno");

export const getAll = crud.getAll;

const today = () => new Date().toISOString().slice(0, 10);

const getCicloActivo = async (sid_instituto, options = {}) => {
  const registroActivo = await AlumnoCiclo.findOne({
    where: { estado: "activo" },
    include: [
      {
        model: Ciclo,
        required: true,
        where: { sid_instituto, ciclo_cerrado: 0 },
      },
    ],
    order: [[Ciclo, "orden", "DESC"]],
    ...options,
  });

  return registroActivo?.Ciclo || null;
};

export const getActivos = async (req, res) => {
  try {
    const { sid_instituto } = req.query;
    if (!sid_instituto) return res.status(400).json({ error: "sid_instituto es requerido" });

    const registros = await AlumnoCiclo.findAll({
      where: { estado: "activo" },
      include: [
        {
          model: Ciclo,
          required: true,
          where: { sid_instituto, ciclo_cerrado: 0 },
        },
        {
          model: Alumno,
          required: true,
          where: { sid_instituto },
          include: [{ model: Instituto, required: false }],
        },
        { model: Nivel, required: false },
        { model: Grado, required: false },
        { model: Grupo, required: false },
      ],
      order: [[Alumno, "nombre", "ASC"]],
    });

    const alumnos = registros.map((registro) => {
      const alumno = registro.Alumno?.toJSON() || {};
      return {
        ...alumno,
        id_alumno_ciclo: registro.id_alumno_ciclo,
        sid_ciclo: registro.sid_ciclo,
        ciclo: registro.Ciclo?.nombre || "",
        estado_ciclo: registro.estado,
        sid_nivel: registro.sid_nivel,
        sid_grado: registro.sid_grado,
        sid_grupo: registro.sid_grupo,
        Nivel: registro.Nivel,
        Grado: registro.Grado,
        Grupo: registro.Grupo,
      };
    });

    return res.json(alumnos);
  } catch (error) {
    console.error("[getActivos alumnos]", error);
    return res.status(500).json({ error: "Error al obtener alumnos activos" });
  }
};

export const alumnosPadres = async (req, res) => {
  try {
    const { sid_instituto } = req.params;

    const padresAlumnos = await Alumno.findAll({
      where: { sid_instituto }
    });

    return res.json(padresAlumnos);
  } catch (error) {
    console.error("[alumnosPadres]", error);
    return res.status(500).json({ error: "Error al obtener alumnos" });
  }
};

export const getById = crud.getById;
export const createOne = async (req, res) => {
  
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  const transaction = await sequelize.transaction();

  try {
    const created = await Alumno.create(value, { transaction });
    const cicloActivo = await getCicloActivo(value.sid_instituto, { transaction });

    if (cicloActivo && value.sid_nivel && value.sid_grado && value.sid_grupo) {
      await AlumnoCiclo.create(
        {
          id_alumno_ciclo: generadorID(10),
          sid_alumno: created.id_alumno,
          sid_ciclo: cicloActivo.id_ciclo,
          sid_nivel: value.sid_nivel,
          sid_grado: value.sid_grado,
          sid_grupo: value.sid_grupo,
          estado: "activo",
          fecha_inicio: today(),
          promovido: false,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return res.status(201).json(created);
  } catch (err) {
    await transaction.rollback();
    console.error("[create alumno]", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  const transaction = await sequelize.transaction();

  try {
    const alumno = await Alumno.findByPk(req.params.id, { transaction });
    if (!alumno) {
      await transaction.rollback();
      return res.status(404).json({ error: "Not found" });
    }

    await alumno.update(value, { transaction });

    const cicloActivo = await getCicloActivo(value.sid_instituto || alumno.sid_instituto, { transaction });
    if (cicloActivo) {
      const registroActivo = await AlumnoCiclo.findOne({
        where: {
          sid_alumno: alumno.id_alumno,
          sid_ciclo: cicloActivo.id_ciclo,
          estado: "activo",
        },
        transaction,
      });

      if (registroActivo && value.sid_nivel && value.sid_grado && value.sid_grupo) {
        await registroActivo.update(
          {
            sid_nivel: value.sid_nivel,
            sid_grado: value.sid_grado,
            sid_grupo: value.sid_grupo,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    return res.json(alumno);
  } catch (err) {
    await transaction.rollback();
    console.error("[update alumno]", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
export const deleteOne = crud.deleteOne;
