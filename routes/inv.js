const express = require('express');
const router = express.Router();

// controller modules
const cpu_controller = require('../controllers/cpuController');
const gpu_controller = require('../controllers/gpuController');
const cpuinstance_controller = require('../controllers/cpuinstanceController');
const gpuinstance_controller = require('../controllers/gpuinstanceController');

// get homepage
router.get('/', cpu_controller.index);

// CPU routes

// get form to create cpu
router.get('/cpu/create', cpu_controller.cpu_create_get);

// post form to create cpu
router.post('/cpu/create', cpu_controller.cpu_create_post);

// get form to delete cpu
router.get('/cpu/:id/delete', cpu_controller.cpu_delete_get);

// post form to delete cpu
router.post('/cpu/:id/delete', cpu_controller.cpu_delete_post);

// get form to update cpu
router.get('/cpu/:id/update', cpu_controller.cpu_update_get);

// post form to update cpu
router.post('/cpu/:id/update', cpu_controller.cpu_update_post);

// get display single cpu
router.get('/cpu/:id', cpu_controller.cpu_detail);

// get display list of all cpus
router.get('/cpus', cpu_controller.cpu_list);

// GPU routes
// get form to create gpu
router.get('/gpu/create', gpu_controller.gpu_create_get);

// post form to create gpu
router.post('/gpu/create', gpu_controller.gpu_create_post);

// get form to delete gpu
router.get('/gpu/:id/delete', gpu_controller.gpu_delete_get);

// post form to delete gpu
router.post('/gpu/:id/delete', gpu_controller.gpu_delete_post);

// get form to update gpu
router.get('/gpu/:id/update', gpu_controller.gpu_update_get);

// post form to update gpu
router.post('/gpu/:id/update', gpu_controller.gpu_update_post);

// get display single gpu
router.get('/gpu/:id', gpu_controller.gpu_detail);

// get display list of all gpus
router.get('/gpus', gpu_controller.gpu_list);

// CPU instance routes
// get form to create cpu instance
router.get('/cpuinstance/create', cpuinstance_controller.cpuinstance_create_get);

// post form to create cpu instance
router.post('/cpuinstance/create', cpuinstance_controller.cpuinstance_create_post);

// get form to delete cpu instance
router.get('/cpuinstance/:id/delete', cpuinstance_controller.cpuinstance_delete_get);

// post form to delete cpu instance
router.post('/cpuinstance/:id/delete', cpuinstance_controller.cpuinstance_delete_post);

// get form to update cpu instance
router.get('/cpuinstance/:id/update', cpuinstance_controller.cpuinstance_update_get);

// post form to update cpu instance
router.post('/cpuinstance/:id/update', cpuinstance_controller.cpuinstance_update_post);

// get display single cpu instance
router.get('/cpuinstance/:id', cpuinstance_controller.cpuinstance_detail);

// get display list of all cpus instance
router.get('/cpuinstances', cpuinstance_controller.cpuinstance_list);


// GPU instance routes
// get form to create gpu instance
router.get('/gpuinstance/create', gpuinstance_controller.gpuinstance_create_get);

// post form to create gpu instance
router.post('/gpuinstance/create', gpuinstance_controller.gpuinstance_create_post);

// get form to delete gpu instance
router.get('/gpuinstance/:id/delete', gpuinstance_controller.gpuinstance_delete_get);

// post form to delete gpu instance
router.post('/gpuinstance/:id/delete', gpuinstance_controller.gpuinstance_delete_post);

// get form to update gpu instance
router.get('/gpuinstance/:id/update', gpuinstance_controller.gpuinstance_update_get);

// post form to update gpu instance
router.post('/gpuinstance/:id/update', gpuinstance_controller.gpuinstance_update_post);

// get display single gpu instance
router.get('/gpuinstance/:id', gpuinstance_controller.gpuinstance_detail);

// get display list of all gpus instance
router.get('/gpuinstances', gpuinstance_controller.gpuinstance_list);


module.exports = router;