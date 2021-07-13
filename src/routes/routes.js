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
        getAsign,
        getTipoError,
        getTemasError,
        compruebaConexion,
        createIncidencia,
        postAuth,
        deleteIncidenciaById,
        } = require('../controllers/controller.js');


//definicion rutas

//get
router.get('/incidencias', getIncidencias);
router.get('/incidencias/:id', getIncidenciaById);
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.get('/serials/:type/:year', getSerial);
router.get('/conexion', compruebaConexion);
router.get('/viaentrada', getViaEnt);
router.get('/procedencia', getProced);
router.get('/asignacionjob', getAsign);
router.get('/temasError', getTemasError);
router.get('/tiposError', getTipoError);

router.post('/auth/:usuario/:password', postAuth);


//delete
router.delete('/incidencias/:id', deleteIncidenciaById)

//post
router.post('/incidencias', createIncidencia);



module.exports = router;