const express = require('express');
const router = express.Router();
const async = require('async');
const { body, validationResult} = require('express-validator');

const GPU = require('../models/gpu');
const GPUinstance = require('../models/gpuinstance');

// display all instances
exports.gpuinstance_list = function(req, res, next) {
  GPUinstance.find()
    .populate('gpu')
    .sort({ gpu: 1 })
    .exec((err, results) => {
      if (err) { return next(err); }
      res.render('gpuinstance_list', { title: 'GPUs in stock', gpuinstancelist: results });
    })
}

// display one instances
exports.gpuinstance_detail = function(req, res, next) {
  GPUinstance.findById(req.params.id)
    .populate('gpu')
    .exec((err, results) => {
      if (err) { return next(err); }
      if (results==null) {
        const err = new Error('GPU not found');
        err.status = 404;
        return next(err);
      }
      res.render('gpuinstance_detail', { title: 'GPU Stock Detail', gpuinstance: results })
    });
};

// get create one form
exports.gpuinstance_create_get = function(req, res, next) {
  GPU.find({}, 'name')
    .exec((err, results) => {
      if (err) {return next(err); }
      res.render('gpuinstance_form', { title: 'Create new GPU Stock', gpulist: results });
    });
};

// post create one form
exports.gpuinstance_create_post = [
  // validate input
  body('gpu', 'GPU must be selected').trim().isLength({ min: 1 }).escape(),
  body('serial').trim().isLength({ min: 1 }).escape().withMessage('Serial cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    var gpuinstance = new GPUinstance(
      {
        gpu: req.body.gpu,
        serial: req.body.serial
      }
    );
    
    if (!errors.isEmpty()) {
      GPU.find({}, 'name')
      .exec((err, results) => {
        if (err) {return next(err); }
        res.render('gpuinstance_form', { title: 'Create new GPU Stock', gpulist: results });
      });  
      return;
    }
    else {
      gpuinstance.save((err) => {
        if (err) { return next(err); }
        res.redirect(gpuinstance.url);
      });
    }
  }
];

// get update one form
exports.gpuinstance_update_get = function(req, res, next) {
  async.parallel({
    gpu: function(callback) {
      GPU.find({}, 'name').exec(callback);
    },
    gpuinstance: function(callback) {
      GPUinstance.findById(req.params.id).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('GPU stock not found');
      err.status = 404;
      return next(err);
    }
    res.render('gpuinstance_form', { title: 'Update GPU stock', gpuinstance: results.gpuinstance, gpulist: results.gpu})
  })
};

// post update one form
exports.gpuinstance_update_post = [
  // validate input
  body('gpu', 'GPU must be selected').trim().isLength({ min: 1 }).escape(),
  body('serial').trim().isLength({ min: 1 }).escape().withMessage('Serial cannot be blank'),
  
  (req, res, next) => {
    const errors = validationResult(req);

    var gpuinstance = new GPUinstance(
      {
        gpu: req.body.gpu,
        serial: req.body.serial,
        _id: req.params.id
      }
    );
    
    if (!errors.isEmpty()) {
      async.parallel({
        gpu: function(callback) {
          GPU.find({}, 'name').exec(callback);
        },
        gpuinstance: function(callback) {
          GPUinstance.findById(req.params.id).exec(callback);
        }
      }, function(err, results) {
        if (err) { return next(err); }
        if (results==null) {
          const err = new Error('GPU stock not found');
          err.status = 404;
          return next(err);
        }
        res.render('gpuinstance_form', { title: 'Update GPU stock', gpuinstance: results.gpuinstance, gpu: results.gpu})
      });
      return;
    }
    else {
      GPUinstance.findByIdAndUpdate(req.params.id, gpuinstance, {}, function(err, newinstance) {
        if (err) { return next(err); }
        res.redirect(newinstance.url);
      })
    }
  }
];


// get delete one form
exports.gpuinstance_delete_get = function(req, res, next) {
  GPUinstance.findById(req.params.id)
  .populate('gpu')
  .exec((err, results) => {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('GPU stock not found');
      err.status = 404;
      return next(err);
    }
    res.render('gpuinstance_delete', { title: 'Delete GPU stock', gpuinstance: results });
  })
};

// post delete one form
exports.gpuinstance_delete_post = function(req, res, next) {
  GPUinstance.findByIdAndRemove(req.params.id, function deleteInstance(err) {
    if (err) { return next(err); }
    res.redirect('/inv/gpuinstances');
  });
};
