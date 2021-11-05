const express = require('express');
const router = express.Router();
const async = require('async');
const { body, validationResult} = require('express-validator');

const CPU = require('../models/cpu');
const CPUinstance = require('../models/cpuinstance');

// display all instances
exports.cpuinstance_list = function(req, res, next) {
  CPUinstance.find()
    .populate('cpu')
    .sort({ cpu: 1 })
    .exec((err, results) => {
      if (err) { return next(err); }
      res.render('cpuinstance_list', { title: 'CPUs in stock', cpuinstancelist: results });
    })
}

// display one instances
exports.cpuinstance_detail = function(req, res, next) {
  CPUinstance.findById(req.params.id)
    .populate('cpu')
    .exec((err, results) => {
      if (err) { return next(err); }
      if (results==null) {
        const err = new Error('CPU not found');
        err.status = 404;
        return next(err);
      }
      res.render('cpuinstance_detail', { title: 'CPU Stock Detail', cpuinstance: results })
    });
};

// get create one form
exports.cpuinstance_create_get = function(req, res, next) {
  CPU.find({}, 'name')
    .exec((err, results) => {
      if (err) {return next(err); }
      res.render('cpuinstance_form', { title: 'Create new CPU Stock', cpulist: results });
    });
};

// post create one form
exports.cpuinstance_create_post = [
  // validate input
  body('cpu', 'CPU must be selected').trim().isLength({ min: 1 }).escape(),
  body('serial').trim().isLength({ min: 1 }).escape().withMessage('Serial cannot be blank'),

  (req, res, next) => {
    const errors = validationResult(req);

    var cpuinstance = new CPUinstance(
      {
        cpu: req.body.cpu,
        serial: req.body.serial
      }
    );
    
    if (!errors.isEmpty()) {
      CPU.find({}, 'name')
      .exec((err, results) => {
        if (err) {return next(err); }
        res.render('cpuinstance_form', { title: 'Create new CPU Stock', cpulist: results });
      });  
      return;
    }
    else {
      cpuinstance.save((err) => {
        if (err) { return next(err); }
        res.redirect(cpuinstance.url);
      });
    }
  }
];

// get update one form
exports.cpuinstance_update_get = function(req, res, next) {
  async.parallel({
    cpu: function(callback) {
      CPU.find({}, 'name').exec(callback);
    },
    cpuinstance: function(callback) {
      CPUinstance.findById(req.params.id).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('CPU stock not found');
      err.status = 404;
      return next(err);
    }
    res.render('cpuinstance_form', { title: 'Update CPU stock', cpuinstance: results.cpuinstance, cpulist: results.cpu})
  })
};

// post update one form
exports.cpuinstance_update_post = [
  // validate input
  body('cpu', 'CPU must be selected').trim().isLength({ min: 1 }).escape(),
  body('serial').trim().isLength({ min: 1 }).escape().withMessage('Serial cannot be blank'),
  
  (req, res, next) => {
    const errors = validationResult(req);

    var cpuinstance = new CPUinstance(
      {
        cpu: req.body.cpu,
        serial: req.body.serial,
        _id: req.params.id
      }
    );
    
    if (!errors.isEmpty()) {
      async.parallel({
        cpu: function(callback) {
          CPU.find({}, 'name').exec(callback);
        },
        cpuinstance: function(callback) {
          CPUinstance.findById(req.params.id).exec(callback);
        }
      }, function(err, results) {
        if (err) { return next(err); }
        if (results==null) {
          const err = new Error('CPU stock not found');
          err.status = 404;
          return next(err);
        }
        res.render('cpuinstance_form', { title: 'Update CPU stock', cpuinstance: results.cpuinstance, cpu: results.cpu})
      });
      return;
    }
    else {
      CPUinstance.findByIdAndUpdate(req.params.id, cpuinstance, {}, function(err, newinstance) {
        if (err) { return next(err); }
        res.redirect(newinstance.url);
      })
    }
  }
];


// get delete one form
exports.cpuinstance_delete_get = function(req, res, next) {
  CPUinstance.findById(req.params.id)
  .populate('cpu')
  .exec((err, results) => {
    if (err) { return next(err); }
    if (results==null) {
      const err = new Error('CPU stock not found');
      err.status = 404;
      return next(err);
    }
    res.render('cpuinstance_delete', { title: 'Delete CPU stock', cpuinstance: results });
  })
};

// post delete one form
exports.cpuinstance_delete_post = function(req, res, next) {
  CPUinstance.findByIdAndRemove(req.params.id, function deleteInstance(err) {
    if (err) { return next(err); }
    res.redirect('/inv/cpuinstances');
  });
};