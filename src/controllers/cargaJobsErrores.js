const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { response } = require("express");


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
//Logger
const newEntryLog = require("../dist/newEntryLog");

//Point in polygon
const pointInPolygon = require("point-in-polygon");



//=============================================METODOS==================================================//

const postJobsErrores = async (req, res) => {
    try{
        //MAPEAR DATOS JOBS, ERRORES, LOG
        const jobs = req.body.jobs;
        const errores = req.body.errores;
        const log = req.body.log;

        //INICIALIZAR CONSTANTES GLOBALES
        const year = new Date().getFullYear();
        let arrayJobsCreados = [];
        let arrayErroresCreados = [];
        const idEventoLogger = 4 //Inserción Job manual desde GOT

        //EXISTEN JOBS?
        if (jobs.length > 0){
            for (this.longJobs in jobs){

                //OBTENER CODIGO JOB
                let newIdJob = await database.query ("SELECT to_char(serial_id + 1, 'fm000000') FROM got.serial;")
                jobs[this.longJobs].job = year + '_' + newIdJob.rows[0].to_char;

                //MAPEAR DATOS DE JOB
                let codigoJob = jobs[this.longJobs].job;
                const expediente = transformer('expediente', jobs[this.longJobs].expediente);
                const descripcion = jobs[this.longJobs].descripcion;
                const gravedad_job = transformer('gravedad', jobs[this.longJobs].gravedad_job);
                const deteccion_job = transformer('deteccion', jobs[this.longJobs].deteccion_job);
                const arreglo_job = transformer('perfil', jobs[this.longJobs].arreglo_job);
                const estado = transformer('estadosJobs', jobs[this.longJobs].estado);
                const tipo_bandeja = transformer('tipoBandeja', jobs[this.longJobs].tipo_bandeja);
                const asignacion_job = transformer('asignacion', jobs[this.longJobs].asignacion_job);
                const nombre_operador = transformer('operador', jobs[this.longJobs].nombre_operador);
                const geometria = jobs[this.longJobs].geometria;
                const geometria_json = jobs[this.longJobs].geometria_json; 
                const job_grande = jobs[this.longJobs].job_grande;

                //INSERCION JOB EN BD
                await database.query("INSERT INTO got.jobs (id_expediente, job, descripcion, id_gravedad, id_deteccion, id_arreglo, id_estado_job, id_tipo_bandeja, id_asignacion_job, id_operador, geometria, geometria_json, job_grande) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, ST_GeomFromText($11 \,\'3857\'), $12, $13 )",[
                    expediente,
                    codigoJob,
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

                //OBTENER ID JOB INSERTADO Y ALMACENAMOS EN EL OBJETO
                const idJob = await database.query ("SELECT id_job FROM got.jobs id_job WHERE job = $1",[codigoJob])
                jobs[this.longJobs].id_job = idJob.rows[0].id_job;
                
                //AVANZAR CODIGO JOB
                await database.query ("UPDATE got.serial SET serial_id = $1", [newIdJob.rows[0].to_char]);
                
                //AÑADIR CODIGO JOB A ARRAY JOBS CREADOS
                arrayJobsCreados.push(codigoJob);
                
                //INSERTAR EVENTO EN LOGGER
                newEntryLog(
                    jobs[this.longJobs].id_job, 
                    log.procesoJob, 
                    idEventoLogger, 
                    log.usuario, 
                    log.observaciones, 
                    log.departamento,
                    log.resultadoCC
                )         
            } //fin bucle jobs
        } // fin existen jobs?

        //EXISTEN ERRORES?
        if (errores.length > 0){

            //OBTENER LONGITUD DE ERRORES  
            for (this.longErrores in errores) {

                //MAPEAR DATOS DE ERROR
                const descripcion = errores[this.longErrores].descripcion;
                const tema_error = transformer('temasError', errores[this.longErrores].tema_error);
                const tipo_error = transformer('tiposError', errores[this.longErrores].tipo_error);
                const via_ent = transformer('viaEntrada', errores[this.longErrores].via_ent);
                const estado = transformer('estadosErrores', errores[this.longErrores].estado);
                const geometria = errores[this.longErrores].geometria;
                const geometriaJSON = errores[this.longErrores].geometria_json;

                //SE HAN CREADO JOBS?
                if (arrayJobsCreados.length > 0){

                    //COMPARAR ERROR CON LOS JOBS CREADOS
                    this.point = [
                        errores[this.longErrores].geometria_json.coordinates[0],
                        errores[this.longErrores].geometria_json.coordinates[1],
                    ];

                    for (this.longJobs in jobs){
                        this.polygon = [jobs[this.longJobs].geometria_json.coordinates[0]];
                        this.inside = pointInPolygon(this.point, this.polygon[0]);

                        //EL ERROR ESTÁ DENTRO DE ALGUNO DE LOS JOBS CREADOS?
                        if (this.inside == true){

                            //ASOCIAR ERROR A JOB A TRAVES DE id_job
                            errores[this.longErrores].job = jobs[this.longJobs].id_job
                        }
                    }
                } else {
                    // ESTABLECER id_job EN ERROR A null
                    errores[this.longErrores].job = null;
                }
            } // fin bucle errores

            //CREAR CODIGOS DE ERROR SI SE HAN CREADO JOBS
            if (arrayJobsCreados.length > 0){
                
                //OBTENER LONGITUD DE ERRORES
                for (this.longJobs in jobs) {
                    let numeroError = 1;

                    //OBTENER LONGITUD DE JOBS
                    for (this.longErrores in errores) {
                        if (jobs[this.longJobs].id_job === errores[this.longErrores].job){

                            //CREAR CODIGO ERROR A PARTIR DE CODIGO JOB
                            const codigoError = jobs[this.longJobs].job + '_E' + numeroError;
                            errores[this.longErrores].error = codigoError;
                            //AVANZAR NUMERO ERROR
                            numeroError++;

                            //AÑADIR ERROR A ARRAY ERRORES CREADOS
                            let errorCreado = {
                                idInterno: errores[this.longErrores].id,
                                asignado: true,
                                codigoError: errores[this.longErrores].error,
                                id_error: errores[this.longErrores].id_error,
                                job: jobs[this.longJobs].job
                            };
                            arrayErroresCreados.push(errorCreado);
                        }
                    }            
                }
            }

            //EVALUAR SI LOS ERRORES SON ERRORES SIN ASIGNAR        
            for (this.longErrores in errores){

                if (errores[this.longErrores].id_error != null){

                    //ERROR EXISTÍA PREVIAMENTE - UPDATE EN BD
                    await database.query("UPDATE got.errores SET id_job = $1, error = $2, id_tema_error = $3, id_tipo_error = $4, descripcion = $5, id_estado_error = $6, geometria = ST_GeomFromText($7 \,\'3857\'), id_via_ent = $8, geometria_json = $9  WHERE id_error = $10",[
                        errores[this.longErrores].job,
                        errores[this.longErrores].error,
                        transformer('temasError', errores[this.longErrores].tema_error),
                        transformer('tiposError', errores[this.longErrores].tipo_error),
                        errores[this.longErrores].descripcion,
                        transformer('estadosErrores', errores[this.longErrores].estado),
                        errores[this.longErrores].geometria,
                        transformer('viaEntrada', errores[this.longErrores].via_ent),
                        errores[this.longErrores].geometria_json,
                        errores[this.longErrores].id_error,
                    ])
                } else {

                    //ERROR NO EXISTÍA PREVIAMENTE - INSERT EN BD
                    await database.query("INSERT INTO got.errores (id_job, error, id_tema_error, id_tipo_error, descripcion, id_estado_error, geometria, id_via_ent, geometria_json) VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7 \,\'3857\'), $8, $9)",[
                        errores[this.longErrores].job,
                        errores[this.longErrores].error,
                        transformer('temasError', errores[this.longErrores].tema_error),
                        transformer('tiposError', errores[this.longErrores].tipo_error),
                        errores[this.longErrores].descripcion,
                        transformer('estadosErrores', errores[this.longErrores].estado),
                        errores[this.longErrores].geometria,
                        transformer('viaEntrada', errores[this.longErrores].via_ent),
                        errores[this.longErrores].geometria_json,
                    ])
                }
            } //fin bucle errores

            //ENVIAR RESPUESTAS
            if (arrayJobsCreados.length != 0 || errores.length != 0) {
                res.status(201);
                res.json({
                    jobs: arrayJobsCreados,
                    errores: arrayErroresCreados,
                })
            }
            else {
                res.status(203);
                res.json({
                    respuesta: 'No se han encontrado datos que guardar'
                })
            }
        }
    }catch(error){console.log("postJobsErrores -> ", error)}
}
module.exports = {postJobsErrores};
