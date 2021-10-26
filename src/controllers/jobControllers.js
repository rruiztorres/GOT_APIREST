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

const getJobs = async (req, res) => {
    const response = await database.query("SELECT * FROM got.v_jobs ORDER BY id_job");
    if (response.rowCount !== 0) {
        for (index in response.rows){
            let resume = response.rows[index].descripcion;
            if (typeof(resume)=='string'){
                resume = resume.slice(0,40) + '...';
                response.rows[index].resumen = resume;
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
};

const getJobParameters = async (req, res) => {
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

}

const postJobs = async (req, res, err) => {
    const arrayCreados = [];
    const job = req.body;
    const year = new Date().getFullYear();

    for (this.index in job){
        //SERIAL (los años se asignan automáticamente de acuerdo a la fecha del sistema)
        let newId = await database.query ("SELECT to_char(serial_id + 1, 'fm000000') FROM got.serial;")
        let idJob = year + '_' + newId.rows[0].to_char;

        //PARAMETROS JOB
        const descripcion = job[this.index].descripcion;
        const gravedad = transformer('gravedad', job[this.index].gravedad);
        const deteccion = transformer('deteccion', job[this.index].detectado);
        const perfil = transformer('perfil', job[this.index].perfil);
        const estado = transformer('estadosJobs', job[this.index].estado);
        const geometria = job[this.index].geometria;
        const geometriaJSON = job[this.index].geometriaJSON; 
        const asignacion = transformer('asignacion', job[this.index].asignar);
        const bandeja = transformer('tipoBandeja', job[this.index].tipoBandeja);
        const operador = transformer('operador', job[this.index].operador);
        const expediente = transformer('expediente', job[this.index].expediente);


        //INSERCION
        const response = await database.query("INSERT INTO got.jobs (job, descripcion, id_gravedad, id_deteccion, id_arreglo, id_estado_job, geometria, geometria_json, id_tipo_bandeja, id_asignacion_job, id_operador, id_expediente) VALUES ($1, $2, $3, $4, $5, $6, ST_GeomFromText($7 \,\'3857\'), $8, $9, $10, $11, $12 )",[
            idJob,
            descripcion,
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
        arrayCreados.push(idJob);
    }

    //RESPUESTAS
    res.status(201);
    res.json({
        creados: arrayCreados,
    })

}
    
    

//======================================================================================================//
module.exports = {
    getJobs,
    getJobParameters,
    postJobs,
};
