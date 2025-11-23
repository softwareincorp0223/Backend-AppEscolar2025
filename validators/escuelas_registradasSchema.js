import Joi from "joi";

const schema = Joi.object({
  escuelas_registradas_id: Joi.string().required(),
  nombre_contacto: Joi.string().required(),
  telefono_contacto: Joi.string().required(),
  relacion_escuela: Joi.string().required(),
  correo_contacto: Joi.string().email().required(),
  nombre_clave: Joi.string().required(),
  entidad: Joi.string().required(),
  municipio: Joi.string().required(),
  localidad: Joi.string().required(),
  nivel_educativo: Joi.string().required(),
  turno: Joi.string().required(),
  sostenimiento: Joi.string().required(),
  fecha_registro_contacto: Joi.date().required()
});

export default schema;
