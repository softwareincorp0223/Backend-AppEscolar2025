import { Op } from "sequelize";

import Alumno from "../models/alumno.js";
import AsignarTutor from "../models/asignar_tutor.js";
import DispositivosPadre from "../models/dispositivos_padre.js";
import NotificacionesEnvios from "../models/notificaciones_envios.js";
import { generadorID } from "../helpers/generadorID.js";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_TOKEN_PREFIXES = ["ExponentPushToken", "ExpoPushToken"];

const isExpoPushToken = (token) => {
  return (
    typeof token === "string" &&
    EXPO_TOKEN_PREFIXES.some((prefix) => token.startsWith(prefix)) &&
    token.includes("[") &&
    token.includes("]")
  );
};

const chunk = (items, size) => {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const buildNotification = ({ token, title, body, data, badge }) => ({
  to: token,
  sound: "default",
  title,
  body,
  badge,
  data: data || {},
});

const toPlain = (row) => (row?.toJSON ? row.toJSON() : row);

const uniqueDispositivos = (dispositivos = []) => {
  const seen = new Set();

  return dispositivos
    .map(toPlain)
    .filter((dispositivo) => {
      const key = `${dispositivo?.id_padre || ""}|${
        dispositivo?.token_dispositivo || ""
      }`;

      if (!dispositivo?.id_padre || !dispositivo?.token_dispositivo || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
};

const getErrorText = (errors = []) => {
  if (!errors.length) return null;

  try {
    return JSON.stringify(errors).slice(0, 2000);
  } catch {
    return "Error enviando push";
  }
};

const logNotificationEnvios = async ({
  dispositivos = [],
  tipoModulo,
  sidReferencia,
  fechaProgramada,
  fechaEnviada,
  estatus,
  error,
}) => {
  if (!tipoModulo || !sidReferencia || !dispositivos.length) return;

  const now = new Date();
  const registros = dispositivos.map((dispositivo) => ({
    id_envio: generadorID(20),
    tipo_modulo: tipoModulo,
    sid_referencia: sidReferencia,
    id_padre: dispositivo.id_padre,
    token_dispositivo: dispositivo.token_dispositivo,
    fecha_programada: fechaProgramada || now,
    fecha_enviada: fechaEnviada || null,
    estatus,
    error,
    created_at: now,
    updated_at: now,
  }));

  try {
    await NotificacionesEnvios.bulkCreate(registros);
  } catch (logError) {
    console.error("[push log notificaciones_envios]", logError);
  }
};

export const getDispositivosByPadres = async (idPadres = []) => {
  const parentIds = [...new Set(idPadres.filter(Boolean))];
  if (!parentIds.length) return [];

  return DispositivosPadre.findAll({
    where: {
      id_padre: {
        [Op.in]: parentIds,
      },
    },
  });
};

export const getPadresByAlumnos = async (sidAlumnos = []) => {
  const alumnoIds = [...new Set(sidAlumnos.filter(Boolean))];
  if (!alumnoIds.length) return [];

  const [alumnos, tutores] = await Promise.all([
    Alumno.findAll({
      where: {
        id_alumno: {
          [Op.in]: alumnoIds,
        },
      },
      attributes: ["sid_padre"],
    }),
    AsignarTutor.findAll({
      where: {
        sid_alumno: {
          [Op.in]: alumnoIds,
        },
      },
      attributes: ["sid_padre"],
    }),
  ]);

  return [
    ...new Set([
      ...alumnos.map((alumno) => alumno.sid_padre),
      ...tutores.map((tutor) => tutor.sid_padre),
    ]),
  ].filter(Boolean);
};

export const sendExpoPushNotifications = async ({
  tokens = [],
  title,
  body,
  data = {},
  badge,
}) => {
  const validTokens = [...new Set(tokens)].filter(isExpoPushToken);

  if (!validTokens.length) {
    return { sent: 0, tickets: [], errors: [] };
  }

  const messages = validTokens.map((token) =>
    buildNotification({ token, title, body, data, badge })
  );
  const tickets = [];
  const errors = [];

  for (const messagesChunk of chunk(messages, 100)) {
    try {
      const response = await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagesChunk),
      });

      const result = await response.json();

      if (!response.ok) {
        errors.push(result);
      } else {
        tickets.push(result);
      }
    } catch (error) {
      errors.push({
        message: error instanceof Error ? error.message : "Error enviando push",
      });
    }
  }

  return {
    sent: validTokens.length,
    tickets,
    errors,
  };
};

export const sendPushToPadres = async ({
  idPadres = [],
  title,
  body,
  data = {},
  badge,
  tipoModulo,
  sidReferencia,
  fechaProgramada,
}) => {
  const dispositivos = await getDispositivosByPadres(idPadres);

  return sendPushToDispositivos({
    dispositivos,
    title,
    body,
    data,
    badge,
    tipoModulo,
    sidReferencia,
    fechaProgramada,
  });
};

export const sendPushToAlumnos = async ({
  sidAlumnos = [],
  title,
  body,
  data = {},
  badge,
  tipoModulo,
  sidReferencia,
  fechaProgramada,
}) => {
  const idPadres = await getPadresByAlumnos(sidAlumnos);

  return sendPushToPadres({
    idPadres,
    title,
    body,
    data,
    badge,
    tipoModulo,
    sidReferencia,
    fechaProgramada,
  });
};

export const sendPushToDispositivos = async ({
  dispositivos = [],
  title,
  body,
  data = {},
  badge,
  tipoModulo,
  sidReferencia,
  fechaProgramada,
}) => {
  const dispositivosUnicos = uniqueDispositivos(dispositivos);
  const dispositivosConTokenValido = dispositivosUnicos.filter((dispositivo) =>
    isExpoPushToken(dispositivo.token_dispositivo)
  );
  const tokens = dispositivosConTokenValido.map(
    (dispositivo) => dispositivo.token_dispositivo
  );

  const result = await sendExpoPushNotifications({
    tokens,
    title,
    body,
    data,
    badge,
  });

  const fechaEnviada = new Date();
  const errorText = getErrorText(result.errors);

  await logNotificationEnvios({
    dispositivos: dispositivosConTokenValido,
    tipoModulo,
    sidReferencia,
    fechaProgramada,
    fechaEnviada,
    estatus: errorText ? "error" : "enviado",
    error: errorText,
  });

  return {
    ...result,
    dispositivos: dispositivosUnicos.length,
    tokens: tokens.length,
  };
};
