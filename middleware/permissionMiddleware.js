import { verificarToken } from "./authMiddleware.js";
import PrivilegiosRol from "../models/privilegios_rol.js";
import Privilegios from "../models/privilegios.js";
import { getModuleKeysFromPermissions } from "../config/permissionModules.js";

const routePermissions = {
  estadisticas: "estadisticas",
  instituto: "configuraciones",
  nivel: "niveles",
  grado: "niveles",
  grupo: "niveles",
  ciclo: "niveles",
  ciclo_grado: "niveles",
  usuario: "usuarios",
  vista_admin_estudiantes: "estudiantes",
  padre: "padres",
  alumno: "estudiantes",
  alumno_ciclo: "estudiantes",
  alumno_extracurricular: "extracurriculares",
  rol: "roles",
  privilegios: "roles",
  privilegios_rol: "roles",
  mensaje: "mensajes",
  tipo_mensaje: "mensajes",
  registro_mensajes: "mensajes",
  destinatarios: "mensajes",
  asignar_mensaje: "mensajes",
  archivo_mensaje: "mensajes",
  url_mensaje: "mensajes",
  vistaMensajes: "mensajes",
  vistaHistorialMensajes: "mensajes",
  vistaRegistroMensajes: "mensajes",
  vistaAsignarMensajeAlumno: "mensajes",
  extracurricular: "extracurriculares",
  seguimiento: "seguimientos",
  atributo: "seguimientos",
  asignar_atributo: "seguimientos",
  materia: "materias",
  asignar_materia: "materias",
  asignar_clase: "materias",
  vistaAsignacionMaterias: "materias",
  calificaciones: "calificaciones",
  evaluacion: "calificaciones",
  asistencia: "asistencias",
  scanner: "asistencias",
  vistaAsistencia: "asistencias",
  calendario: "calendario",
  evento: "calendario",
  asignar_evento: "calendario",
  tareas: "tareas",
  asignar_tarea: "tareas",
  archivo_tarea: "tareas",
  archivo_respuesta_tarea: "tareas",
  url_tarea: "tareas",
  vistaTareas: "tareas",
  archivos_exportar: "cargar_datos",
  pago: "pagos",
  penalidad: "pagos",
};

const normalizeBasePath = (basePath = "") =>
  basePath.replace(/^\/api\/?/, "").replace(/^\//, "").split("/")[0];

const isActive = (value) =>
  value === true ||
  value === 1 ||
  String(value).toLowerCase() === "si" ||
  String(value).toLowerCase() === "true" ||
  String(value) === "1" ||
  String(value).toLowerCase() === "activo";

export const getRoutePermission = (basePath) => {
  const routeKey = normalizeBasePath(basePath);
  return routePermissions[routeKey] || null;
};

export const requireRoutePermission = (basePath) => {
  const permissionKey = getRoutePermission(basePath);

  return [
    verificarToken,
    async (req, res, next) => {
      if (!permissionKey) return next();
      if (req.user?.tipo === "admin") return next();

      if (!req.user?.sid_rol) {
        return res.status(403).json({ error: "Usuario sin rol asignado" });
      }

      try {
        const rolePermissions = await PrivilegiosRol.findAll({
          where: { sid_rol: req.user.sid_rol },
        });

        if (rolePermissions.length === 0) return next();

        const activePrivilegeIds = rolePermissions
          .filter((permission) => isActive(permission.activo))
          .map((permission) => permission.sid_privilegios);

        const activePrivileges = activePrivilegeIds.length
          ? await Privilegios.findAll({
              where: { privilegios_id: activePrivilegeIds },
            })
          : [];

        const allowedModuleKeys = getModuleKeysFromPermissions(activePrivileges);

        if (!allowedModuleKeys.includes(permissionKey)) {
          return res.status(403).json({ error: "No tienes acceso a este modulo" });
        }

        return next();
      } catch (error) {
        console.error("[requireRoutePermission]", error);
        return res.status(500).json({ error: "Error al validar permisos" });
      }
    },
  ];
};
