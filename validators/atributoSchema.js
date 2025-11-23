import Joi from "joi";

const schema = Joi.object({
  id_atributo: Joi.string(),
  icono: Joi.string(),
  nombre: Joi.string(),
  sid_instituto: Joi.string(),
  sid_usuario: Joi.string().required()
});

export default schema;
