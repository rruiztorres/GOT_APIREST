const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const check = { check: true };
const token = jwt.sign(check, process.env.JWTKEY, { expiresIn: 1440 });

const database = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});


//Transformer
const transformer = require ("../dist/transformer");
const { response } = require("express");

//Point in polygon
const pointInPolygon = require("point-in-polygon");

//=============================================METODOS==================================================//

const postJobsErrores = async (req, res) => {
    const arrayJobsCreados = [];
    const arrayErroresCreados = [];
    const jobsRecibidos = req.body.jobs;
    const errores = req.body.errores;
    const year = new Date().getFullYear();


    for (this.index in jobsRecibidos){
        //SERIAL (los años se asignan automáticamente de acuerdo a la fecha del sistema)
        let newId = await database.query ("SELECT to_char(serial_id + 1, 'fm000000') FROM got.serial;")

        //PARAMETROS JOB
        let job = year + '_' + newId.rows[0].to_char;
        const expediente = transformer('expediente', jobsRecibidos[this.index].expediente);
        const descripcion = jobsRecibidos[this.index].descripcion;
        const gravedad_job = transformer('gravedad', jobsRecibidos[this.index].gravedad_job);
        const deteccion_job = transformer('deteccion', jobsRecibidos[this.index].deteccion_job);
        const arreglo_job = transformer('perfil', jobsRecibidos[this.index].arreglo_job);
        const estado = transformer('estadosJobs', jobsRecibidos[this.index].estado);
        const tipo_bandeja = transformer('tipoBandeja', jobsRecibidos[this.index].tipo_bandeja);
        const asignacion_job = transformer('asignacion', jobsRecibidos[this.index].asignacion_job);
        const nombre_operador = transformer('operador', jobsRecibidos[this.index].nombre_operador);
        const geometria = jobsRecibidos[this.index].geometria;
        const geometria_json = jobsRecibidos[this.index].geometria_json; 
        const job_grande = jobsRecibidos[this.index].job_grande;

        //INSERCION JOB
        const response = await database.query("INSERT INTO got.jobs (id_expediente, job, descripcion, id_gravedad, id_deteccion, id_arreglo, id_estado_job, id_tipo_bandeja, id_asignacion_job, id_operador, geometria, geometria_json, job_grande) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ST_GeomFromText($11 \,\'3857\'), $12, $13 )",[
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
            geometria,
            geometria_json,
            job_grande,
            ]);

        //Graba el idJob en la BD. En la siguiente iteración se le sumará 1.
        let avanceSerial = await database.query ("UPDATE got.serial SET serial_id = $1", [newId.rows[0].to_char])
        
        //Añade el idJob creado al array que devolvemos para asignar id's en la aplicacion.
        arrayJobsCreados.push(job);

        //Asociamos jobCandidato para asociar los errores
        const id_jobCandidato = await database.query ("SELECT id_job, job FROM got.v_jobs WHERE job = $1 ", [job]);
        const jobCandidato = id_jobCandidato.rows[0].id_job;

        //Por cada nuevo job reinicia el contador de errores (E1, E2, etc)
        let erroresEnJob = 1;

        if (errores != null) {
            //PARAMETROS ERRORES (es necesario grabar antes los jobs ya que la asignacion se hace por id_job)
            for (this.errorIndex in errores) {
                const estado = transformer('estadosErrores', errores[this.errorIndex].estado);
                const tipo = transformer('tiposError', errores[this.errorIndex].tipo);
                const tema = transformer('temasError', errores[this.errorIndex].tema);
                const descripcionErr = errores[this.errorIndex].descripcion;
                const geometria = errores[this.errorIndex].geometria;
                const geometriaJSON = errores[this.errorIndex].geometriaJSON;
                const idViaEnt = transformer('viaEntrada', errores[this.errorIndex].viaEnt);

                // Comprobamos si el error está dentro del polígono de job
                this.point = [
                    errores[this.errorIndex].geometriaJSON.coordinates[0],
                    errores[this.errorIndex].geometriaJSON.coordinates[1],
                ];
                this.polygon = [jobsRecibidos[this.index].geometriaJSON.coordinates[0]];
                this.inside = pointInPolygon(this.point, this.polygon[0]);

                if (this.inside == true) {

                    //Asociamos idJob al error si está dentro geometricamente y añadimos al array para devolver.
                    const idError = job + '_E' + erroresEnJob;

                    //Avanzamos contador de error solo si se detecta dentro de un job.
                    erroresEnJob ++;

                    //Creamos objeto para devolver errores y jobs creados con sus asociaciones correspondientes.
                    let errorCreado = {
                        idError,
                        job: job,
                    };
                    arrayErroresCreados.push(errorCreado);
                    
                    
                    //INSERTAMOS ERROR EN BD
                    const responseError = await database.query("INSERT INTO got.errores (id_job, error, id_tema_error, id_tipo_error, descripcion, id_estado_error, geometria_json, geometria, id_via_ent) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8 \,\'3857\'), $9)",[
                        jobCandidato,
                        idError,
                        tema,
                        tipo,
                        descripcionErr,
                        estado,
                        geometriaJSON,
                        geometria,
                        idViaEnt
                    ]);
                    
                } 
            };
            //Reiniciamos contador errores detectados en job
            erroresEnJob = 1;
        }
    } 

    //RESPUESTAS
    if (arrayJobsCreados.length != 0 || arrayErroresCreados != 0) {
        res.status(201);
        res.json({
            jobs: arrayJobsCreados,
            errores: arrayErroresCreados,
        })
    } else {
        res.status(203);
        res.json({
            respuesta: 'No se han encontrado datos que guardar'
        })
    }
}

module.exports = {
    postJobsErrores
};