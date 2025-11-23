import Joi from "joi";

const schema = Joi.object({
  id_asignar_tutor: Joi.string(),
  sid_padre: Joi.string(),
  sid_alumno: Joi.string(),
  sid_usuario: Joi.string()
});

export default schema;
