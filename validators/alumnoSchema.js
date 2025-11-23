import Joi from "joi";

const schema = Joi.object({
  id_alumno: Joi.string(),
  nombre: Joi.string(),
  apellido: Joi.string(),
  matricula: Joi.string(),
  sexo: Joi.string(),
  codigo_qr: Joi.string().required(),
  sid_nivel: Joi.string(),
  sid_grado: Joi.string(),
  sid_grupo: Joi.string(),
  sid_padre: Joi.string(),
  sid_instituto: Joi.string(),
  foto: Joi.string(),
  nombre_contacto: Joi.string(),
  telefono_contacto: Joi.string(),
  alergias: Joi.string()
});

export default schema;
