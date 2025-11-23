import Joi from "joi";

const schema = Joi.object({
  id_asignar_atributo: Joi.string(),
  sid_atributo: Joi.string(),
  sid_seguimiento: Joi.string(),
  valor_atributo: Joi.string(),
  fecha_registro: Joi.date(),
  sid_usuario: Joi.string()
});

export default schema;
