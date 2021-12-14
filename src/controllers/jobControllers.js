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

//=============================================METODOS==================================================//

const deleteJobs = async(req, res) => {
    try{
        const jobs = req.body;
        let ejecucion = 0;
        for (this.index in jobs){
            //Se deben borrar los errores asociados también 
            const deleteErrores = await database.query('DELETE FROM got.errores WHERE id_job = $1', [jobs[this.index].id_job])
            const deleteJob = await database.query('DELETE FROM got.jobs WHERE id_job = $1', [jobs[this.index].id_job])
            
            //Comprueba ejecución
            if (deleteJob.rowCount == 0){
                ejecucion = 1;
            }
        }

        //Respuestas
        if (ejecucion == 0){
            res.status(201);
            res.json({
                mensaje: 'Jobs y errores asociados eliminados correctamente'
            })
        } else {
            res.status(203);
            res.json({
                mensaje: 'Error inesperado, por favor compruebe los datos'
            })
        }
    } catch (error){
        console.log(error)
    }
};


const getJobExtent = async (req,res) => {
    try{
        const job = req.params.job;
        const dataExtent = await database.query('SELECT ST_AsText(ST_Envelope(geometria)) FROM got.v_jobs WHERE job = $1', [job])
        const dataCentroid = await database.query('SELECT ST_AsText(ST_Centroid(geometria)) FROM got.v_jobs WHERE job = $1', [job])
        
        if (dataExtent.rows.length > 0 && dataCentroid.rows.length > 0){
            const extent = dataExtent.rows[0].st_astext;
            const centroid = dataCentroid.rows[0].st_astext;
            res.status(201);
            res.json({
                extent,
                centroid,
            })
        } else {
            res.status(203);
            console.log("Error inesperado")
        }  

    } catch (error) {
        res.status(500);
        console.log("get job extent error ->", error)
    }
};

const getJobs = async (req, res) => {
    try{
        const response = await database.query("SELECT * FROM got.v_jobs ORDER BY id_job");
        if (response.rowCount !== 0) {
            for (index in response.rows){
                let resume = response.rows[index].descripcion;
                let bloqueado = false;
                if (typeof(resume)=='string'){
                    resume = resume.slice(0,40) + '...';
                    response.rows[index].resumen = resume;
                } 
                if (bloqueado == false){
                    response.rows[index].bloqueado = bloqueado;
                }
            };
            res.status(201);
            res.json({
                response: response.rows,
            });
        } else {
            res.status(204);
            res.json({
                error_msg: "No hay jobs grabados en la base de datos",
            });
        }
    } catch(error){
        console.error("getJobs -> ", error)
    }
};

const getJobParameters = async (req, res) => {
    try{
        const deteccion = await database.query('SELECT * FROM got.deteccion ORDER BY id_deteccion');
        const expediente = await database.query('SELECT * FROM got.expedientes ORDER BY id_expediente')
        const perfilJob = await database.query('SELECT * FROM got.arreglo ORDER BY id_arreglo');
        const gravedad = await database.query('SELECT * FROM got.gravedad ORDER BY id_gravedad');
        const asignacion = await database.query('SELECT * FROM got.asignacion ORDER BY id_asignacion');
        const tipoBandeja = await database.query('SELECT * FROM got.tipo_bandeja ORDER BY id_tipo_bandeja');
        const operador = await database.query('SELECT * FROM got.operadores ORDER BY id_operador');

        res.status(201);
        res.json({
            deteccion: deteccion.rows,
            expediente: expediente.rows,
            perfilJob: perfilJob.rows,
            gravedad: gravedad.rows,
            asignacion: asignacion.rows,
            tipoBandeja: tipoBandeja.rows,
            operador: operador.rows
        })
    } catch(error){
        console.error("getJobParameters -> ", error)
    }

}

const postJobs = async (req, res) => {
    try{
        const arrayCreados = [];
        const job = req.body;
        const year = new Date().getFullYear();

        for (this.index in job){
            //SERIAL (los años se asignan automáticamente de acuerdo a la fecha del sistema)
            let newId = await database.query ("SELECT to_char(serial_id + 1, 'fm000000') FROM got.serial;")

            //INSERCION
            const response = await database.query("INSERT INTO got.jobs (job, descripcion, id_gravedad, id_deteccion, id_arreglo, id_estado_job, geometria, geometria_json, id_tipo_bandeja, id_asignacion_job, id_operador, id_expediente) VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7 \,\'3857\'), $8, $9, $10, $11, $12 )",[
                year + '_' + newId.rows[0].to_char,                     //job
                job[this.index].descripcion,                            //descripcion
                transformer('gravedad', job[this.index].gravedad),      //id_gravedad
                transformer('deteccion', job[this.index].detectado),    //id_deteccion
                transformer('perfil', job[this.index].perfil),          //id_arreglo
                transformer('estadosJobs', job[this.index].estado),     //id_estado_job
                job[this.index].geometria,                              //geometria
                job[this.index].geometriaJSON,                          //geometria_json
                transformer('asignacion', job[this.index].asignar),     //id_tipo_bandeja
                transformer('tipoBandeja', job[this.index].tipoBandeja),//id_asignacion_job
                transformer('operador', job[this.index].operador),      //id_operador
                transformer('expediente', job[this.index].expediente),  //id_expediente
                ]);

            //Graba el idJob en la BD. En la siguiente iteración se le sumará 1.
            let avanceSerial = await database.query ("UPDATE got.serial SET serial_id = $1", [newId.rows[0].to_char])
            //Añade el idJob creado al array que devolvemos para asignar id's en la aplicacion.
            arrayCreados.push(idJob);
        }

        //RESPUESTAS
        res.status(201);
        res.json({
            creados: arrayCreados,
        })
    } catch(error){
        console.error("postJobs -> ", error)
    }

}

const updateJobs = async (req, res) => {
    try{        
        const actualizarJob = req.body[0]
        const descripcion = actualizarJob.descripcion;
        const idGravedad = transformer("gravedad", actualizarJob.gravedad_job);
        const idDeteccion = transformer("deteccion", actualizarJob.deteccion_job);
        const idArreglo = transformer("perfil", actualizarJob.arreglo_job);
        const geometria = actualizarJob.geometria;
        const idTipoBandeja = transformer("tipoBandeja", actualizarJob.tipo_bandeja);
        const idAsignacion = transformer("asignacion",actualizarJob.asignacion_job);
        const idOperador  = transformer("operador", actualizarJob.nombre_operador);
        const idExpediente = transformer("expediente", actualizarJob.expediente);
        const geometriaJSON = actualizarJob.geometria_json;
        const jobGrande = actualizarJob.job_grande;
        const idJob = await database.query ("SELECT id_job FROM got.jobs WHERE job = $1",[actualizarJob.job])

        //Insercion en BD
        const response = await database.query('UPDATE got.jobs SET descripcion = $1, id_gravedad = $2, id_deteccion = $3, id_arreglo = $4, geometria = ST_GeomFromText($5 \,\'3857\'), id_tipo_bandeja = $6, id_asignacion_job = $7, id_operador = $8, id_expediente = $9, geometria_json = $10, job_grande = $11 WHERE id_job = $12;',[
            descripcion,
            idGravedad,
            idDeteccion,
            idArreglo,
            geometria,
            idTipoBandeja,
            idAsignacion,
            idOperador,
            idExpediente,
            geometriaJSON,
            jobGrande,
            idJob.rows[0].id_job,
        ])

        if (response.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: `job ${actualizarJob.job} actualizado correctamente`,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se ha encontrado ningún job con el id ${actualizarJob.job}`,
            })
        }
    } catch (error){
        console.error("updateJobs -> ", error)
    };
}
    
    

//======================================================================================================//
module.exports = {
    deleteJobs,
    getJobExtent,
    getJobs,
    getJobParameters,
    postJobs,
    updateJobs,
};
