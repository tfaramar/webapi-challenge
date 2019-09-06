const express = require('express');
const Project = require('../data/helpers/projectModel.js');
const Action = require('../data/helpers/actionModel.js');

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
            res.status(500).json({ error: "There was an error retrieving the project from the database." })
        });     
});

//put operation should update the project specified by the id and return it, only if the project at that id exists
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    //**how to use destructuring to require either a name or a description in the request body??**
    if (!name && !description) {
        return res.status(400).json({ errorMessage: "Please provide a name and description for the project." });
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
            res.status(500).json({ error: "There was an error deleting the project from the database." })
        });
});

//get actions retrieves list of actions for a specific project
router.get('/:project_id/actions', (req, res) => {
    const { project_id } = req.params;
    Project.get(project_id)
        .then(project => {
            if (project) {
               Project.getProjectActions(project_id)
                .then(actions => res.status(200).json(actions)) 
            } else {
                res.status(404).json({ error: "A project with that id does not exist." })
            }
        })
        .catch (error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while retrieving the actions information." });
        });
});

//post action adds action to specific project based on id. if there is no valid project w/that id it should return an error
router.post('/:project_id/actions', validateAction, (req, res) => {
    const action = req.body;
    Action.insert(action)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while adding the action." });
        });
});

//get action should retrieve an action with the specified id, and belonging to the specified project
router.get('/:project_id/actions/:id', (req, res) => {
    const project_id = req.params.project_id;
    const id = req.params.id;
    Project.get(project_id)
        .then(project => {
            if (project) {
            Action.get(id)
                .then(action => {
                    if (action) {
                        res.status(200).json(action);
                    } else {
                        res.status(404).json({ error: "An action with that id does not exist." })
                    }
                })
            } else {
                res.status(404).json({ error: "A project with that id does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while retrieving the action." });
        });
});

//put action should update action at specified id, only if it exists

//delete action should remove action at specified id only if it exists
router.delete('/:project_id/actions/:id', (req, res) => {
    const project_id = req.params.project_id;
    const id = req.params.id;
    Project.get(project_id)
        .then(project => {
            if (project) {
            Action.remove(id)
                .then(removed => {
                    if (removed) {
                        res.status(200).json(id);
                    } else {
                        res.status(404).json({ error: "An action with that id does not exist." })
                    }
                })
            } else {
                res.status(404).json({ error: "A project with that id does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error deleting the action from the database." })
        });
});

//custom middleware below:
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

function validateAction(req, res, next) {
    const {project_id} = req.params;
    const { description, notes } = req.body;

    if (!description) {
        return res.status(400).json({ error: "An action description is required." })
    }
    if (!notes) {
        return res.status(400).json({ error: "Action notes are required." })
    }
    if (typeof description !== 'string') {
        return res.status(400).json({ error: "Action description must be provided as a string." })
    }
    if (typeof notes !== 'string') {
        return res.status(400).json({ error: "Action notes must be provided as a string." })
    }
    req.body = {project_id, description, notes};
    next();
};

module.exports = router;