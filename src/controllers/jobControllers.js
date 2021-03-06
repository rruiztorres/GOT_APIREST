const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const check = { check: true };
const token = jwt.sign(check, `${process.env.JWTKEY}`, {expiresIn: 1440});

const database = new Pool( {
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  port: `${process.env.DB_PORT}`
});

//Transformer
const transformer = require("../dist/transformer");

//Logger
const newEntryLog = require("../dist/newEntryLog");

//Formateo Geometrias GEOJSON to String
const stringifyJobGeometry = require("../dist/stringifyJobGeometry");

//=============================================METODOS==================================================//

const deleteJobs = async (req, res) => {
  const jobs = req.body;
  let ejecucion = 0;
  try {
    for (this.index in jobs) {
      //BORRAR TABLA TIEMPOS ERRORES
      ///obtener id_error que pertenecen al job actual
      const borrar = await database.query(
        "SELECT id_error FROM got.errores WHERE id_job = $1",
        [jobs[this.index].id_job]
      );
      const erroresBorrar = borrar.rows;

      ///borrado de tabla de tiempos errores
      for (this.longErroresBorrar in erroresBorrar) {
        await database.query("DELETE FROM got.t_errores WHERE id_error = $1", [
          erroresBorrar[this.longErroresBorrar].id_error,
        ]);
      }

      //BORRAR TABLA TIEMPOS JOBS
      try {
        await database.query("DELETE FROM got.t_jobs WHERE id_job = $1", [
          jobs[this.index].id_job,
        ]);
      } catch (t_jobs) {
        if (t_jobs != undefined) {
          ejecucion = 1;
        }
        console.error("fallo en borrar tiempos jobs");
      }

      //BORRAR ENTRADAS DE LOG
      try {
        await database.query("DELETE FROM got.logs WHERE id_job = $1", [
          jobs[this.index].id_job,
        ]);
      } catch (entry_log) {
        if (entry_log != undefined) {
          ejecucion = 1;
        }
        console.error("fallo en borrar entradas log");
      }

      //BORRAR ERRORES
      try {
        await database.query("DELETE FROM got.errores WHERE id_job = $1", [
          jobs[this.index].id_job,
        ]);
      } catch (delete_errores) {
        if (delete_errores != undefined) {
          ejecucion = 1;
        }
        console.error("fallo en borrar errores");
      }

      //BORRAR JOB
      try {
        await database.query("DELETE FROM got.jobs WHERE id_job = $1", [
          jobs[this.index].id_job,
        ]);
      } catch (delete_jobs) {
        if (delete_jobs != undefined) {
          ejecucion = 1;
        }
        console.error("fallo en borrar jobs");
      }
    }
  } catch (error) {
    console.error("deleteJobs ->", error);
  }

  //ENVIAR RESPUESTAS
  if (ejecucion == 0) {
    res.status(201);
    res.json({
      mensaje: "Jobs y errores asociados eliminados correctamente",
    });
  } else {
    res.status(203).json({
      mensaje: "Error inesperado, por favor compruebe los datos",
    });
  }
};

const getJobExtent = async (req, res) => {
  try {
    const job = req.params.job;
    const dataExtent = await database.query(
      "SELECT ST_AsText(ST_Envelope(geometria)) FROM got.v_jobs WHERE job = $1",
      [job]
    );
    const dataCentroid = await database.query(
      "SELECT ST_AsText(ST_Centroid(geometria)) FROM got.v_jobs WHERE job = $1",
      [job]
    );

    if (dataExtent.rows.length > 0 && dataCentroid.rows.length > 0) {
      const extent = dataExtent.rows[0].st_astext;
      const centroid = dataCentroid.rows[0].st_astext;

      res.status(201).json({extent, centroid,});
    } else {
      res.status(203).json({mensaje: 'Error inesperado'})
    }
  } catch (error) {
    res.status(500);
    console.error("get job extent error ->", error);
  }
};

const getJobs = async (req, res) => {
  try {
    const response = await database.query(
      `SELECT 
        id_job, 
        expediente, 
        job, 
        descripcion, 
        gravedad_job, 
        deteccion_job, 
        arreglo_job, 
        estado, 
        tipo_bandeja, 
        asignacion_job, 
        nombre_operador, 
        ST_AsGeoJSON(geometria) as geometria, 
        job_grande, 
        alarma 
      FROM 
        got.v_jobs 
      ORDER BY 
        id_job`
    );
    if (response.rowCount !== 0) {
      for (index in response.rows) {
        let resume = response.rows[index].descripcion;
        let bloqueado = false;
        if (typeof resume == "string") {
          resume = resume.slice(0, 40) + "...";
          response.rows[index].resumen = resume;
        }
        if (bloqueado == false) {
          response.rows[index].bloqueado = bloqueado;
        }
      }

      //FORMATEO GEOJSON STRING TO JSON
      for (this.index in response.rows) {
        response.rows[this.index].geometria = JSON.parse(
          response.rows[this.index].geometria
        );
      }

      res.status(201).json({response: response.rows});
    } else {
      res.status(204).json({error_msg: "No hay jobs grabados en la base de datos",});
    }
  } catch (error) {console.error("getJobs -> ", error);
  }
};

const getJobParameters = async (req, res) => {
  try {
    const deteccion = await database.query(
      "SELECT * FROM got.deteccion ORDER BY id_deteccion"
    );
    const expediente = await database.query(
      "SELECT * FROM got.expedientes ORDER BY id_expediente"
    );
    const perfilJob = await database.query(
      "SELECT * FROM got.arreglo ORDER BY id_arreglo"
    );
    const gravedad = await database.query(
      "SELECT * FROM got.gravedad ORDER BY id_gravedad"
    );
    const asignacion = await database.query(
      "SELECT * FROM got.asignacion ORDER BY id_asignacion"
    );
    const tipoBandeja = await database.query(
      "SELECT * FROM got.tipo_bandeja ORDER BY id_tipo_bandeja"
    );
    const operador = await database.query(
      "SELECT * FROM got.operadores ORDER BY id_operador"
    );

    res.status(201);
    res.json({
      deteccion: deteccion.rows,
      expediente: expediente.rows,
      perfilJob: perfilJob.rows,
      gravedad: gravedad.rows,
      asignacion: asignacion.rows,
      tipoBandeja: tipoBandeja.rows,
      operador: operador.rows,
    });
  } catch (error) {
    console.error("getJobParameters -> ", error);
  }
};

const getJobById = async (req, res) => {
  try {
    const job = req.params.job;
    const response = await database.query(
      "SELECT * FROM got.v_jobs WHERE job = $1",
      [job]
    );

    if (response.rowCount > 0) {
      res.status(201);
      res.json({
        job: response.rows[0],
      });
    }
  } catch (error) {
    console.error("getJobById ->", error);
  }
};

const getJobsByExpediente = async (req, res) => {
  try {
    const expediente = req.params.expediente;
    const response = await database.query(
      `SELECT 
          id_job, 
          expediente, 
          job, 
          descripcion, 
          gravedad_job, 
          deteccion_job, 
          arreglo_job, 
          estado, 
          tipo_bandeja, 
          asignacion_job, 
          nombre_operador, 
          ST_AsGeoJSON(geometria) as geometria, 
          job_grande, 
          alarma 
        FROM 
          got.v_jobs 
        WHERE 
          expediente = $1`,
      [expediente]
    );
    if (response.rowCount > 0) {
      const jobs = response.rows;

      //FORMATEO GEOJSON STRING TO JSON
      for (this.index in response.rows) {
        response.rows[this.index].geometria = JSON.parse(
          response.rows[this.index].geometria
        );
      }
      res.status(201);
      res.json({
        jobs,
      });
    } else {
      res.status(203);
      res.json({
        mensaje: "No existen jobs asociados al expediente",
      });
    }
  } catch (error) {
    console.error("getJobsByExpediente -> ", error);
  }
};

const postJobs = async (req, res) => {
  try {
    const arrayCreados = [];
    const job = req.body;
    const year = new Date().getFullYear();

    for (this.index in job) {
      //SERIAL (los a??os se asignan autom??ticamente de acuerdo a la fecha del sistema)
      let newId = await database.query(
        "SELECT to_char(serial_id + 1, 'fm000000') FROM got.serial;"
      );

      //INSERCION
      await database.query(
        `INSERT INTO got.jobs (
            job, 
            descripcion, 
            id_gravedad, 
            id_deteccion, 
            id_arreglo, 
            id_estado_job, 
            geometria, 
            id_tipo_bandeja, 
            id_asignacion_job, 
            id_operador, 
            id_expediente
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7 ,'3857'), $8, $9, $10, $11)`,
        [
          year + "_" + newId.rows[0].to_char, //job
          job[this.index].descripcion, //descripcion
          transformer("gravedad", job[this.index].gravedad), //id_gravedad
          transformer("deteccion", job[this.index].detectado), //id_deteccion
          transformer("perfil", job[this.index].perfil), //id_arreglo
          transformer("estadosJobs", job[this.index].estado), //id_estado_job
          stringifyJobGeometry(job[this.index].geometria), //geometria
          transformer("asignacion", job[this.index].asignar), //id_tipo_bandeja
          transformer("tipoBandeja", job[this.index].tipoBandeja), //id_asignacion_job
          transformer("operador", job[this.index].operador), //id_operador
          transformer("expediente", job[this.index].expediente), //id_expediente
        ]
      );

      //Graba el idJob en la BD. En la siguiente iteraci??n se le sumar?? 1.
      let avanceSerial = await database.query(
        "UPDATE got.serial SET serial_id = $1",
        [newId.rows[0].to_char]
      );
      //A??ade el idJob creado al array que devolvemos para asignar id's en la aplicacion.
      arrayCreados.push(idJob);
    }

    //RESPUESTAS
    res.status(201);
    res.json({
      creados: arrayCreados,
    });
  } catch (error) {
    console.error("postJobs -> ", error);
  }
};

const updateJobs = async (req, res) => {
  try {
    const actualizarJob = req.body[0];

    //Insercion en BD
    const response = await database.query(
      `UPDATE got.jobs SET 
          descripcion = $1, 
          id_gravedad = $2, 
          id_deteccion = $3, 
          id_arreglo = $4, 
          geometria = ST_GeomFromText($5 ,'3857'), 
          id_tipo_bandeja = $6, 
          id_asignacion_job = $7, 
          id_operador = $8, 
          id_expediente = $9, 
          job_grande = $10 
        WHERE 
          job = $11;`,
      [
        actualizarJob.descripcion,
        transformer("gravedad", actualizarJob.gravedad_job),
        transformer("deteccion", actualizarJob.deteccion_job),
        transformer("perfil", actualizarJob.arreglo_job),
        stringifyJobGeometry(actualizarJob.geometria),
        transformer("tipoBandeja", actualizarJob.tipo_bandeja),
        transformer("asignacion", actualizarJob.asignacion_job),
        transformer("operador", actualizarJob.nombre_operador),
        transformer("expediente", actualizarJob.expediente),
        actualizarJob.job_grande,
        actualizarJob.job,
      ]
    );

    if (response.rowCount > 0) {
      //Solo si se requiere una insercion en el logger
      if (req.body[1] != undefined) {
        const dataLogger = req.body[1];
        const idEventoLogger = req.body[1].idEventoLogger;

        //A??ade entrada a logger al insertar el job
        //id_job, procesoJob, id_evento, usuario, observaciones, departamento, resultadoCC
        newEntryLog(
          actualizarJob.id_job,
          dataLogger.procesoJob,
          idEventoLogger,
          dataLogger.usuario,
          dataLogger.observaciones,
          dataLogger.departamento,
          dataLogger.resultadoCC
        );
      }

      res.status(201);
      res.json({
        mensaje: `job ${actualizarJob.job} actualizado correctamente`,
      });
    } else {
      res.status(203);
      res.json({
        mensaje: `No se ha encontrado ning??n job con el id ${actualizarJob.job}`,
      });
    }
  } catch (error) {
    console.error("updateJobs -> ", error);
  }
};

const updateAsignJob = async (req, res) => {
  try {
    const job = req.body;
    const idAsignacion = transformer("tipoBandeja", job.tipo_bandeja);
    const idOperador = transformer("operador", job.operador);
    const idJob = job.id_job;

    const insercionBD = await database.query(
      "UPDATE got.jobs SET id_asignacion_job = $1, id_operador = $2 WHERE id_job = $3",
      [idAsignacion, idOperador, idJob]
    );

    if (insercionBD.rowCount > 0) {
      res.status(201);
      res.json({
        mensaje: "Job reasignado correctamente",
      });
    } else {
      res.status(203);
      res.json({
        mensae: "error inesperado",
      });
    }
  } catch (error) {
    console.error("updateAsignJob ->:", error);
  }
};

//======================================================================================================//
module.exports = {
  deleteJobs,
  getJobExtent,
  getJobs,
  getJobParameters,
  getJobById,
  getJobsByExpediente,
  postJobs,
  updateJobs,
  updateAsignJob,
};
