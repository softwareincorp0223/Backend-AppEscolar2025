import Joi from "joi";

const schema = Joi.object({
  id_asignar_clase: Joi.string(),
  sid_materia: Joi.string(),
  sid_profesor: Joi.string(),
  sid_usuario: Joi.string()
});

export default schema;
