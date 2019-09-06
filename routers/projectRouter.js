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

//get operation should fetch the project with the req id, only if it exists
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    Project.get(id)
        .then(project => {
            if (project) {
                res.status(200).json(project);
            } else {
                res.status(404).json({ error: "A project with that id does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error retrieving the post from the database." })
        });     
});

//put operation should update the project specified by the id and return it, only if the project at that id exists
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    //**how to use destructuring to require either a name or a description in the request body??**
    if (!name && !description) {
        return res.status(400).json({ errorMessage: "Please provide a name and description for the post." });
    }
    Project.update(id, { name, description })
        .then(updated => {
            if (updated) {
                Project.get(id)
                    .then(project => {
                        //console.log(project);
                        if (project) {
                            res.status(200).json(project);
                        } else {
                            res.status(404).json({ message: "A project with that id does not exist." });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({ error: "There was an error retrieving the project from the database." });
                    })
            } else {
                res.status(404).json({ message: "A project with that id does not exist." });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while updating the project to the database." });
        });
});

//delete operation should delete the project at that id, only if it exists
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Project.remove(id)
        .then(removed => {
            //console.log(removed);
            if (removed) {
                res.status(200).json(id);
            } else {
                res.status(404).json({ error: "A project with that id does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error deleting the post from the database." })
        });
});

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