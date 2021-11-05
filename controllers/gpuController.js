const express = require('express');
const router = express.Router();
const async = require('async');
const { body, validationResult} = require('express-validator');

const GPU = require('../models/gpu');
const GPUinstance = require('../models/gpuinstance');


// display all gpus
exports.gpu_list = function(req, res, next) {
  GPU.find()
    .sort( { name: 1 })
    .exec((err, results) => {
      if (err) { return next(err); }
      res.render('gpu_list', { title: 'GPUs', gpulist: results });
    });
};

// display one gpu
exports.gpu_detail = function(req, res, next) {
  GPU.findById(req.params.id)
    .exec((err, results) => {
      if (err) { return next(err); }
      if (results==null) {
        const err = new Error('GPU not found');
        err.status = 404
        return next(err);
      }
      res.render('gpu_detail', { title: 'GPU Details', gpu: results});
    })
}

// get create one form
exports.gpu_create_get = function(req, res, next) {
  res.render('gpu_form', { title: 'Create New GPU' });
};


// post create one form
exports.gpu_create_post = [
  // validate information
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Name cannot be blank'),
  body('model').trim().isLength({ min: 1 }).escape().withMessage('Model cannot be blank'),
  body('price').isNumeric().escape().withMessage('Price must be a valid number only').isLength({ min: 1}).withMessage('Price cannot be blank'),
  body('manufacturer').trim().isLength({ min: 1 }).escape().withMessage('Manufacturer cannot be blank'),
  body('chipset').trim().isLength({ min: 1 }).escape().withMessage('Chipset cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('gpu_form', { title: 'Create New GPU', gpu: req.body, errors: errors.array()});
      return;
    }
    else {
      const gpu = new GPU(
        {
          name: req.body.name,
          model: req.body.model,
          price: req.body.price,
          manufacturer: req.body.manufacturer,
          chipset: req.body.chipset
        }
      );
      gpu.save(function(err) {
        if (err) { return next(err); }
        res.redirect(gpu.url);
      });
    }
  }
];


// get update one form
exports.gpu_update_get = function(req, res, next) {
  GPU.findById(req.params.id)
    .exec((err, results) => {
      if (err) { return next(err); }
      if (results==null) {
        const err = new Error('GPU not found');
        err.status = 404
        return next(err);
      }
      res.render('gpu_form', { title: 'Update GPU', gpu: results });
    });
};

// post update one form
exports.gpu_update_post = [
  // validate information
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Name cannot be blank'),
  body('model').trim().isLength({ min: 1 }).escape().withMessage('Model cannot be blank'),
  body('price').isNumeric().escape().withMessage('Price must be a valid number only').isLength({ min: 1}).withMessage('Price cannot be blank'),
  body('manufacturer').trim().isLength({ min: 1 }).escape().withMessage('Manufacturer cannot be blank'),
  body('chipset').trim().isLength({ min: 1 }).escape().withMessage('Chipset cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('gpu_form', { title: 'Update GPU', gpu: req.body, errors: errors.array()});
      return;
    }
    else {
      const gpu = new GPU(
        {
          name: req.body.name,
          model: req.body.model,
          price: req.body.price,
          manufacturer: req.body.manufacturer,
          chipset: req.body.chipset,
          _id: req.params.id
        }
      );
      GPU.findByIdAndUpdate(req.params.id, gpu, {}, function(err, updatedgpu) {
        if (err) { return next(err); }
        res.redirect(updatedgpu.url);
      })
    }
  }
];

// get delete one form
exports.gpu_delete_get = function(req, res, next) {
  async.parallel({
    gpu: function(callback) {
      GPU.findById(req.params.id).exec(callback);
    },
    gpuinstances: function(callback) {
      GPUinstance.find({ gpu: req.params.id }).exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('GPU not found');
      err.status = 404;
      return next(err);
    }
    res.render('gpu_delete', { title: 'Delete GPU', gpu: results.gpu, gpuinstances: results.gpuinstances });
  });
};

// post delete one form
exports.gpu_delete_post = function(req, res, next) {
  async.parallel({
    gpu: function(callback) {
      GPU.findById(req.params.id).exec(callback);
    },
    gpuinstances: function(callback) {
      GPUinstance.find({ gpu: req.params.id }).exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('GPU not found');
      err.status = 404;
      return next(err);
    }
    else {
      GPU.findByIdAndRemove(req.params.id, function deletedGPU(err) {
        if (err) { return next(err); }
        res.redirect('/inv/gpus');
      })
    }
  })
};