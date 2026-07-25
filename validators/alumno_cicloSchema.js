import Joi from "joi";

const schema = Joi.object({
  id_alumno_ciclo: Joi.string(),
  sid_alumno: Joi.string().required(),
  sid_ciclo: Joi.string().required(),
  sid_nivel: Joi.string().required(),
  sid_grado: Joi.string().required(),
  sid_grupo: Joi.string().required(),
  estado: Joi.string().valid("activo", "cerrado", "egresado", "baja").default("activo"),
  fecha_inicio: Joi.date().allow(null),
  fecha_fin: Joi.date().allow(null),
  promovido: Joi.boolean().default(false),
  observaciones: Joi.string().allow(null, ""),
  responsable: Joi.string().allow(null, ""),
  fecha_creacion: Joi.date().allow(null),
  fecha_actualizacion: Joi.date().allow(null),
});

export default schema;
