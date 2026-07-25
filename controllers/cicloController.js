import Ciclo from "../models/ciclo.js";
import createCRUD from "./core/genericController.js";
import schema from "../validators/cicloSchema.js";
import sequelize from "../config/database.js";
import Alumno from "../models/alumno.js";
import AlumnoCiclo from "../models/alumno_ciclo.js";
import Nivel from "../models/nivel.js";
import Grado from "../models/grado.js";
import Grupo from "../models/grupo.js";
import { Op } from "sequelize";
import { generadorID } from "../helpers/generadorID.js";

const crud = createCRUD(Ciclo, "id_ciclo");

export const getAll = crud.getAll;
export const getById = crud.getById;

const today = () => new Date().toISOString().slice(0, 10);

const findActiveCycle = async (sid_instituto, options = {}) => {
  const activeRecord = await AlumnoCiclo.findOne({
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

  return activeRecord?.Ciclo || null;
};

const getRegularizationCycle = async (sid_instituto, options = {}) => {
  const openCycles = await Ciclo.findAll({
    where: { sid_instituto, ciclo_cerrado: 0 },
    order: [["orden", "ASC"]],
    ...options,
  });

  for (const ciclo of openCycles) {
    const count = await AlumnoCiclo.count({
      where: { sid_ciclo: ciclo.id_ciclo },
      ...options,
    });
    if (count === 0) return ciclo;
  }

  return null;
};

const buildMissingKey = (alumno, grupoActual, nuevoNivel, nuevoGrado) =>
  [
    alumno.sid_nivel,
    alumno.sid_grado,
    grupoActual.nombre,
    nuevoNivel.id_nivel,
    nuevoGrado.id_grado,
  ].join("|");

const getNextAcademicPosition = async (
  alumno,
  transaction,
  overridesMap = new Map(),
  missingMap = null
) => {
  const nivelActual = await Nivel.findByPk(alumno.sid_nivel, { transaction });
  const gradoActual = await Grado.findByPk(alumno.sid_grado, { transaction });
  const grupoActual = await Grupo.findByPk(alumno.sid_grupo, { transaction });

  if (!nivelActual || !gradoActual || !grupoActual) {
    return {
      error: `El alumno ${alumno.nombre} ${alumno.apellido} no tiene una ubicacion academica completa`,
    };
  }

  const siguienteGrado = await Grado.findOne({
    where: {
      sid_nivel: nivelActual.id_nivel,
      orden: { [Op.gt]: gradoActual.orden },
    },
    order: [["orden", "ASC"]],
    transaction,
  });

  let nuevoNivel = nivelActual;
  let nuevoGrado = siguienteGrado;

  if (!nuevoGrado) {
    nuevoNivel = await Nivel.findOne({
      where: {
        sid_instituto: nivelActual.sid_instituto,
        orden: { [Op.gt]: nivelActual.orden },
      },
      order: [["orden", "ASC"]],
      transaction,
    });

    if (!nuevoNivel) {
      return { egresado: true };
    }

    nuevoGrado = await Grado.findOne({
      where: { sid_nivel: nuevoNivel.id_nivel },
      order: [["orden", "ASC"]],
      transaction,
    });
  }

  if (!nuevoGrado) {
    return {
      error: `El nivel ${nuevoNivel.nombre} no tiene grados configurados`,
    };
  }

  const nuevoGrupo = await Grupo.findOne({
    where: {
      sid_grado: nuevoGrado.id_grado,
      nombre: grupoActual.nombre,
    },
    transaction,
  });

  if (!nuevoGrupo) {
    const key = buildMissingKey(alumno, grupoActual, nuevoNivel, nuevoGrado);
    const gruposDisponibles = await Grupo.findAll({
      where: { sid_grado: nuevoGrado.id_grado },
      order: [["nombre", "ASC"]],
      transaction,
    });
    const overrideGrupoId = overridesMap.get(key);

    if (overrideGrupoId) {
      const grupoOverride = gruposDisponibles.find(
        (grupo) => grupo.id_grupo === overrideGrupoId
      );

      if (!grupoOverride) {
        return {
          error: `El grupo seleccionado no pertenece a ${nuevoNivel.nombre} ${nuevoGrado.nombre}`,
        };
      }

      return {
        sid_nivel: nuevoNivel.id_nivel,
        sid_grado: nuevoGrado.id_grado,
        sid_grupo: grupoOverride.id_grupo,
      };
    }

    if (missingMap) {
      const current = missingMap.get(key) || {
        key,
        origen: {
          sid_nivel: nivelActual.id_nivel,
          sid_grado: gradoActual.id_grado,
          sid_grupo: grupoActual.id_grupo,
          nivel: nivelActual.nombre,
          grado: gradoActual.nombre,
          grupo: grupoActual.nombre,
        },
        destino: {
          sid_nivel: nuevoNivel.id_nivel,
          sid_grado: nuevoGrado.id_grado,
          nivel: nuevoNivel.nombre,
          grado: nuevoGrado.nombre,
          grupo_esperado: grupoActual.nombre,
        },
        grupos_disponibles: gruposDisponibles.map((grupo) => ({
          id_grupo: grupo.id_grupo,
          nombre: grupo.nombre,
        })),
        total_alumnos: 0,
      };

      current.total_alumnos += 1;
      missingMap.set(key, current);
    }

    return {
      error: `Falta el grupo ${grupoActual.nombre} para ${nuevoNivel.nombre} ${nuevoGrado.nombre}`,
    };
  }

  return {
    sid_nivel: nuevoNivel.id_nivel,
    sid_grado: nuevoGrado.id_grado,
    sid_grupo: nuevoGrupo.id_grupo,
  };
};

const getPasoContext = async (sid_instituto, transaction) => {
  const cicloActual = await findActiveCycle(sid_instituto, { transaction });
  if (!cicloActual) {
    return { error: "La escuela debe regularizarse antes de pasar ciclo" };
  }

  const cicloSiguiente = await Ciclo.findOne({
    where: {
      sid_instituto,
      ciclo_cerrado: 0,
      orden: { [Op.gt]: cicloActual.orden },
    },
    order: [["orden", "ASC"]],
    transaction,
  });

  if (!cicloSiguiente) {
    return { error: "No existe un ciclo abierto siguiente" };
  }

  const cicloSiguienteUsado = await AlumnoCiclo.count({
    where: { sid_ciclo: cicloSiguiente.id_ciclo },
    transaction,
  });
  if (cicloSiguienteUsado > 0) {
    return { error: "El ciclo siguiente ya tiene alumnos registrados" };
  }

  const registrosActivos = await AlumnoCiclo.findAll({
    where: { sid_ciclo: cicloActual.id_ciclo, estado: "activo" },
    include: [{ model: Alumno, required: true, where: { sid_instituto } }],
    transaction,
  });

  return { cicloActual, cicloSiguiente, registrosActivos };
};

export const createOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });

  const transaction = await sequelize.transaction();

  try {
    const maxOrden = await Ciclo.max("orden", {
      where: { sid_instituto: value.sid_instituto },
      transaction,
    });

    const created = await Ciclo.create(
      {
        ...value,
        ciclo_cerrado: value.ciclo_cerrado ?? 0,
        orden: maxOrden ? maxOrden + 1 : 1,
      },
      { transaction }
    );

    await transaction.commit();
    return res.status(201).json(created);
  } catch (err) {
    await transaction.rollback();
    console.error("[createOne ciclo]", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
export const updateOne = async (req, res) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
  req.body = value;
  return crud.updateOne(req, res);
};

export const deleteOne = async (req, res) => {
  try {
    const ciclo = await Ciclo.findByPk(req.params.id);
    if (!ciclo) return res.status(404).json({ error: "No encontrado" });

    const usado = await AlumnoCiclo.count({ where: { sid_ciclo: ciclo.id_ciclo } });
    if (ciclo.ciclo_cerrado || usado > 0) {
      return res.status(409).json({
        error: "No se puede eliminar un ciclo cerrado o usado",
      });
    }

    await ciclo.destroy();
    return res.json({ message: "Eliminado correctamente" });
  } catch (err) {
    console.error("[delete ciclo]", err);
    return res.status(500).json({ error: "Error del servidor", details: err.message });
  }
};

export const getEstado = async (req, res) => {
  try {
    const { sid_instituto } = req.params;
    const ciclosAbiertos = await Ciclo.count({ where: { sid_instituto, ciclo_cerrado: 0 } });
    const registros = await AlumnoCiclo.count({
      include: [
        {
          model: Ciclo,
          required: true,
          where: { sid_instituto },
        },
      ],
    });
    const activos = await AlumnoCiclo.count({
      where: { estado: "activo" },
      include: [
        {
          model: Ciclo,
          required: true,
          where: { sid_instituto },
        },
      ],
    });
    const cicloActivo = await findActiveCycle(sid_instituto);
    const cicloRegularizacion = await getRegularizationCycle(sid_instituto);

    return res.json({
      tiene_ciclo_abierto: ciclosAbiertos > 0,
      regularizado: registros > 0,
      tiene_alumnos_activos: activos > 0,
      ciclo_activo: cicloActivo,
      ciclo_regularizacion: cicloRegularizacion,
      requiere_regularizar: ciclosAbiertos > 0 && registros === 0,
    });
  } catch (err) {
    console.error("[estado ciclos]", err);
    return res.status(500).json({ error: "Error al obtener estado de ciclos" });
  }
};

export const regularizarEscuela = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sid_instituto } = req.body;
    if (!sid_instituto) {
      await transaction.rollback();
      return res.status(400).json({ error: "sid_instituto es requerido" });
    }

    const registros = await AlumnoCiclo.count({
      include: [
        {
          model: Ciclo,
          required: true,
          where: { sid_instituto },
        },
      ],
      transaction,
    });

    if (registros > 0) {
      await transaction.rollback();
      return res.status(409).json({ error: "La escuela ya fue regularizada" });
    }

    const ciclo = await getRegularizationCycle(sid_instituto, { transaction });
    if (!ciclo) {
      await transaction.rollback();
      return res.status(400).json({ error: "No existe un ciclo abierto sin usar para regularizar" });
    }

    const alumnos = await Alumno.findAll({ where: { sid_instituto }, transaction });
    const fecha = today();
    const alumnosValidos = alumnos.filter((alumno) =>
      alumno.sid_nivel && alumno.sid_grado && alumno.sid_grupo
    );

    await AlumnoCiclo.bulkCreate(
      alumnosValidos.map((alumno) => ({
        id_alumno_ciclo: generadorID(10),
        sid_alumno: alumno.id_alumno,
        sid_ciclo: ciclo.id_ciclo,
        sid_nivel: alumno.sid_nivel,
        sid_grado: alumno.sid_grado,
        sid_grupo: alumno.sid_grupo,
        estado: "activo",
        fecha_inicio: fecha,
        promovido: false,
      })),
      { transaction }
    );

    await transaction.commit();
    return res.json({
      message: "Escuela regularizada correctamente",
      ciclo,
      total_alumnos: alumnos.length,
      total_regularizados: alumnosValidos.length,
      total_omitidos: alumnos.length - alumnosValidos.length,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("[regularizar escuela]", err);
    return res.status(500).json({ error: "Error al regularizar escuela", details: err.message });
  }
};

export const validarPasoCiclo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sid_instituto } = req.body;
    if (!sid_instituto) {
      await transaction.rollback();
      return res.status(400).json({ error: "sid_instituto es requerido" });
    }

    const context = await getPasoContext(sid_instituto, transaction);
    if (context.error) {
      await transaction.rollback();
      return res.status(400).json({ error: context.error });
    }

    const faltantes = new Map();
    const errores = new Set();
    let totalEgresados = 0;

    for (const registro of context.registrosActivos) {
      const siguiente = await getNextAcademicPosition(
        registro.Alumno,
        transaction,
        new Map(),
        faltantes
      );

      if (siguiente.egresado) totalEgresados += 1;
      if (siguiente.error && !siguiente.error.startsWith("Falta el grupo")) {
        errores.add(siguiente.error);
      }
    }

    await transaction.rollback();

    if (errores.size > 0) {
      return res.status(400).json({
        error: "No se puede pasar ciclo porque faltan configuraciones",
        detalles: Array.from(errores),
      });
    }

    return res.json({
      puede_pasar: faltantes.size === 0,
      ciclo_actual: context.cicloActual,
      ciclo_siguiente: context.cicloSiguiente,
      total_alumnos: context.registrosActivos.length,
      total_egresados: totalEgresados,
      faltantes: Array.from(faltantes.values()),
    });
  } catch (err) {
    await transaction.rollback();
    console.error("[validar paso ciclo]", err);
    return res.status(500).json({ error: "Error al validar paso de ciclo", details: err.message });
  }
};

export const pasarCiclo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sid_instituto, overrides = [] } = req.body;
    if (!sid_instituto) {
      await transaction.rollback();
      return res.status(400).json({ error: "sid_instituto es requerido" });
    }

    const context = await getPasoContext(sid_instituto, transaction);
    if (context.error) {
      await transaction.rollback();
      return res.status(400).json({ error: context.error });
    }

    const overridesMap = new Map(
      Array.isArray(overrides)
        ? overrides
          .filter((item) => item?.key && item?.sid_grupo_destino)
          .map((item) => [item.key, item.sid_grupo_destino])
        : []
    );

    const nuevosRegistros = [];
    const egresados = [];
    const errores = new Set();
    const faltantes = new Map();
    const fecha = today();

    for (const registro of context.registrosActivos) {
      const alumno = registro.Alumno;
      const siguiente = await getNextAcademicPosition(
        alumno,
        transaction,
        overridesMap,
        faltantes
      );

      if (siguiente.error) {
        errores.add(siguiente.error);
        continue;
      }

      if (siguiente.egresado) {
        egresados.push({ registro, alumno });
        continue;
      }

      nuevosRegistros.push({
        registro,
        alumno,
        nuevo: siguiente,
      });
    }

    if (errores.size > 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: "No se puede pasar ciclo porque faltan configuraciones",
        detalles: Array.from(errores),
        faltantes: Array.from(faltantes.values()),
      });
    }

    await AlumnoCiclo.update(
      { estado: "cerrado", fecha_fin: fecha, promovido: true },
      {
        where: { sid_ciclo: context.cicloActual.id_ciclo, estado: "activo" },
        transaction,
      }
    );

    await AlumnoCiclo.bulkCreate(
      nuevosRegistros.map(({ alumno, nuevo }) => ({
        id_alumno_ciclo: generadorID(10),
        sid_alumno: alumno.id_alumno,
        sid_ciclo: context.cicloSiguiente.id_ciclo,
        sid_nivel: nuevo.sid_nivel,
        sid_grado: nuevo.sid_grado,
        sid_grupo: nuevo.sid_grupo,
        estado: "activo",
        fecha_inicio: fecha,
        promovido: false,
      })),
      { transaction }
    );

    for (const { alumno, nuevo } of nuevosRegistros) {
      await alumno.update(
        {
          sid_nivel: nuevo.sid_nivel,
          sid_grado: nuevo.sid_grado,
          sid_grupo: nuevo.sid_grupo,
        },
        { transaction }
      );
    }

    for (const { registro } of egresados) {
      await registro.update(
        {
          estado: "egresado",
          fecha_fin: fecha,
          promovido: false,
          observaciones: "Egresado al finalizar el ultimo nivel y grado configurado",
        },
        { transaction }
      );
    }

    await context.cicloActual.update({ ciclo_cerrado: 1 }, { transaction });

    await transaction.commit();
    return res.json({
      message: "Ciclo avanzado correctamente",
      ciclo_cerrado: context.cicloActual,
      ciclo_activo: context.cicloSiguiente,
      total_procesados: context.registrosActivos.length,
      total_promovidos: nuevosRegistros.length,
      total_egresados: egresados.length,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("[pasar ciclo]", err);
    return res.status(500).json({ error: "Error al pasar ciclo", details: err.message });
  }
};
