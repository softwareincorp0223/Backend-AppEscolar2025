import { Op } from "sequelize";
/**
 * Generic CRUD controller factory
 * Uso:
 *   import createCRUD from "./core/genericController.js";
 *   const { getAll, getById, createOne, updateOne, deleteOne } = createCRUD(Model, 'mi_pk');
 *
 * - Model: modelo Sequelize
 * - pkField: nombre del campo PK (ej. 'id_alumno', 'id', 'id_admin'...)
 *
 * Este factory centraliza el comportamiento CRUD. Los controladores específicos
 * pueden envolver createOne/updateOne para añadir validación (Joi), hashing, etc.
 */

export default function createCRUD(Model, pkField = "id") {
  return {
    // Listar todos

    /*getAll: async (req, res) => {
      try {
        const items = await Model.findAll();
        return res.json(items);
      } catch (err) {
        console.error("[getAll]", err);
        return res.status(500).json({ error: "Server error" });
      }
    },*/

    /*
      ===============================================================
      Método: getAll
      Descripción:
        Lista todos los registros del modelo. Permite aplicar filtros dinámicos,
        realizar joins (usando "include"), ordenar resultados y aplicar paginación.

      Modos de uso:
      
      🔹 Filtro por un solo campo:
         GET /api/usuario?sid_instituto=INST001

      🔹 Filtro por varios campos:
         GET /api/usuario?sid_instituto=INST001&sid_rol=ADMIN

      🔹 Joins con otras tablas (LEFT JOIN):
         GET /api/usuario?include=Rol,Instituto

      🔹 Orden y dirección:
         GET /api/usuario?order=nombre&direction=DESC

      🔹 Paginación:
         GET /api/usuario?limit=10&offset=20

      🔹 Filtros complejos (JSON):
         GET /api/usuario?where={"sid_instituto":"INST001","nombre":{"$like":"%Juan%"}}

      ===============================================================
    */
    getAll: async (req, res) => {
      try {
        const { where: rawWhere, include: rawInclude } = req.query;

        // 1) Construcción básica de filtros desde querystring (campos simples)
        const where = {};
        for (const key in req.query) {
          if (["include", "limit", "offset", "page", "order", "direction", "where"].includes(key)) continue;
          if (req.query[key]) where[key] = req.query[key];
        }

        function safeDecodeURIComponent(str) {
          try {
            return decodeURIComponent(str);
          } catch {
            return str; // si ya estaba decodificada, la regresamos igual
          }
        }

        // 2) Si llega rawWhere (JSON), parsearlo y mapear operadores tipo $like -> Op.like
        if (rawWhere) {
          let parsed;

          try {
            let decoded = safeDecodeURIComponent(rawWhere);

            // Si aún hay %22, reemplazamos manualmente por comillas dobles
            if (decoded.includes("%22")) {
              decoded = decoded
                .replace(/%22/g, '"')
                .replace(/%7B/g, '{')
                .replace(/%7D/g, '}')
                .replace(/%24/g, '$')
                .replace(/%3A/g, ':')
                .replace(/%2C/g, ',')
                .replace(/%5B/g, '[')
                .replace(/%5D/g, ']')
                .replace(/%25/g, '%');
            }

            // También quitamos %25 que a veces aparece como parte de "%"
            decoded = decoded.replace(/%25/g, "%");

            console.log("Decoded (fixed):", decoded);

            parsed = JSON.parse(decoded);
            console.log("Parsed where:", parsed);
          } catch (err) {
            console.error("Error al parsear 'where':", err.message);
            return res.status(400).json({ error: "Invalid JSON in 'where' parameter" });
          }

          // Función recursiva que transforma keys $... a { [Op.xxx]: value }
          const mapOperators = (obj) => {
            if (obj === null || typeof obj !== "object") return obj;

            // Si es array, procesar cada elemento
            if (Array.isArray(obj)) {
              return obj.map(item => mapOperators(item));
            }
            const resObj = {};
            for (const k of Object.keys(obj)) {
              const v = obj[k];

              // si la clave empieza con $ interpretarla como operador
              if (k.startsWith("$")) {
                const opName = k.slice(1); // ejemplo: "like"
                // mapear nombres comunes a Op
                const opMap = {
                  like: Op.like,
                  iLike: Op.iLike,
                  ilike: Op.iLike,
                  gt: Op.gt,
                  gte: Op.gte,
                  lt: Op.lt,
                  lte: Op.lte,
                  ne: Op.ne,
                  in: Op.in,
                  notIn: Op.notIn,
                  or: Op.or,
                  and: Op.and,
                  between: Op.between,
                  notBetween: Op.notBetween,
                  substring: Op.substring,
                  startsWith: Op.startsWith,
                  endsWith: Op.endsWith,
                  regexp: Op.regexp
                  // agrega más según necesites
                };

                const mappedOp = opMap[opName];
                if (!mappedOp) {
                  // si no está en el map, intenta usar Op[opName] dinámicamente
                  if (Op[opName]) {
                    resObj[Op[opName]] = mapOperators(v);
                  } else {
                    // operador desconocido: incluir tal cual (o rechazar)
                    resObj[k] = mapOperators(v);
                  }
                } else {
                  resObj[mappedOp] = mapOperators(v);
                }
              } else {
                // clave normal: puede contener sub-objetos con operadores internos
                resObj[k] = mapOperators(v);
              }
            }
            return resObj;
          };

          const mapped = mapOperators(parsed);
          Object.assign(where, mapped);
        }

        // 3) Includes dinámicos (joins)
        // let include = [];
        // if (rawInclude) {
        //   const models = rawInclude.split(",").map(m => m.trim());

        //   for (const modelName of models) {
        //     const RelatedModel = Model.sequelize.models[modelName];

        //     if (RelatedModel) {
        //       let includeItem = { model: RelatedModel };

        //       // Si en el WHERE hay filtros para el modelo incluido
        //       if (where[modelName]) {
        //         includeItem.where = where[modelName];   // ejemplo: { sid_instituto: "7rclr" }
        //         includeItem.required = true; // INNER JOIN
        //         delete where[modelName];     // lo quitamos del where principal
        //       }

        //       include.push(includeItem);
        //     }
        //   }
        // }

        // 3) Includes dinámicos con soporte para includes anidados
        // let include = [];

        // if (rawInclude) {
        //   const models = rawInclude.split(",").map(m => m.trim());

        //   for (const modelName of models) {
        //     const RelatedModel = Model.sequelize.models[modelName];

        //     if (!RelatedModel) continue;

        //     // Si el modelo está asociado directamente → include directo
        //     if (Model.associations[modelName]) {
        //       let includeItem = { model: RelatedModel };

        //       if (where[modelName]) {
        //         includeItem.where = where[modelName];
        //         includeItem.required = true;
        //         delete where[modelName];
        //       }

        //       include.push(includeItem);
        //       continue;
        //     }

        //     // Si NO está asociado directamente → buscar una relación intermedia
        //     for (const assocName in Model.associations) {
        //       const AssocModel = Model.associations[assocName].target;

        //       // ¿El modelo intermedio tiene al modelo solicitado?
        //       if (AssocModel.associations && AssocModel.associations[modelName]) {
        //         let nestedInclude = {
        //           model: AssocModel,
        //           required: true,
        //           include: [
        //             {
        //               model: RelatedModel,
        //               required: true,
        //             }
        //           ]
        //         };

        //         // si en where hay filtros para el modelo solicitado (nivel)
        //         if (where[modelName]) {
        //           nestedInclude.include[0].where = where[modelName];
        //           delete where[modelName];
        //         }

        //         include.push(nestedInclude);
        //       }
        //     }
        //   }
        // }

        let include = [];

        if (rawInclude) {
          const models = rawInclude.split(",").map(m => m.trim());
          const sequelizeModels = Model.sequelize.models;

          for (const modelName of models) {
            const RelatedModel = sequelizeModels[modelName];
            if (!RelatedModel) continue;

            const directAssoc = Model.associations[modelName];

            // -----------------------------------
            // 🔹 1. Relación directa
            // -----------------------------------
            if (directAssoc) {
              let includeItem = { model: RelatedModel };

              if (where[modelName]) {
                includeItem.where = where[modelName];
                includeItem.required = true;
                delete where[modelName];
              }

              include.push(includeItem);
              continue;
            }

            // -----------------------------------
            // 🔹 2. Relación NO directa → buscar intermediario
            // -----------------------------------
            for (const assocName in Model.associations) {
              const AssocModel = Model.associations[assocName].target;

              // El modelo intermedio debe tener la relación al modelo solicitado
              if (AssocModel.associations?.[modelName]) {
                let nestedInclude = {
                  model: AssocModel,
                  required: true,
                  include: [
                    {
                      model: RelatedModel,
                      required: true,
                      ...(where[modelName] && { where: where[modelName] })
                    }
                  ]
                };

                if (where[modelName]) {
                  delete where[modelName];
                }

                include.push(nestedInclude);
              }
            }
          }
        }


        // 4) Paginación y orden
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
        const order = req.query.order ? [[req.query.order, req.query.direction || "ASC"]] : undefined;

        // 5) Ejecutar la consulta
        const items = await Model.findAll({
          where,
          include,
          limit,
          offset,
          order
        });

        return res.json(items);
      } catch (err) {
        console.error("[getAll]", err);
        return res.status(500).json({ error: "Server error" });
      }
    },



    /*
    getAll: async (req, res) => {
      try {
        const items = await Model.findAll();
        return res.json(items);
      } catch (err) {
        console.error("[getAll]", err);
        return res.status(500).json({ error: "Server error" });
      }
    },
    */

    // Obtener por PK
    getById: async (req, res) => {
      try {
        const id = req.params.id;
        const item = await Model.findByPk(id);
        if (!item) return res.status(404).json({ error: "Not found" });
        return res.json(item);
      } catch (err) {
        console.error("[getById]", err);
        return res.status(500).json({ error: "Server error" });
      }
    },

    // Crear (req.body debe estar validado si aplicas Joi antes)
    createOne: async (req, res) => {
      console.log(req.body);

      try {
        // Insertar en la base de datos
        const created = await Model.create(req.body);

        return res.status(201).json(created);
      } catch (err) {
        console.error("[createOne]", err);
        return res.status(500).json({
          error: "Server error",
          details: err.message,
        });
      }
    },

    // Actualizar por PK (req.body validado si corresponde)
    updateOne: async (req, res) => {
      try {
        const id = req.params.id;
        const item = await Model.findByPk(id);
        if (!item) return res.status(404).json({ error: "Not found" });
        await item.update(req.body);
        return res.json(item);
      } catch (err) {
        console.error("[updateOne]", err);
        return res.status(500).json({ error: "Server error", details: err.message });
      }
    },

    // Eliminar por PK
    /*deleteOne: async (req, res) => {
      try {
        const id = req.params.id;
        const item = await Model.findByPk(id);
        if (!item) return res.status(404).json({ error: "Not found" });
        await item.destroy();
        return res.json({ message: "Deleted" });
      } catch (err) {
        console.error("[deleteOne]", err);
        return res.status(500).json({ error: "Server error" });
      }
    }*/

    deleteOne: async (req, res) => {
      try {
        // Puede venir por params (/api/padres/5) o por body ({ ids: [1,2,3] })
        const id = req.params.id;
        const ids = req.body.ids;
        const idField = req.body.idField;

        //Caso 1: eliminar varios (si hay un array)
        if (Array.isArray(ids) && ids.length > 0) {
          const deleted = await Model.destroy({
            where: { [idField]: ids },
          });
          return res.json({
            message: `Eliminados ${deleted} registros`,
          });
        }

        //Caso 2: eliminar uno solo (por id en params)
        if (id) {
          const item = await Model.findByPk(id);
          if (!item) return res.status(404).json({ error: "No encontrado" });
          await item.destroy();
          return res.json({ message: "Eliminado correctamente" });
        }

        return res.status(400).json({ error: "Faltan parámetros (id o ids[])" });
      } catch (err) {
        console.error("[delete]", err);
        return res.status(500).json({ error: "Error del servidor" });
      }
    }

  };
}
