import Joi from "joi";

const schema = Joi.object({
  id_rol: Joi.string(),
  sid_instituto: Joi.string(),
  nombre: Joi.string(),
  fecha_registro: Joi.date()
});

export default schema;
