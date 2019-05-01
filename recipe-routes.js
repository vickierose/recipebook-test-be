const express = require('express');
const router = express.Router();

const Recipe = require('./recipe-model');

router.get('/', (req, res) => {
  Recipe.find({}, '_id latest').sort({'latest.createdAt': -1}).lean().exec((err, recipes) => {
    if(err) res.send(err);
    res.json(recipes);
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

  newRecipe.save().then(() => {
    Recipe.find({}, '_id latest').sort({'latest.createdAt': -1}).lean().exec((err, recipes) => {
      if(err) res.send(err);
      res.json(recipes);
    })
  })
  .catch(err => console.log(err))
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
    {
      $push: {versions: {$each: [versionData], $sort: {createdAt: -1}}},
      $set: {latest: versionData}
    },
    {"new": true}).exec((err, recipe) => {
      if(err) res.send(err);
      res.send(recipe);
  });
})

module.exports = router;