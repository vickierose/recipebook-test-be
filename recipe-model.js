const mongoose = require('mongoose');

const recipeObjSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  description: {
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {_id: false});

const recipeSchema = new mongoose.Schema({
  latest: recipeObjSchema,
  versions: [recipeObjSchema]
});

module.exports = mongoose.model('Recipe', recipeSchema);