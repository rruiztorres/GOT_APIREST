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

//cuando este completo
/*
    //Transformer
    const transformer = require ("../dist/transformer")
    transformer('arreglo')
*/

//=============================================METODOS==================================================//

const getErrorParameters = async (req, res) =>{
    const temaError = await database.query('SELECT * FROM got.temas_error ORDER BY id_tema_error');
    const tipoError = await database.query('SELECT * FROM got.tipos_error ORDER BY id_tipo_error' );

    res.status(201);
    res.json({
        tema: temaError.rows,
        tipo: tipoError.rows,
    })

};

const postErrores = async (req, res) => {
    
    const errores = req.body;
    console.log (errores);

    /*for (this.index in errores){
        //PARAMETROS ERROR
        const idError = null;
        const job = transformer('gravedad', error[this.index].idJob);
        const tema = transformer('gravedad', error[this.index].tema);
        const tipo = transformer('gravedad', error[this.index].tipoError);
        const descripcion = transformer('gravedad', error[this.index].descripcion);
        const estado = transformer('gravedad', error[this.index].estado);
        const geometria = error[this.index].geometria;
        const geometriaJSON = error[this.index].geometriaJSON;
        const viaEntrada = transformer('gravedad', error[this.index].viaEntrada);

        await database.query('INSERT INTO got.errores (id_job, error, id_tema_error, id_tipo_error, descripcion, id_estado_error, geometria_json, geometria, id_via_ent) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8 \,\'3857\'), $9)',[
            job,
            idError,
            tema,
            tipo,
            descripcion,
            estado,
            geometriaJSON,
            geometria,
            viaEntrada
        ]);
    }

        res.json ({
            status: 200,
            mensaje: 'Errores grabados correctamente'
        })*/
}

//======================================================================================================//
module.exports = {
    getErrorParameters,
    postErrores,
};
