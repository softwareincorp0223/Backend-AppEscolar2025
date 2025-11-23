import Joi from "joi";

const schema = Joi.object({
  id_registro_mensajes: Joi.string().required(),
  sid_mensaje: Joi.string().required(),
  responsable: Joi.string().required(),
  fecha_eliminacion: Joi.date().required()
});

export default schema;
