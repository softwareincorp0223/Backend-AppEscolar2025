-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-09-2025 a las 16:20:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `app_escolar_node`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumno`
--

CREATE TABLE `alumno` (
  `id_alumno` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `apellido` char(250) DEFAULT NULL,
  `matricula` char(100) DEFAULT NULL,
  `sexo` char(20) DEFAULT NULL,
  `codigo_qr` varchar(100) NOT NULL,
  `sid_nivel` char(20) DEFAULT NULL,
  `sid_grado` char(20) DEFAULT NULL,
  `sid_grupo` char(20) DEFAULT NULL,
  `sid_padre` char(20) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL,
  `foto` char(255) DEFAULT NULL,
  `nombre_contacto` varchar(50) DEFAULT NULL,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `alergias` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivos_exportar`
--

CREATE TABLE `archivos_exportar` (
  `archivos_exportar_id` varchar(10) NOT NULL,
  `nombre_archivo` varchar(200) NOT NULL,
  `fecha_subida` date NOT NULL,
  `estado` varchar(30) NOT NULL,
  `modulo` varchar(70) NOT NULL,
  `usuario_sid` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo_adjunto`
--

CREATE TABLE `archivo_adjunto` (
  `id_archivo` char(20) DEFAULT NULL,
  `nombre_archivo` varchar(250) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `modulo` varchar(100) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo_mensaje`
--

CREATE TABLE `archivo_mensaje` (
  `id_archivo_mensaje` char(20) DEFAULT NULL,
  `sid_mensaje` char(20) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo_respuesta_tarea`
--

CREATE TABLE `archivo_respuesta_tarea` (
  `id_archivo_respuesta_tarea` varchar(10) NOT NULL,
  `archivo` varchar(200) NOT NULL,
  `sid_asignar_tarea` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivo_tarea`
--

CREATE TABLE `archivo_tarea` (
  `id_archivo_tarea` varchar(10) NOT NULL,
  `sid_tarea` varchar(10) NOT NULL,
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_atributo`
--

CREATE TABLE `asignar_atributo` (
  `id_asignar_atributo` char(20) DEFAULT NULL,
  `sid_atributo` char(20) DEFAULT NULL,
  `sid_seguimiento` varchar(20) DEFAULT NULL,
  `valor_atributo` varchar(150) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL,
  `sid_usuario` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_clase`
--

CREATE TABLE `asignar_clase` (
  `id_asignar_clase` char(20) DEFAULT NULL,
  `sid_materia` char(20) DEFAULT NULL,
  `sid_profesor` char(20) DEFAULT NULL,
  `sid_usuario` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_evento`
--

CREATE TABLE `asignar_evento` (
  `id_asignar_evento` varchar(20) NOT NULL,
  `sid_evento` varchar(20) NOT NULL,
  `sid_alumno` varchar(20) NOT NULL,
  `leido` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_materia`
--

CREATE TABLE `asignar_materia` (
  `id_asignar_materia` varchar(20) NOT NULL,
  `sid_profesor` varchar(20) NOT NULL,
  `sid_materia` varchar(20) NOT NULL,
  `sid_nivel` varchar(10) NOT NULL,
  `sid_grado` varchar(10) NOT NULL,
  `sid_grupo` varchar(20) NOT NULL,
  `sid_usuario` varchar(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_mensaje`
--

CREATE TABLE `asignar_mensaje` (
  `id_asignar_mensaje` varchar(20) NOT NULL,
  `sid_alumno` varchar(20) NOT NULL,
  `sid_mensaje` varchar(20) NOT NULL,
  `respuesta_rapida` varchar(20) DEFAULT NULL,
  `leido` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_tarea`
--

CREATE TABLE `asignar_tarea` (
  `id_asignar_tarea` varchar(20) NOT NULL,
  `sid_tarea` varchar(20) NOT NULL,
  `sid_alumno` varchar(20) NOT NULL,
  `estatus` varchar(30) NOT NULL,
  `observacion` varchar(200) DEFAULT NULL,
  `leido` varchar(10) DEFAULT 'no'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignar_tutor`
--

CREATE TABLE `asignar_tutor` (
  `id_asignar_tutor` char(20) DEFAULT NULL,
  `sid_padre` char(20) DEFAULT NULL,
  `sid_alumno` char(20) DEFAULT NULL,
  `sid_usuario` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` char(20) DEFAULT NULL,
  `sid_alumno` char(20) DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `leido` varchar(10) DEFAULT NULL,
  `sid_usuario` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `atributo`
--

CREATE TABLE `atributo` (
  `id_atributo` char(20) DEFAULT NULL,
  `icono` char(250) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `sid_instituto` varchar(20) DEFAULT NULL,
  `sid_usuario` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificaciones`
--

CREATE TABLE `calificaciones` (
  `id_calificaciones` varchar(10) NOT NULL,
  `sid_evaluacion` varchar(10) NOT NULL,
  `sid_materia` varchar(10) NOT NULL,
  `calificacion` varchar(10) NOT NULL,
  `periodo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciclo`
--

CREATE TABLE `ciclo` (
  `id_ciclo` char(20) DEFAULT NULL,
  `nombre` char(20) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL,
  `ciclo_cerrado` int(11) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciclo_grado`
--

CREATE TABLE `ciclo_grado` (
  `id_ciclo_grado` varchar(20) NOT NULL,
  `sid_ciclo` varchar(20) NOT NULL,
  `sid_grado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `destinatarios`
--

CREATE TABLE `destinatarios` (
  `id_destinatarios` varchar(10) NOT NULL,
  `sid_alumno` varchar(10) NOT NULL,
  `sid_mensaje` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dispositivos_padre`
--

CREATE TABLE `dispositivos_padre` (
  `id_dispositivos_padre` varchar(10) NOT NULL,
  `id_padre` varchar(10) NOT NULL,
  `token_dispositivo` varchar(250) NOT NULL,
  `badge_notificaciones` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escuelas_registradas`
--

CREATE TABLE `escuelas_registradas` (
  `escuelas_registradas_id` varchar(10) NOT NULL,
  `nombre_contacto` varchar(50) NOT NULL,
  `telefono_contacto` varchar(12) NOT NULL,
  `relacion_escuela` varchar(70) NOT NULL,
  `correo_contacto` varchar(100) NOT NULL,
  `nombre_clave` varchar(100) NOT NULL,
  `entidad` varchar(100) NOT NULL,
  `municipio` varchar(100) NOT NULL,
  `localidad` varchar(100) NOT NULL,
  `nivel_educativo` varchar(50) NOT NULL,
  `turno` varchar(50) NOT NULL,
  `sostenimiento` varchar(50) NOT NULL,
  `fecha_registro_contacto` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion`
--

CREATE TABLE `evaluacion` (
  `id_evaluacion` varchar(10) NOT NULL,
  `sid_alumno` varchar(10) NOT NULL,
  `promedio_general` varchar(10) NOT NULL,
  `promedio_final` varchar(10) NOT NULL,
  `ciclo` varchar(20) NOT NULL,
  `fecha_registro` date NOT NULL,
  `leido` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_evento` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time NOT NULL,
  `todos` tinyint(1) DEFAULT NULL,
  `nivel` char(20) DEFAULT NULL,
  `grado` char(20) DEFAULT NULL,
  `grupo` char(20) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `extracurricular`
--

CREATE TABLE `extracurricular` (
  `id_extracurricular` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `sid_instituto` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `id_grado` char(20) DEFAULT NULL,
  `sid_nivel` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `orden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `id_grupo` char(20) DEFAULT NULL,
  `sid_grado` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instituto`
--

CREATE TABLE `instituto` (
  `id_instituto` char(20) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `logo` char(100) DEFAULT NULL,
  `correo` char(100) DEFAULT NULL,
  `banco` char(100) DEFAULT NULL,
  `cuenta_banco` char(20) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio_licencia` date DEFAULT NULL,
  `fecha_limite` date DEFAULT NULL,
  `politicas` char(250) DEFAULT NULL,
  `nombre_beneficiario` char(100) DEFAULT NULL,
  `asistencia` tinyint(1) DEFAULT NULL,
  `pago` tinyint(1) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `sid_usuario` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materia`
--

CREATE TABLE `materia` (
  `id_materia` char(20) DEFAULT NULL,
  `sid_grado` char(20) DEFAULT NULL,
  `nombre` char(250) NOT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `id_mensaje` char(20) DEFAULT NULL,
  `receptor` varchar(50) DEFAULT NULL,
  `sid_usuario_emisor` varchar(5) NOT NULL,
  `sid_tipo` char(20) DEFAULT NULL,
  `sid_alumno` char(20) NOT NULL,
  `sid_nivel` char(20) NOT NULL,
  `sid_grado` char(20) NOT NULL,
  `sid_grupo` char(20) NOT NULL,
  `sid_extracurricular` char(20) NOT NULL,
  `destinatarios` varchar(100) DEFAULT NULL,
  `asunto` char(250) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `respuesta_rapida` varchar(5) DEFAULT NULL,
  `mensaje_programado` varchar(5) DEFAULT NULL,
  `fecha_envio` date DEFAULT NULL,
  `hora_envio` time DEFAULT NULL,
  `repetir` varchar(5) DEFAULT NULL,
  `periodo` char(50) DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `leido` varchar(10) NOT NULL,
  `eliminado` varchar(20) NOT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nivel`
--

CREATE TABLE `nivel` (
  `id_nivel` char(20) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL,
  `nombre` char(250) NOT NULL,
  `orden` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padre`
--

CREATE TABLE `padre` (
  `id_padre` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `apellido` char(250) DEFAULT NULL,
  `correo` char(250) DEFAULT NULL,
  `creacion` datetime DEFAULT NULL,
  `contrasena` varchar(250) DEFAULT NULL,
  `codigo_qr` varchar(200) NOT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id_pago` char(20) DEFAULT NULL,
  `sid_alumno` char(20) DEFAULT NULL,
  `modo` char(50) DEFAULT NULL,
  `concepto` char(100) DEFAULT NULL,
  `monto` decimal(10,0) DEFAULT NULL,
  `sid_penalidad` char(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `sid_usuario` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `penalidad`
--

CREATE TABLE `penalidad` (
  `id_penalidad` char(20) DEFAULT NULL,
  `porcentaje` int(11) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `privilegios`
--

CREATE TABLE `privilegios` (
  `privilegios_id` varchar(10) NOT NULL,
  `nombre_privilegio` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `privilegios_rol`
--

CREATE TABLE `privilegios_rol` (
  `privilegios_rol_id` varchar(10) NOT NULL,
  `sid_rol` varchar(10) NOT NULL,
  `sid_privilegios` varchar(10) NOT NULL,
  `activo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesor`
--

CREATE TABLE `profesor` (
  `id_profesor` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `apellido` char(250) DEFAULT NULL,
  `sid_instituto` char(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_mensajes`
--

CREATE TABLE `registro_mensajes` (
  `id_registro_mensajes` varchar(50) NOT NULL,
  `sid_mensaje` varchar(50) NOT NULL,
  `responsable` varchar(50) NOT NULL,
  `fecha_eliminacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` char(20) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL,
  `nombre` char(100) DEFAULT NULL,
  `fecha_registro` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `scanner`
--

CREATE TABLE `scanner` (
  `id_scanner` char(20) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `apellido` char(250) DEFAULT NULL,
  `correo` char(250) DEFAULT NULL,
  `usuario` char(100) DEFAULT NULL,
  `contrasena` char(250) DEFAULT NULL,
  `sid_instituto` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento`
--

CREATE TABLE `seguimiento` (
  `id_seguimiento` char(20) DEFAULT NULL,
  `sid_alumno` varchar(10) NOT NULL,
  `observacion` varchar(350) NOT NULL,
  `fecha_registro` date DEFAULT NULL,
  `leido` varchar(11) NOT NULL,
  `fecha_visto` date DEFAULT NULL,
  `responsable` varchar(40) NOT NULL,
  `fecha_eliminacion` date DEFAULT NULL,
  `eliminado` varchar(40) NOT NULL,
  `sid_usuario` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones_app`
--

CREATE TABLE `sesiones_app` (
  `sesiones_app` varchar(10) NOT NULL,
  `sid_padre` varchar(10) NOT NULL,
  `token_sesion` varchar(250) NOT NULL,
  `fecha_inicio` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id_tareas` char(20) DEFAULT NULL,
  `sid_grupo` varchar(20) DEFAULT NULL,
  `sid_materia` varchar(10) NOT NULL,
  `sid_instituto` char(20) DEFAULT NULL,
  `instrucciones_tarea` text NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_mensaje`
--

CREATE TABLE `tipo_mensaje` (
  `id_tipo_mensaje` char(20) DEFAULT NULL,
  `icono` char(250) DEFAULT NULL,
  `nombre` char(250) DEFAULT NULL,
  `sid_instituto` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `url_mensaje`
--

CREATE TABLE `url_mensaje` (
  `id_url` char(20) DEFAULT NULL,
  `sid_mensaje` char(20) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `url_tarea`
--

CREATE TABLE `url_tarea` (
  `id_url_tarea` varchar(10) NOT NULL,
  `sid_tarea` varchar(10) NOT NULL,
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` char(20) DEFAULT NULL,
  `nombre` char(100) DEFAULT NULL,
  `apellido` char(100) DEFAULT NULL,
  `correo` char(100) DEFAULT NULL,
  `sid_rol` char(20) DEFAULT NULL,
  `contrasena` char(250) DEFAULT NULL,
  `creacion` datetime NOT NULL,
  `modificacion` datetime NOT NULL,
  `sid_instituto` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_admin_estudiantes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_admin_estudiantes` (
`id_alumno` char(20)
,`sid_instituto` char(20)
,`nombre` char(250)
,`apellido` char(250)
,`matricula` char(100)
,`nombre_padre` char(250)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`nombre_instituto` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_admin_padres`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_admin_padres` (
`id_padre` char(20)
,`nombre` char(250)
,`apellido` char(250)
,`correo` char(250)
,`creacion` datetime
,`contrasena` varchar(250)
,`codigo_qr` varchar(200)
,`sid_instituto` char(20)
,`nombre_institucion` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_admin_usuarios`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_admin_usuarios` (
`nombre` char(100)
,`apellido` char(100)
,`id_usuario` char(20)
,`correo` char(100)
,`creacion` datetime
,`id_rol` char(20)
,`nombre_rol` char(100)
,`id_instituto` char(20)
,`nombre_instituto` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_asignacion_materias`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_asignacion_materias` (
`sid_instituto` char(20)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`nombre_materia` char(250)
,`nombre_profesor` char(100)
,`apellido_profesor` char(100)
,`fecha_creacion` datetime
,`id_asignar_materia` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_asistencia`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_asistencia` (
`id_asistencia` char(20)
,`sid_alumno` char(20)
,`fecha_ingreso` date
,`hora` time
,`tipo` varchar(100)
,`sid_usuario` char(20)
,`sid_instituto` char(20)
,`nombre_alumno` char(250)
,`apellido_alumno` char(250)
,`matricula` char(100)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`nombre_usuario` char(100)
,`apellido_usuario` char(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_calificaciones`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_calificaciones` (
`id_evaluacion` varchar(10)
,`sid_alumno` varchar(10)
,`promedio_general` varchar(10)
,`promedio_final` varchar(10)
,`ciclo` varchar(20)
,`fecha_registro` date
,`foto` char(255)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`sid_instituto` char(20)
,`nombre_alumno` char(250)
,`apellido_alumno` char(250)
,`id_alumno` char(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_cobranza`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_cobranza` (
`id_pago` char(20)
,`sid_alumno` char(20)
,`modo` char(50)
,`concepto` char(100)
,`monto` decimal(10,0)
,`sid_penalidad` char(20)
,`status` tinyint(1)
,`fecha_pago` date
,`sid_usuario` char(20)
,`sid_instituto` char(20)
,`matricula` char(100)
,`nombre_alumno` char(250)
,`apellido_alumno` char(250)
,`nombre_padre` char(250)
,`apellido_padre` char(250)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_grado`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_grado` (
`id_grado` char(20)
,`nombre_grado` char(250)
,`nombre_nivel` char(250)
,`sid_instituto` char(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_grado_grupo`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_grado_grupo` (
`id_grupo` char(20)
,`sid_grado` char(20)
,`nombre` char(250)
,`sid_instituto` char(20)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_historial_mensajes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_historial_mensajes` (
`receptor` varchar(50)
,`id_mensaje` char(20)
,`fecha_envio` date
,`nombre_instituto` varchar(100)
,`id_instituto` char(20)
,`nombre_alumno` char(250)
,`apellido_alumno` char(250)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`tipo_mensaje` char(250)
,`extracurricular` char(250)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_mensajes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_mensajes` (
`id_mensaje` char(20)
,`receptor` varchar(50)
,`destinatarios` varchar(100)
,`asunto` char(250)
,`fecha_envio` date
,`mensaje_programado` varchar(5)
,`eliminado` varchar(20)
,`instituto_id` char(20)
,`nombre_tipo` char(250)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_registro_mensajes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_registro_mensajes` (
`sid_instituto` char(20)
,`eliminado` varchar(20)
,`asunto` char(250)
,`id_mensaje` char(20)
,`fecha_envio` date
,`nombre_usuario` char(100)
,`apellido_usuario` char(100)
,`nombre_instituto` varchar(100)
,`nombre_alumno` char(250)
,`apellido_alumno` char(250)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`fecha_eliminacion` datetime
,`responsable` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_seguimientos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_seguimientos` (
`id_seguimiento` char(20)
,`fecha_registro` date
,`leido` varchar(11)
,`fecha_visto` date
,`fecha_eliminacion` date
,`eliminado` varchar(40)
,`sid_instituto` char(20)
,`nombre_alumno` char(250)
,`apellido_alumno` char(250)
,`nombre_usuario` char(100)
,`apellido_usuario` char(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_tareas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_tareas` (
`id_tareas` char(20)
,`sid_grupo` varchar(20)
,`sid_materia` varchar(10)
,`sid_instituto` char(20)
,`instrucciones_tarea` text
,`fecha_creacion` datetime
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`materia` char(250)
,`nombre_profesor` char(100)
,`apellido_profesor` char(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_tareas2`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_tareas2` (
`sid_grado` varchar(10)
,`sid_grupo` varchar(20)
,`sid_instituto` char(20)
,`nombre_profesor` char(100)
,`apellido_profesor` char(100)
,`materia` char(250)
,`nombre_nivel` char(250)
,`nombre_grado` char(250)
,`nombre_grupo` char(250)
,`id_tareas` char(20)
,`instrucciones_tarea` text
,`fecha_creacion` datetime
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_admin_estudiantes`
--
DROP TABLE IF EXISTS `vista_admin_estudiantes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_admin_estudiantes`  AS SELECT `a`.`id_alumno` AS `id_alumno`, `a`.`sid_instituto` AS `sid_instituto`, `a`.`nombre` AS `nombre`, `a`.`apellido` AS `apellido`, `a`.`matricula` AS `matricula`, `p`.`nombre` AS `nombre_padre`, `n`.`nombre` AS `nombre_nivel`, `g`.`nombre` AS `nombre_grado`, `gp`.`nombre` AS `nombre_grupo`, `i`.`nombre` AS `nombre_instituto` FROM (((((`alumno` `a` left join `nivel` `n` on(`a`.`sid_nivel` = `n`.`id_nivel`)) left join `instituto` `i` on(`a`.`sid_instituto` = `i`.`id_instituto`)) left join `padre` `p` on(`a`.`sid_padre` = `p`.`id_padre`)) left join `grupo` `gp` on(`a`.`sid_grupo` = `gp`.`id_grupo`)) left join `grado` `g` on(`a`.`sid_grado` = `g`.`id_grado`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_admin_padres`
--
DROP TABLE IF EXISTS `vista_admin_padres`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_admin_padres`  AS SELECT `p`.`id_padre` AS `id_padre`, `p`.`nombre` AS `nombre`, `p`.`apellido` AS `apellido`, `p`.`correo` AS `correo`, `p`.`creacion` AS `creacion`, `p`.`contrasena` AS `contrasena`, `p`.`codigo_qr` AS `codigo_qr`, `p`.`sid_instituto` AS `sid_instituto`, `i`.`nombre` AS `nombre_institucion` FROM (`padre` `p` left join `instituto` `i` on(`i`.`id_instituto` = `p`.`sid_instituto`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_admin_usuarios`
--
DROP TABLE IF EXISTS `vista_admin_usuarios`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_admin_usuarios`  AS SELECT `u`.`nombre` AS `nombre`, `u`.`apellido` AS `apellido`, `u`.`id_usuario` AS `id_usuario`, `u`.`correo` AS `correo`, `u`.`creacion` AS `creacion`, `r`.`id_rol` AS `id_rol`, `r`.`nombre` AS `nombre_rol`, `i`.`id_instituto` AS `id_instituto`, `i`.`nombre` AS `nombre_instituto` FROM ((`usuario` `u` left join `rol` `r` on(`u`.`sid_rol` = `r`.`id_rol`)) left join `instituto` `i` on(`u`.`sid_instituto` = `i`.`id_instituto`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_asignacion_materias`
--
DROP TABLE IF EXISTS `vista_asignacion_materias`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_asignacion_materias`  AS SELECT `m`.`sid_instituto` AS `sid_instituto`, `n`.`nombre` AS `nombre_nivel`, `gr`.`nombre` AS `nombre_grado`, `gp`.`nombre` AS `nombre_grupo`, `m`.`nombre` AS `nombre_materia`, `u`.`nombre` AS `nombre_profesor`, `u`.`apellido` AS `apellido_profesor`, `am`.`fecha_creacion` AS `fecha_creacion`, `am`.`id_asignar_materia` AS `id_asignar_materia` FROM (((((`asignar_materia` `am` left join `usuario` `u` on(`am`.`sid_profesor` = `u`.`id_usuario`)) left join `materia` `m` on(`am`.`sid_materia` = `m`.`id_materia`)) left join `grupo` `gp` on(`am`.`sid_grupo` = `gp`.`id_grupo`)) left join `grado` `gr` on(`gp`.`sid_grado` = `gr`.`id_grado`)) left join `nivel` `n` on(`gr`.`sid_nivel` = `n`.`id_nivel`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_asistencia`
--
DROP TABLE IF EXISTS `vista_asistencia`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_asistencia`  AS SELECT `a`.`id_asistencia` AS `id_asistencia`, `a`.`sid_alumno` AS `sid_alumno`, `a`.`fecha_ingreso` AS `fecha_ingreso`, `a`.`hora` AS `hora`, `a`.`tipo` AS `tipo`, `a`.`sid_usuario` AS `sid_usuario`, `al`.`sid_instituto` AS `sid_instituto`, `al`.`nombre` AS `nombre_alumno`, `al`.`apellido` AS `apellido_alumno`, `al`.`matricula` AS `matricula`, `n`.`nombre` AS `nombre_nivel`, `gr`.`nombre` AS `nombre_grado`, `gp`.`nombre` AS `nombre_grupo`, `u`.`nombre` AS `nombre_usuario`, `u`.`apellido` AS `apellido_usuario` FROM (((((`asistencia` `a` left join `alumno` `al` on(`a`.`sid_alumno` = `al`.`id_alumno`)) left join `nivel` `n` on(`al`.`sid_nivel` = `n`.`id_nivel`)) left join `grado` `gr` on(`al`.`sid_grado` = `gr`.`id_grado`)) left join `grupo` `gp` on(`al`.`sid_grupo` = `gp`.`id_grupo`)) left join `usuario` `u` on(`a`.`sid_usuario` = `u`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_calificaciones`
--
DROP TABLE IF EXISTS `vista_calificaciones`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_calificaciones`  AS SELECT `e`.`id_evaluacion` AS `id_evaluacion`, `e`.`sid_alumno` AS `sid_alumno`, `e`.`promedio_general` AS `promedio_general`, `e`.`promedio_final` AS `promedio_final`, `e`.`ciclo` AS `ciclo`, `e`.`fecha_registro` AS `fecha_registro`, `a`.`foto` AS `foto`, `n`.`nombre` AS `nombre_nivel`, `g`.`nombre` AS `nombre_grado`, `gr`.`nombre` AS `nombre_grupo`, `a`.`sid_instituto` AS `sid_instituto`, `a`.`nombre` AS `nombre_alumno`, `a`.`apellido` AS `apellido_alumno`, `a`.`id_alumno` AS `id_alumno` FROM ((((`evaluacion` `e` left join `alumno` `a` on(`a`.`id_alumno` = `e`.`sid_alumno`)) left join `nivel` `n` on(`n`.`id_nivel` = `a`.`sid_nivel`)) left join `grado` `g` on(`g`.`id_grado` = `a`.`sid_grado`)) left join `grupo` `gr` on(`gr`.`id_grupo` = `a`.`sid_grupo`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_cobranza`
--
DROP TABLE IF EXISTS `vista_cobranza`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_cobranza`  AS SELECT `p`.`id_pago` AS `id_pago`, `p`.`sid_alumno` AS `sid_alumno`, `p`.`modo` AS `modo`, `p`.`concepto` AS `concepto`, `p`.`monto` AS `monto`, `p`.`sid_penalidad` AS `sid_penalidad`, `p`.`status` AS `status`, `p`.`fecha_pago` AS `fecha_pago`, `p`.`sid_usuario` AS `sid_usuario`, `a`.`sid_instituto` AS `sid_instituto`, `a`.`matricula` AS `matricula`, `a`.`nombre` AS `nombre_alumno`, `a`.`apellido` AS `apellido_alumno`, `pd`.`nombre` AS `nombre_padre`, `pd`.`apellido` AS `apellido_padre` FROM ((`pago` `p` left join `alumno` `a` on(`p`.`sid_alumno` = `a`.`id_alumno`)) left join `padre` `pd` on(`pd`.`id_padre` = `a`.`sid_padre`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_grado`
--
DROP TABLE IF EXISTS `vista_grado`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_grado`  AS SELECT `grado`.`id_grado` AS `id_grado`, `grado`.`nombre` AS `nombre_grado`, `nivel`.`nombre` AS `nombre_nivel`, `nivel`.`sid_instituto` AS `sid_instituto` FROM (`grado` join `nivel` on(`grado`.`sid_nivel` = `nivel`.`id_nivel`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_grado_grupo`
--
DROP TABLE IF EXISTS `vista_grado_grupo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_grado_grupo`  AS SELECT `gp`.`id_grupo` AS `id_grupo`, `gp`.`sid_grado` AS `sid_grado`, `gp`.`nombre` AS `nombre`, `n`.`sid_instituto` AS `sid_instituto`, `n`.`nombre` AS `nombre_nivel`, `gd`.`nombre` AS `nombre_grado` FROM ((`grupo` `gp` left join `grado` `gd` on(`gp`.`sid_grado` = `gd`.`id_grado`)) left join `nivel` `n` on(`n`.`id_nivel` = `gd`.`sid_nivel`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_historial_mensajes`
--
DROP TABLE IF EXISTS `vista_historial_mensajes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_historial_mensajes`  AS SELECT `m`.`receptor` AS `receptor`, `m`.`id_mensaje` AS `id_mensaje`, `m`.`fecha_envio` AS `fecha_envio`, `i`.`nombre` AS `nombre_instituto`, `i`.`id_instituto` AS `id_instituto`, `a`.`nombre` AS `nombre_alumno`, `a`.`apellido` AS `apellido_alumno`, `n`.`nombre` AS `nombre_nivel`, `gd`.`nombre` AS `nombre_grado`, `gp`.`nombre` AS `nombre_grupo`, `tm`.`nombre` AS `tipo_mensaje`, `e`.`nombre` AS `extracurricular` FROM (((((((`mensaje` `m` left join `instituto` `i` on(`i`.`id_instituto` = `m`.`sid_instituto`)) left join `alumno` `a` on(`a`.`id_alumno` = `m`.`sid_alumno`)) left join `nivel` `n` on(`n`.`id_nivel` = `m`.`sid_nivel`)) left join `grado` `gd` on(`gd`.`id_grado` = `m`.`sid_grado`)) left join `grupo` `gp` on(`gp`.`id_grupo` = `m`.`sid_grupo`)) left join `tipo_mensaje` `tm` on(`m`.`sid_tipo` = `tm`.`id_tipo_mensaje`)) left join `extracurricular` `e` on(`m`.`sid_extracurricular` = `e`.`id_extracurricular`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_mensajes`
--
DROP TABLE IF EXISTS `vista_mensajes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_mensajes`  AS SELECT `m`.`id_mensaje` AS `id_mensaje`, `m`.`receptor` AS `receptor`, `m`.`destinatarios` AS `destinatarios`, `m`.`asunto` AS `asunto`, `m`.`fecha_envio` AS `fecha_envio`, `m`.`mensaje_programado` AS `mensaje_programado`, `m`.`eliminado` AS `eliminado`, `m`.`sid_instituto` AS `instituto_id`, `tm`.`nombre` AS `nombre_tipo` FROM (`mensaje` `m` left join `tipo_mensaje` `tm` on(`m`.`sid_tipo` = `tm`.`id_tipo_mensaje`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_registro_mensajes`
--
DROP TABLE IF EXISTS `vista_registro_mensajes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_registro_mensajes`  AS SELECT `m`.`sid_instituto` AS `sid_instituto`, `m`.`eliminado` AS `eliminado`, `m`.`asunto` AS `asunto`, `m`.`id_mensaje` AS `id_mensaje`, `m`.`fecha_envio` AS `fecha_envio`, `u`.`nombre` AS `nombre_usuario`, `u`.`apellido` AS `apellido_usuario`, `i`.`nombre` AS `nombre_instituto`, `a`.`nombre` AS `nombre_alumno`, `a`.`apellido` AS `apellido_alumno`, `n`.`nombre` AS `nombre_nivel`, `gd`.`nombre` AS `nombre_grado`, `gp`.`nombre` AS `nombre_grupo`, `rm`.`fecha_eliminacion` AS `fecha_eliminacion`, `rm`.`responsable` AS `responsable` FROM (((((((`mensaje` `m` left join `instituto` `i` on(`i`.`id_instituto` = `m`.`sid_instituto`)) left join `alumno` `a` on(`a`.`id_alumno` = `m`.`sid_alumno`)) left join `nivel` `n` on(`n`.`id_nivel` = `m`.`sid_nivel`)) left join `grado` `gd` on(`gd`.`id_grado` = `m`.`sid_grado`)) left join `grupo` `gp` on(`gp`.`id_grupo` = `m`.`sid_grupo`)) left join `usuario` `u` on(`u`.`id_usuario` = `m`.`sid_usuario_emisor`)) left join `registro_mensajes` `rm` on(`rm`.`sid_mensaje` = `m`.`id_mensaje`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_seguimientos`
--
DROP TABLE IF EXISTS `vista_seguimientos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_seguimientos`  AS SELECT `s`.`id_seguimiento` AS `id_seguimiento`, `s`.`fecha_registro` AS `fecha_registro`, `s`.`leido` AS `leido`, `s`.`fecha_visto` AS `fecha_visto`, `s`.`fecha_eliminacion` AS `fecha_eliminacion`, `s`.`eliminado` AS `eliminado`, `a`.`sid_instituto` AS `sid_instituto`, `a`.`nombre` AS `nombre_alumno`, `a`.`apellido` AS `apellido_alumno`, `u`.`nombre` AS `nombre_usuario`, `u`.`apellido` AS `apellido_usuario` FROM ((`seguimiento` `s` left join `alumno` `a` on(`s`.`sid_alumno` = `a`.`id_alumno`)) left join `usuario` `u` on(`s`.`responsable` = `u`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_tareas`
--
DROP TABLE IF EXISTS `vista_tareas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_tareas`  AS SELECT `t`.`id_tareas` AS `id_tareas`, `t`.`sid_grupo` AS `sid_grupo`, `t`.`sid_materia` AS `sid_materia`, `t`.`sid_instituto` AS `sid_instituto`, `t`.`instrucciones_tarea` AS `instrucciones_tarea`, `t`.`fecha_creacion` AS `fecha_creacion`, `n`.`nombre` AS `nombre_nivel`, `gd`.`nombre` AS `nombre_grado`, `gp`.`nombre` AS `nombre_grupo`, `m`.`nombre` AS `materia`, `u`.`nombre` AS `nombre_profesor`, `u`.`apellido` AS `apellido_profesor` FROM ((((((`tareas` `t` left join `materia` `m` on(`t`.`sid_materia` = `m`.`id_materia`)) left join `asignar_materia` `am` on(`m`.`id_materia` = `am`.`sid_materia` and `am`.`sid_grupo` in (select `gp`.`id_grupo` from `grupo` `gp` where `gp`.`id_grupo` = `t`.`sid_grupo`))) left join `nivel` `n` on(`am`.`sid_nivel` = `n`.`id_nivel`)) left join `grado` `gd` on(`am`.`sid_grado` = `gd`.`id_grado`)) left join `grupo` `gp` on(`am`.`sid_grupo` = `gp`.`id_grupo`)) left join `usuario` `u` on(`am`.`sid_profesor` = `u`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_tareas2`
--
DROP TABLE IF EXISTS `vista_tareas2`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_tareas2`  AS SELECT `am`.`sid_grado` AS `sid_grado`, `am`.`sid_grupo` AS `sid_grupo`, `t`.`sid_instituto` AS `sid_instituto`, `u`.`nombre` AS `nombre_profesor`, `u`.`apellido` AS `apellido_profesor`, `m`.`nombre` AS `materia`, `n`.`nombre` AS `nombre_nivel`, `g`.`nombre` AS `nombre_grado`, `gr`.`nombre` AS `nombre_grupo`, `t`.`id_tareas` AS `id_tareas`, `t`.`instrucciones_tarea` AS `instrucciones_tarea`, `t`.`fecha_creacion` AS `fecha_creacion` FROM ((((((`tareas` `t` join `asignar_materia` `am` on(`am`.`id_asignar_materia` = `t`.`sid_materia`)) left join `usuario` `u` on(`am`.`sid_profesor` = `u`.`id_usuario`)) left join `materia` `m` on(`am`.`sid_materia` = `m`.`id_materia`)) left join `nivel` `n` on(`am`.`sid_nivel` = `n`.`id_nivel`)) left join `grado` `g` on(`am`.`sid_grado` = `g`.`id_grado`)) left join `grupo` `gr` on(`am`.`sid_grupo` = `gr`.`id_grupo`)) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


CREATE TABLE `administrador` (
  `id_admin` varchar(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `contrasena` varchar(250) DEFAULT NULL,
  `privilegios` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

