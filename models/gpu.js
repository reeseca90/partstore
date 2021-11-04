const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GPUSchema = new Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    chipset: { type: String, required: true}
  }
);

GPUSchema
.virtual('inStock')
// code to count number of child GPU instances here


GPUSchema
.virtual('url')
.get(function() {
  return '/inv/gpu/' + this._id;
});

module.exports = mongoose.model('GPU', GPUSchema);