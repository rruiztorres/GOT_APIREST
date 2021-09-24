const{ Router }= require('express');
const router = Router();

//import elementos desde controller.js
const   { 
        getIncidencias, 
        getIncidenciaById ,
        getJobs,
        getJobByIdInc,
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
        getPrioridad,

        postIncidencia,
        postAuth,
        postJobs,
        postErrores,


        updateIncidencia,
        updateErrores,
        updateJobs,
        updateSerial,

        compruebaConexion,

        deleteIncidenciaById,
        getErrorByIdInc,
        } = require('../controllers/controller.js');


//definicion rutas
        //GET
        router.get('/incidencias', getIncidencias);
        router.get('/incidencias/:id', getIncidenciaById);
        router.get('/jobs', getJobs);
        router.get('/jobs/:id', getJobByIdInc);
        router.get('/errores/:id', getErrorByIdInc);
        router.get('/serials', getSerial);
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
        router.get('/prioridad', getPrioridad)

        //POST
        router.post('/auth/:usuario/:password', postAuth);
        router.post('/postIncidencia', postIncidencia);
        router.post('/postJobs', postJobs);
        router.post('/postErrores', postErrores);

        //PUT
        router.put('/updateIncidencia', updateIncidencia);
        router.put('/updateErrores', updateErrores);
        router.put('/updateJobs', updateJobs);
        router.put('/updateSerial', updateSerial);

        //DELTE
        router.delete('/incidencias/:id', deleteIncidenciaById)






module.exports = router;