const express = require('express');
const Project = require('../data/helpers/projectModel.js');
const router = express.Router();

//get operation should return an array of all projects
router.get('/', (req, res) => {
    Project.get()
        .then(projects => res.status(200).json(projects))
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The projects could not be retrieved." })
        });
});

//post operation should make sure that the posted data contains both a name and a description, and that each of those are strings
router.post('/', validateProject, (req, res) => {
    const project = req.body;
    Project.insert(project)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(error => {
            res.status(500).json({ error: "The project could not be added." })
        });
});

router.get('/:id', (req, res) => {

})

router.put('/:id', (req, res) => {

})

router.delete('/:id', (req, res) => {

})

//custom middleware
function validateProject(req, res, next) {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: "A name is required." })
    }
    if (!description) {
        return res.status(400).json({ error: "A description is required." })
    }
    if (typeof name !== 'string') {
        return res.status(400).json({ error: "Name must be provided as a string." })
    }
    if (typeof description !== 'string') {
        return res.status(400).json({ error: "Description must be provided as a string." })
    }
    next();
};

module.exports = router;