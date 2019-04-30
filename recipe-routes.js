const express = require('express');
const router = express.Router();

const Recipe = require('./recipe-model');

router.get('/', (req, res) => {
  Recipe.find({}, '_id latest').sort({'latest.createdAt': -1}).exec((err, recipes) => {
    if(err) res.send(err);
    res.send(recipes);
  })
});

router.post('/', (req, res) => {
  const versionData = {
    name: req.body.name,
    description: req.body.description,
    createdAt: new Date(Date.now()).toISOString()
  };

  const newRecipe = new Recipe({
    latest: versionData,
    versions: [versionData]
  });

  newRecipe.save((err, recipe) => {
    if (err) res.send(err); 
    res.send(recipe);
  });
});

router.get('/:id', (req, res) => {
  Recipe.findById(req.params.id).exec((err, recipe) => {
    if(err) res.send(err);
    res.send(recipe);
  })
});

router.put('/:id', (req, res) => {
  
  const versionData = {
    name: req.body.name,
    description: req.body.description,
    createdAt: new Date(Date.now()).toISOString()
  };

  Recipe.findByIdAndUpdate(
    req.params.id,
    {$push: {versions: versionData}, $set: {latest: versionData}},
    {"new": true}).exec((err, recipe) => {
      if(err) res.send(err);
      res.send(recipe);
  });
})

module.exports = router;