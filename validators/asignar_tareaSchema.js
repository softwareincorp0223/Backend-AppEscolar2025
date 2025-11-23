import Joi from "joi";

const schema = Joi.object({
  id_asignar_tarea: Joi.string().required(),
  sid_tarea: Joi.string().required(),
  sid_alumno: Joi.string().required(),
  estatus: Joi.string().required(),
  observacion: Joi.string(),
  leido: Joi.string()
});

export default schema;
