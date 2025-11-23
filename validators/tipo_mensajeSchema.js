import Joi from "joi";

const schema = Joi.object({
  id_tipo_mensaje: Joi.string(),
  icono: Joi.string(),
  nombre: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
