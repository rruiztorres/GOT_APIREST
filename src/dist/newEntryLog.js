const { Pool } = require("pg");
require("dotenv").config();

const database = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

// =================================================================== //


module.exports = function newEntryLog (id_job, procesoJob, id_evento, usuario, observaciones, departamento, resultadoCC) {

    const getDescripcion = function (id_job, procesoJob, id_evento, usuario, observaciones, departamento, resultadoCC){
        //INSERCION JOB PROCESO AUTOMÁTICO
        if (id_evento == 3){
            const descripcion = `Job insertado por proceso automático ${procesoJob}`;
            return descripcion
        }
        
        //INSERCIÓN JOB DESDE GOT
        else if (id_evento == 4){
            const descripcion = `Job insertado por usuario ${usuario}`;
            return descripcion
        }

        //JOB MODIFICADO
        else if (id_evento == 6){
            const descripcion = `El job ha sido editado por el generador de jobs ${usuario}`;
            return descripcion
        }

        //JOB GENERADO
        else if (id_evento == 7){
            const descripcion = `El job ha sido generado por el generador de jobs ${usuario}`;
            return descripcion
        }

        //JOB RECUPERADO A TRIAJE
        else if (id_evento == 10){
            const descripcion = `El generador de jobs ${usuario} recuperó el job para realizar un nuevo triaje`;
            return descripcion
        }

        //JOB SELECCIONADO PARA TRABAJAR
        else if (id_evento == 11){
            const descripcion = `El operador ${usuario} se asignó el job para ejecutarlo`;
            return descripcion
        }

        //JOB DEVUELTO A BANDEJA GENERICA
        else if (id_evento == 12){
            const descripcion = `El operador ${usuario} devolvió el job a bandeja por: ${observaciones}`;
            return descripcion
        }

        //JOB ENVIADO A CONSULTA
        else if (id_evento == 14){
            const descripcion = `El generador de jobs ${usuario} necesita información adicional del departamento ${departamento} para realizar el triaje
            `;
            return descripcion
        }

        //JOB CONSULTA RESUELTA
        else if (id_evento == 16){
            const descripcion = `Obtenida respuesta de departamento ${departamento}, se continua triaje`;
            return descripcion
        }

        //JOB DESESTIMADO
        else if (id_evento == 17){
            const descripcion = `El generador de jobs ${usuario} desestima el job por: ${observaciones}`;
            return descripcion
        }

        //JOB DEVUELTO A TRIAJE OPERADOR
        else if (id_evento == 22){
            const descripcion = `El operador ${usuario} devolvió el job a bandeja por: ${observaciones}`;
            return descripcion
        }

        //JOB DEVUELTO A BANDEJA POR OPERADOR
        else if (id_evento == 23){
            const descripcion = `El operador ${usuario} devolvió el job a bandeja por: ${observaciones}`;
            return descripcion
        }

        //OPERADOR PAUSA EL JOB
        else if (id_evento == 24){
            const descripcion = `El operador ${usuario} pausó el job por: ${observaciones}`;
            return descripcion
        }    
        
        //JOB REVISADO EN SOPORTE
        else if (id_evento == 29){
            const descripcion = `Soporte en curso por usuario ${usuario}`;
            return descripcion
        }

        //ERROR DESESTIMADO GENERADOR DE JOBS
        else if (id_evento == 32){
            const descripcion = `El generador de jobs ${usuario} desestima el error por: ${observaciones}`;
            return descripcion
        }

        //JOB EJECUTANDO CONTROL DE CALIDAD
        else if (id_evento == 37){
            const descripcion = `El ${usuario} realizará el control de calidad sobre el job ${id_job}`;
            return descripcion
        }

        //JOB CONTROL DE CALIDAD RESULTADO
        else if (id_evento == 39){
            const descripcion = `El resultado del control de calidad fue: ${resultadoCC}`;
            return descripcion
        }

        //JOB CONTROL DE CALIDAD RECHAZADO
        else if (id_evento == 39){
            const descripcion = `Se encontraron defectos en el job: ${observaciones}`;
            return descripcion
        }
        
    }

    const insercionLog = async () =>{
        const descripcion = getDescripcion(id_job, procesoJob, id_evento, usuario, observaciones, departamento, resultadoCC)

        const response = await database.query ("INSERT INTO got.logs (id_job, id_evento, descripcion) VALUES ($1, $2, $3)",[
            id_job,
            id_evento,
            descripcion,
        ]) 
    }

    try{
        insercionLog();
    } catch (error) {
        console.log("newEntryLog ->", error)
    }
};
