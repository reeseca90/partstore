const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CPUinstanceSchema = new Schema(
  {
    cpu: { type: Schema.Types.ObjectId, ref: 'CPU', required: true },
    serial: { type: String, required: true }
  }
);

CPUinstanceSchema
.virtual('url')
.get(function() {
  return '/inv/cpuinstance/' + this._id;
});

module.exports = mongoose.model('CPUinstance', CPUinstanceSchema);