import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import PdfPrinterModule from "pdfmake/js/Printer.js";
import URLResolverModule from "pdfmake/js/URLResolver.js";

import Alumno from "../models/alumno.js";
import Calificaciones from "../models/calificaciones.js";
import Evaluacion from "../models/evaluacion.js";
import Grado from "../models/grado.js";
import Grupo from "../models/grupo.js";
import Instituto from "../models/instituto.js";
import Materia from "../models/materia.js";
import Nivel from "../models/nivel.js";

const PdfPrinter = PdfPrinterModule.default || PdfPrinterModule;
const URLResolver = URLResolverModule.default || URLResolverModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const logoPath = path.join(backendRoot, "assets", "logo_fondo.png");

const fontsBasePath = path.resolve(backendRoot, "node_modules", "pdfmake", "fonts", "Roboto");
const printer = new PdfPrinter({
  Roboto: {
    normal: path.join(fontsBasePath, "Roboto-Regular.ttf"),
    bold: path.join(fontsBasePath, "Roboto-Medium.ttf"),
    italics: path.join(fontsBasePath, "Roboto-Italic.ttf"),
    bolditalics: path.join(fontsBasePath, "Roboto-MediumItalic.ttf"),
  },
}, undefined, new URLResolver());

const toPlain = (row) => (row?.toJSON ? row.toJSON() : row);

const formatFechaEmision = () => {
  const hoy = new Date();
  return `${hoy.getDate()}/${hoy.getMonth() + 1}/${hoy.getFullYear()}`;
};

const getLogoBase64 = () => {
  if (!fs.existsSync(logoPath)) return null;

  const logo = fs.readFileSync(logoPath).toString("base64");
  return `data:image/png;base64,${logo}`;
};

const safeFilename = (value) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "boleta";

const buildCalificacionesBody = (evaluaciones) => {
  const body = [
    [
      { text: "MATERIA", style: "tableHeader" },
      { text: "PERIODO", style: "tableHeader" },
      { text: "CALIFICACION", style: "tableHeader" },
      { text: "CICLO", style: "tableHeader" },
    ],
  ];

  evaluaciones.forEach((evaluacion) => {
    const calificaciones = evaluacion.Calificaciones || [];

    calificaciones.forEach((calificacion) => {
      body.push([
        { text: calificacion.Materia?.nombre || "", alignment: "left" },
        { text: `Periodo ${calificacion.periodo || ""}`, alignment: "center" },
        { text: calificacion.calificacion || "", alignment: "center", bold: true },
        { text: evaluacion.ciclo || "", alignment: "center" },
      ]);
    });
  });

  return body;
};

const buildBoletaDefinition = (alumno, evaluaciones) => {
  const logoBase64 = getLogoBase64();
  const fecha = formatFechaEmision();
  const ultimaEvaluacion = evaluaciones[evaluaciones.length - 1] || {};
  const headerColumns = [];

  if (logoBase64) {
    headerColumns.push({ image: logoBase64, width: 70 });
  }

  headerColumns.push({
    width: "*",
    stack: [
      { text: "SECRETARIA DE EDUCACION", style: "titulo" },
      { text: `${alumno.Instituto?.nombre || ""}`, style: "subtitulo" },
      { text: "BOLETA DE CALIFICACIONES", style: "boleta" },
    ],
    alignment: "center",
    margin: [0, 10, 0, 0],
  });

  return {
    pageSize: "LETTER",
    pageMargins: [40, 120, 40, 80],
    ...(logoBase64
      ? {
          background: [
            {
              image: logoBase64,
              width: 300,
              opacity: 0.05,
              absolutePosition: { x: 150, y: 250 },
            },
          ],
        }
      : {}),
    header: {
      margin: [40, 20, 40, 0],
      columns: headerColumns,
    },
    footer: (currentPage, pageCount) => ({
      margin: [40, 10],
      columns: [
        { text: `Fecha de emision: ${fecha}`, fontSize: 9 },
        {
          text: `Pagina ${currentPage} de ${pageCount}`,
          alignment: "right",
          fontSize: 9,
        },
      ],
    }),
    content: [
      { text: "DATOS DEL ALUMNO", style: "sectionTitle" },
      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          body: [
            [
              { text: "Alumno", style: "infoLabel" },
              { text: `${alumno.nombre || ""} ${alumno.apellido || ""}`.trim(), style: "infoValue" },
              { text: "Matricula", style: "infoLabel" },
              { text: alumno.matricula || "", style: "infoValue" },
            ],
            [
              { text: "Nivel", style: "infoLabel" },
              { text: alumno.Nivel?.nombre || "", style: "infoValue" },
              { text: "Grado / Grupo", style: "infoLabel" },
              {
                text: `${alumno.Grado?.nombre || ""} - ${alumno.Grupo?.nombre || ""}`,
                style: "infoValue",
              },
            ],
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f5f5f5" : null),
        },
        margin: [0, 10, 0, 25],
      },
      { text: "CALIFICACIONES", style: "sectionTitle" },
      {
        table: {
          headerRows: 1,
          widths: ["40%", "20%", "20%", "20%"],
          body: buildCalificacionesBody(evaluaciones),
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex === 0 ? "#004280" : null),
          hLineColor: () => "#cccccc",
          vLineColor: () => "#cccccc",
        },
        margin: [0, 10, 0, 30],
      },
      {
        table: {
          widths: ["70%", "30%"],
          body: [
            [
              { text: "PROMEDIO FINAL GENERAL", style: "promedioTitulo" },
              { text: ultimaEvaluacion.promedio_final || "", style: "promedioValor" },
            ],
          ],
        },
        layout: { fillColor: () => "#e8f0ff" },
        margin: [0, 10, 0, 50],
      },
      {
        margin: [0, 60, 0, 0],
        columns: [
          {
            width: "50%",
            alignment: "center",
            stack: [
              {
                canvas: [
                  { type: "line", x1: 40, y1: 0, x2: 180, y2: 0, lineWidth: 1 },
                ],
              },
              { text: "Firma del Director", alignment: "center", margin: [0, 8, 0, 0], bold: true },
            ],
          },
          {
            width: "50%",
            alignment: "center",
            stack: [
              {
                canvas: [
                  { type: "line", x1: 40, y1: 0, x2: 180, y2: 0, lineWidth: 1 },
                ],
              },
              { text: "Firma del Tutor", alignment: "center", margin: [0, 8, 0, 0], bold: true },
            ],
          },
        ],
      },
    ],
    styles: {
      titulo: { fontSize: 16, bold: true, color: "#004280" },
      subtitulo: { fontSize: 12, margin: [0, 2, 0, 0] },
      boleta: { fontSize: 15, bold: true, color: "#007a4d", margin: [0, 5, 0, 0] },
      sectionTitle: { fontSize: 13, bold: true, color: "#004280", margin: [0, 10, 0, 5] },
      tableHeader: { color: "white", bold: true, alignment: "center", margin: [0, 5, 0, 5] },
      infoLabel: { bold: true, fontSize: 10 },
      infoValue: { fontSize: 10 },
      promedioTitulo: { bold: true, fontSize: 13, color: "#004280" },
      promedioValor: { bold: true, fontSize: 18, alignment: "center", color: "#007a4d" },
    },
  };
};

export const descargarBoletaCalificacionesMobile = async (req, res) => {
  try {
    const { idAlumno } = req.params;
    const { ciclo } = req.query;

    const alumnoRow = await Alumno.findOne({
      where: { id_alumno: idAlumno },
      attributes: ["id_alumno", "nombre", "apellido", "matricula"],
      include: [
        { model: Instituto, attributes: ["nombre", "logo"], required: false },
        {
          model: Evaluacion,
          attributes: ["id_evaluacion", "promedio_general", "promedio_final", "ciclo", "fecha_registro"],
          required: true,
          where: ciclo ? { ciclo } : undefined,
          include: [
            {
              model: Calificaciones,
              required: true,
              include: [{ model: Materia, as: "Materia", required: true }],
            },
          ],
        },
        { model: Nivel, attributes: ["nombre"], required: false },
        { model: Grado, attributes: ["nombre"], required: false },
        { model: Grupo, attributes: ["nombre"], required: false },
      ],
      order: [
        [Evaluacion, Calificaciones, { model: Materia, as: "Materia" }, "nombre", "ASC"],
        [Evaluacion, Calificaciones, "periodo", "ASC"],
      ],
    });

    if (!alumnoRow) {
      return res.status(404).json({
        status: "error",
        msg: "No se encontraron calificaciones para generar la boleta",
      });
    }

    const alumno = toPlain(alumnoRow);
    const evaluaciones = alumno.Evaluacions || [];

    if (!evaluaciones.length) {
      return res.status(404).json({
        status: "error",
        msg: "No hay evaluaciones disponibles para este alumno",
      });
    }

    const docDefinition = buildBoletaDefinition(alumno, evaluaciones);
    const pdfDoc = await printer.createPdfKitDocument(docDefinition);
    const filename = `${safeFilename(`Calificaciones_${alumno.matricula || alumno.id_alumno}`)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("[mobile descargarBoletaCalificacionesMobile]", error);

    return res.status(500).json({
      status: "error",
      msg: "No fue posible generar la boleta de calificaciones",
    });
  }
};

