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
    const jobs = req.body.jobs;
    const errores = req.body.errores;
    const year = new Date().getFullYear();


    for (this.index in jobs){
        //SERIAL (los años se asignan automáticamente de acuerdo a la fecha del sistema)
        let newId = await database.query ("SELECT to_char(serial_id + 1, 'fm000000') FROM got.serial;")
        let idJob = year + '_' + newId.rows[0].to_char;

        //PARAMETROS JOB
        const descripcionJob = jobs[this.index].descripcion;
        const gravedad = transformer('gravedad', jobs[this.index].gravedad);
        const deteccion = transformer('deteccion', jobs[this.index].detectado);
        const perfil = transformer('perfil', jobs[this.index].perfil);
        const estado = transformer('estadosJobs', jobs[this.index].estado);
        const geometria = jobs[this.index].geometria;
        const geometriaJSON = jobs[this.index].geometriaJSON; 
        const asignacion = transformer('asignacion', jobs[this.index].asignar);
        const bandeja = transformer('tipoBandeja', jobs[this.index].tipoBandeja);
        const operador = transformer('operador', jobs[this.index].operador);
        const expediente = transformer('expediente', jobs[this.index].expediente);

        //INSERCION JOB
        const response = await database.query("INSERT INTO got.jobs (job, descripcion, id_gravedad, id_deteccion, id_arreglo, id_estado_job, geometria, geometria_json, id_tipo_bandeja, id_asignacion_job, id_operador, id_expediente) VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7 \,\'3857\'), $8, $9, $10, $11, $12 )",[
            idJob,
            descripcionJob,
            gravedad,
            deteccion,
            perfil,
            estado,
            geometria,
            geometriaJSON,
            bandeja,
            asignacion,
            operador,
            expediente,
            ]);

        //Graba el idJob en la BD. En la siguiente iteración se le sumará 1.
        let avanceSerial = await database.query ("UPDATE got.serial SET serial_id = $1", [newId.rows[0].to_char])
        //Añade el idJob creado al array que devolvemos para asignar id's en la aplicacion.
        arrayJobsCreados.push(idJob);


        //ERRORES (es necesario grabar antes los jobs ya que la asignacion se hace por id_job)
        for (this.errorIndex in errores) {
            const estado = transformer('estadosErrores', errores[this.errorIndex].estado);
            let jobCandidato = await database.query("SELECT id_job FROM got.jobs WHERE job = $1",[idJob]);
            const asocJob = jobCandidato.rows[0].id_job;
            const idError = idJob + '_E' + (parseInt(this.errorIndex) + 1);
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
            this.polygon = [jobs[this.index].geometriaJSON.coordinates[0]];
            this.inside = pointInPolygon(this.point, this.polygon[0]);

            if (this.inside == true) {

                //Asociamos idJob al error si está dentro geometricamente y añadimos al array para devolver.
                //let asocJob = idJob;
                let errorCreado = {
                    idError,
                    idJob,
                };
                arrayErroresCreados.push(errorCreado);

                //INSERTAMOS ERROR EN BD
                const resposeError = await database.query("INSERT INTO got.errores (id_job, error, id_tema_error, id_tipo_error, descripcion, id_estado_error, geometria_json, geometria, id_via_ent) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8 \,\'3857\'), $9)",[
                    asocJob,
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
