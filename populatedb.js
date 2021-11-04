#! /usr/bin/env node

console.log('This script populates some test items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var CPU = require('./models/cpu')
var GPU = require('./models/gpu')
var CPUinstance = require('./models/cpuinstance')
var GPUinstance = require('./models/gpuinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var cpus = []
var gpus = []
var cpuinstances = []
var gpuinstances = []
 
function cpuCreate(name, model, price, manufacturer, cb) {
  cpudetail = {name: name , model: model, price: price, manufacturer: manufacturer}
  
  var cpu = new CPU(cpudetail);
       
  cpu.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New CPU: ' + cpu);
    cpus.push(cpu)
    cb(null, cpu)
  }  );
}

function gpuCreate(name, model, price, manufacturer, chipset, cb) {
  gpudetail = {name: name , model: model, price: price, manufacturer: manufacturer, chipset: chipset};

  var gpu = new GPU(gpudetail);
       
  gpu.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New GPU: ' + gpu);
    gpus.push(gpu)
    cb(null, gpu);
  }   );
}

function cpuInstanceCreate(cpu, serial, cb) {
  cpuinstancedetail = { 
    cpu: cpu,
    serial: serial
  }
    
  var cpuinstance = new CPUinstance(cpuinstancedetail);    
  cpuinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING CPUInstance: ' + cpuinstance);
      cb(err, null)
      return
    }
    console.log('New CPUInstance: ' + cpuinstance);
    cpuinstances.push(cpuinstance)
    cb(null, cpu)
  }  );
}

function gpuInstanceCreate(gpu, serial, cb) {
  gpuinstancedetail = { 
    gpu: gpu,
    serial: serial
  }
    
  var gpuinstance = new GPUinstance(gpuinstancedetail);    
  gpuinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING GPUInstance: ' + gpuinstance);
      cb(err, null)
      return
    }
    console.log('New GPUInstance: ' + gpuinstance);
    gpuinstances.push(gpuinstance)
    cb(null, gpu)
  }  );
}

function createCPUs(cb) {
    async.series([
        function(callback) {
          cpuCreate('Intel I7 12700K', 'BX8071512700K', 449.99, 'Intel', callback);
        },
        function(callback) {
          cpuCreate('Intel I5 12600K', 'BX8071512600K', 319.99, 'Intel', callback);
        },
        function(callback) {
          cpuCreate('AMD Ryzen 5 5600X', '100-100000065BOX', 309.99, 'AMD', callback);
        },
        function(callback) {
          cpuCreate('AMD Ryzen 7 5800X', '100-100000063WOF', 393.99, 'AMD', callback);
        },
        function(callback) {
          cpuCreate('AMD Ryzen 9 5900X', '100-100000061WOF', 524.99, 'AMD', callback);
        },
        ],
        // optional callback
        cb);
}

function createGPUs(cb) {
  async.series([
      function(callback) {
        gpuCreate('GeForce RTX3090 XC3 BLACK GAMING', '24G-P5-3971-KR', 1639.99, 'EVGA', 'Nvidia RTX3090', callback);
      },
      function(callback) {
        gpuCreate('GeForce RTX3080 XC3 BLACK GAMING', '10G-P5-3881-KR', 819.99, 'EVGA', 'Nvidia RTX3080', callback);
      },
      function(callback) {
        gpuCreate('GeForce RTX3070 XC3 BLACK GAMING', '08G-P5-3751-KR', 619.99, 'EVGA', 'Nvidia RTX3070', callback);
      },
      function(callback) {
        gpuCreate('Radeon RX 6900 XT GAMING Z TRIO 16GB', 'RX 6900 XT GAMING Z TRIO 16G', 1899.99, 'MSI', 'AMD 6900XT', callback);
      },
      function(callback) {
        gpuCreate('Radeon RX 6800 XT GAMING Z TRIO 16GB', 'RX 6800 XT GAMING Z TRIO 16G', 1399.99, 'MSI', 'AMD 6800XT', callback);
      },
      function(callback) {
        gpuCreate('Radeon RX 6600 XT GAMING Z TRIO 16GB', 'RX 6600 XT GAMING Z TRIO 16G', 579.99, 'MSI', 'AMD 6600XT', callback);
      },
      ],
      // optional callback
      cb);
}

function createCPUInstances(cb) {
    async.parallel([
        function(callback) {
          cpuInstanceCreate(cpus[0], '285739ERZ', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[1], '281235EQZ', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[2], 'GEDHY3442', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[3], 'GERHY3667', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[3], 'GERHY1234', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[3], 'GERHY1678', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[4], 'GERHQ6Y45', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[4], 'GERHQ6Y46', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[4], 'GERHQ6Y11', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[0], '242739ERZ', callback)
        },
        function(callback) {
          cpuInstanceCreate(cpus[1], '212335EQZ', callback)
        }
        ],
        // Optional callback
        cb);
}

function createGPUInstances(cb) {
  async.parallel([
      function(callback) {
        gpuInstanceCreate(gpus[0], '1235661234', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[1], '1234FGDF23', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[2], '1775HGGHAS', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[5], 'AFHFG45667', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[3], 'ADSCVB2345', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[3], 'RRTYN65533', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[4], 'JYUTY12344', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[5], 'HGHF123456', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[4], 'HJJE885346', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[0], 'ERTT456677', callback)
      },
      function(callback) {
        gpuInstanceCreate(gpus[1], 'FBRE123435', callback)
      }
      ],
      // Optional callback
      cb);
}

async.series([
    createCPUs,
    createGPUs,
    createCPUInstances,
    createGPUInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('CPUInstances: '+cpuinstances.length);
        console.log('GPUInstances: '+gpuinstances.length);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



