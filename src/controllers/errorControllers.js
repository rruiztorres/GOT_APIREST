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

const getErrorParameters = async (req, res) =>{
    const temaError = await database.query('SELECT * FROM got.temas_error ORDER BY id_tema_error');
    const tipoError = await database.query('SELECT * FROM got.tipos_error ORDER BY id_tipo_error' );

    res.status(201);
    res.json({
        tema: temaError.rows,
        tipo: tipoError.rows,
    })

}

const getErrorByEstado = async (req, res) => {
    try {
        const estado = req.params.estado;
        const errores = await database.query('SELECT * FROM got.v_errores WHERE estado = $1', [ estado ])

        if (errores.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: `Errores correspondientes a estado ${estado}`
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se encontraron errores con estado ${estado}`
            })
        }
    } catch (error){
        console.log(error)
    }

}

const getErrorByIdJob = async (req, res) =>{
    const idJob = req.params.idJob;
    const errores = await database.query('SELECT * FROM got.v_errores WHERE job = $1', [ idJob ]);

    if (errores.rowCount > 0) {
        res.status(201);
        res.json({
            errores: errores.rows,
        })
    } else {
        res.status(203);
        res.json({
            mensaje: `No se encuentran errores asociados al job ${idJob}`,
        })
    }
}

const updateError = async (req, res) => {
    const error = req.body;
    console.log(error)

        const descripcion = error.descripcion;
        const idEstado = transformer('estadosErrores', error.estado);
        const idTipo = transformer('tiposError', error.tipo);
        const idTema = transformer('temasError', error.tema);
        const geometria = error.geometria;
        const geometriaJSON = error.geometriaJSON;
        const idViaEnt = transformer('viaEntrada', error.viaEnt);
        const idError = error.error;

        //Insercion en BD
        const response = await database.query('UPDATE got.errores SET geometria = ST_GeomFromText($1 \,\'3857\') WHERE error = $2;',[
            geometria,
            idError
        ])

        if (response.rowCount > 0){
            res.status(201);
            res.json({
                mensaje: `job ${error.error} actualizado correctamente`,
            })
        } else {
            res.status(203);
            res.json({
                mensaje: `No se ha encontrado ningún job con el id ${error.error}`,
            })
        }
}

const deleteError = async (req, res) => {
    try {
        const error = req.body.error;
        const borrarError = await database.query ('DELETE FROM got.errores WHERE error = $1', [error.error]);

        if (borrarError.rowCount > 0) {
            res.status(201);
            res.json({
                mensaje: 'Error borrado con éxito'
            })
        } else {
            res.status(203);
            res.json({
                mensjae: 'El error no pudo ser borrado'
            })
        }

    } catch (error) {
        console.log(error)
    }
}


//======================================================================================================//
module.exports = {
    getErrorParameters,
    getErrorByEstado,
    getErrorByIdJob,
    updateError,
    deleteError,
};
