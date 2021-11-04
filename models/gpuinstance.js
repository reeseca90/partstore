const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GPUinstanceSchema = new Schema(
  {
    gpu: { type: Schema.Types.ObjectId, ref: 'GPU', required: true },
    serial: { type: String, required: true }
  }
);

GPUinstanceSchema
.virtual('url')
.get(function() {
  return '/inv/gpuinstance/' + this._id;
});

module.exports = mongoose.model('GPUinstance', GPUinstanceSchema);