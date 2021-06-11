const{ Router }= require('express');
const router = Router();

//import elementos desde controller.js
const   { 
        getIncidencias, 
        getIncidenciaById ,
        getJobs,
        getJobById,
        compruebaConexion,
        createIncidencia,
        postAuth,
        deleteIncidenciaById,
        } = require('../controllers/controller.js');


//definicion rutas

//get
router.get('/incidencias', getIncidencias);
router.get('/incidencias/:id', getIncidenciaById);
router.get('/jobs', getJobs)
router.get('/jobs/:id', getJobById)
router.get('/conexion', compruebaConexion);
router.post('/auth/:usuario/:password', postAuth);


//delete
router.delete('/incidencias/:id', deleteIncidenciaById)

//post
router.post('/incidencias', createIncidencia);



module.exports = router;