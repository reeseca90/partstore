const express = require('express');
const router = express.Router();
const async = require('async');
const { body, validationResult} = require('express-validator');

const CPU = require('../models/cpu');
const GPU = require('../models/gpu');
const CPUinstance = require('../models/cpuinstance');
const GPUinstance = require('../models/gpuinstance');


// display homepage
exports.index = function(req, res) {
  async.parallel({
    cpu_count: function(callback) {
      CPU.countDocuments({}, callback);
    },
    gpu_count: function(callback) {
      GPU.countDocuments({}, callback);
    },
    cpuinstance_count: function(callback) {
      CPUinstance.countDocuments({}, callback);
    },
    gpuinstance_count: function(callback) {
      GPUinstance.countDocuments({}, callback);
    }
  }, function(err, results) {
    res.render('index', { title: 'Homepage', error: err, data: results});
  });
};

// display all cpus
exports.cpu_list = function(req, res, next) {
  CPU.find()
    .sort({ name: 1 })
    .exec((err, results) => {
      if (err) { return next(err); }
      res.render('cpu_list', { title: 'CPUs', cpulist: results });
    });
};

// display one cpu
exports.cpu_detail = function(req, res, next) {
  CPU.findById(req.params.id)
    .exec((err, results) => {
      if (err) { return next(err); }
      if (results==null) {
        const err = new Error('CPU not found');
        err.status = 404;
        return next(err);
      }
      res.render('cpu_detail', { title: 'CPU Details', cpu: results})
    });
};


// get create one form
exports.cpu_create_get = function(req, res, next) {
  res.render('cpu_form', { title: 'Create New CPU' });
};

// post create one form
exports.cpu_create_post = [
  // validate information
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Name cannot be blank'),
  body('model').trim().isLength({ min: 1 }).escape().withMessage('Model cannot be blank'),
  body('price').isNumeric().escape().withMessage('Price must be a valid number only').isLength({ min: 1}).withMessage('Price cannot be blank'),
  body('manufacturer').trim().isLength({ min: 1 }).escape().withMessage('Manufacturer cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('cpu_form', { title: 'Create New CPU', cpu: req.body, errors: errors.array()});
      return;
    }
    else {
      const cpu = new CPU(
        {
          name: req.body.name,
          model: req.body.model,
          price: req.body.price,
          manufacturer: req.body.manufacturer
        });
      cpu.save(function (err) {
        if (err) { return next(err); }
        res.redirect(cpu.url);
      });
    }
  }
];

// get update one form
exports.cpu_update_get = function(req, res, next) {
  CPU.findById(req.params.id).exec(function(err, results) {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('CPU not found');
      err.status = 404;
      return next(err);
    }
    res.render('cpu_form', { title: 'Update CPU', cpu: results });
  });
};

// post update one form
exports.cpu_update_post = [
  // validate information
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Name cannot be blank'),
  body('model').trim().isLength({ min: 1 }).escape().withMessage('Model cannot be blank'),
  body('price').isNumeric().escape().withMessage('Price must be a valid number only').isLength({ min: 1}).withMessage('Price cannot be blank'),
  body('manufacturer').trim().isLength({ min: 1 }).escape().withMessage('Manufacturer cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('cpu_form', { title: 'Create New CPU', cpu: req.body, errors: errors.array()});
      return;
    }
    else {
      const cpu = new CPU(
        {
          name: req.body.name,
          model: req.body.model,
          price: req.body.price,
          manufacturer: req.body.manufacturer,
          _id: req.params.id
        });
      CPU.findByIdAndUpdate(req.params.id, cpu, {}, function (err, updatedcpu) {
        if (err) { return next(err); }
        res.redirect(updatedcpu.url);
      });
    }
  }
];

// get delete one form
exports.cpu_delete_get = function(req, res, next) {

  async.parallel({
    cpu: function(callback) {
      CPU.findById(req.params.id).exec(callback);
    },
    cpuinstances: function(callback) {
      CPUinstance.find({ cpu: req.params.id }).exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('CPU not found');
      err.status = 404;
      return next(err);
    }
    res.render('cpu_delete', { title: 'Delete CPU', cpu: results.cpu, cpuinstances: results.cpuinstances });
  });

};


// post delete one form
exports.cpu_delete_post = function(req, res, next) {

  async.parallel({
    cpu: function(callback) {
      CPU.findById(req.params.id).exec(callback);
    },
    cpuinstances: function(callback) {
      CPUinstance.find({ cpu: req.params.id }).exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.cpuinstances.length > 0) {
      res.render('cpu_delete', { title: 'Delete CPU', cpu: results.cpu, cpuinstances: results.cpuinstances})
      return;
    }
    else {
      CPU.findByIdAndRemove(req.params.id, function deletedCPU(err) {
        if (err) { return next(err); }
        res.redirect('/inv/cpus');
      });
    }
  });
};