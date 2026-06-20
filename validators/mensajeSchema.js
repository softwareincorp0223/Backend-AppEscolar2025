import Joi from "joi";

const schema = Joi.object({
  id_mensaje: Joi.string(),
  receptor: Joi.string().required(),
  sid_usuario_emisor: Joi.string().required(),
  sid_tipo: Joi.string().required(),
  sid_alumno: Joi.string(),
  sid_nivel: Joi.string(),
  sid_grado: Joi.string(),
  sid_grupo: Joi.string(),
  sid_extracurricular: Joi.string(),
  destinatarios: Joi.number(),
  asunto: Joi.string().allow("", null),
  mensaje: Joi.string().allow("", null),
  respuesta_rapida: Joi.string(),
  mensaje_programado: Joi.string(),
  fecha_envio: Joi.date(),
  hora_envio: Joi.string(),
  repetir: Joi.string(),
  periodo: Joi.string(),
  fecha_fin: Joi.date(),
  leido: Joi.string(),
  eliminado: Joi.string(),
  sid_instituto: Joi.string()
});

export default schema;
