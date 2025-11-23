import Joi from "joi";

const schema = Joi.object({
  id_evaluacion: Joi.string().required(),
  sid_alumno: Joi.string().required(),
  promedio_general: Joi.string().required(),
  promedio_final: Joi.string().required(),
  ciclo: Joi.string().required(),
  fecha_registro: Joi.date().required(),
  leido: Joi.string()
});

export default schema;
