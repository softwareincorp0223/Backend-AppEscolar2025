import Joi from "joi";

const schema = Joi.object({
  id_calificaciones: Joi.string().required(),
  sid_evaluacion: Joi.string().required(),
  sid_materia: Joi.string().required(),
  calificacion: Joi.string().required(),
  periodo: Joi.string().required()
});

export default schema;
