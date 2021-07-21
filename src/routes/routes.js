const{ Router }= require('express');
const router = Router();

//import elementos desde controller.js
const   { 
        getIncidencias, 
        getIncidenciaById ,
        getJobs,
        getJobById,
        getSerial,
        getViaEnt,
        getProced,
        getAsignacionJob,
        getTipoError,
        getTemasError,
        getDeteccionJob,
        getArregloJob,
        getGravedadJob,
        getTipoBandejaJob,
        getOperadores,



        compruebaConexion,
        createIncidencia,
        postAuth,
        deleteIncidenciaById,
        } = require('../controllers/controller.js');


//definicion rutas
        //GET
        router.get('/incidencias', getIncidencias);
        router.get('/incidencias/:id', getIncidenciaById);
        router.get('/jobs', getJobs);
        router.get('/jobs/:id', getJobById);
        router.get('/serials/:type/:year', getSerial);
        router.get('/conexion', compruebaConexion);
        router.get('/viaentrada', getViaEnt);
        router.get('/procedencia', getProced);
        router.get('/asignacionJob', getAsignacionJob);
        router.get('/temasError', getTemasError);
        router.get('/tiposError', getTipoError);
        router.get('/deteccionJob', getDeteccionJob);
        router.get('/arregloJob', getArregloJob);
        router.get('/gravedadJob', getGravedadJob);
        router.get('/tipoBandejaJob', getTipoBandejaJob);
        router.get('/operadores', getOperadores);

        //POST
        router.post('/auth/:usuario/:password', postAuth);
        router.post('/incidencias', createIncidencia);

        //DELTE
        router.delete('/incidencias/:id', deleteIncidenciaById)






module.exports = router;