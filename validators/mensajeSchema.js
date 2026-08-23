import Joi from "joi";

const periodosMensaje = ["Diario", "Semanalmente", "Mensualmente", "Anualmente"];

const schema = Joi.object({
  id_mensaje: Joi.string().allow("", null),
  receptor: Joi.string().required(),
  sid_usuario_emisor: Joi.string().required(),
  sid_tipo: Joi.string().required(),
  sid_alumno: Joi.string().allow("", null),
  sid_nivel: Joi.string().allow("", null),
  sid_grado: Joi.string().allow("", null),
  sid_grupo: Joi.string().allow("", null),
  sid_extracurricular: Joi.string().allow("", null),
  destinatarios: Joi.number().allow(null),
  asunto: Joi.string().allow("", null),
  mensaje: Joi.string().allow("", null),
  respuesta_rapida: Joi.string().allow("", null),
  mensaje_programado: Joi.string().allow("", null),
  fecha_envio: Joi.date().allow("", null),
  hora_envio: Joi.string().allow("", null),
  repetir: Joi.string().allow("", null),
  periodo: Joi.string().valid(...periodosMensaje).allow("", null),
  fecha_fin: Joi.date().allow("", null),
  leido: Joi.string().allow("", null),
  eliminado: Joi.string().allow("", null),
  sid_instituto: Joi.string().allow("", null),
});

export default schema;
