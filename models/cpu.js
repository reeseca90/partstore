const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CPUSchema = new Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    manufacturer: { type: String, required: true, enum: ['AMD', 'Intel'] }
  }
);

CPUSchema
.virtual('inStock')
// code to count number of child CPU instances here


CPUSchema
.virtual('url')
.get(function() {
  return '/inv/cpu/' + this._id;
});

module.exports = mongoose.model('CPU', CPUSchema);