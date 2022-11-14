const express = require('express');
const {getAllActivities, getActivityById, attachActivitiesToRoutines, createActivity, getActivityByName} = require("../db");
const activitiesRouter = express.Router();


// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next)=>{
    
    const activityId = req.params.activityId
    console.log('activity Id', activityId)
    try{
        const returnedRoutines = await getActivityById(activityId);

        res.send({
            activities: returnedRoutines
        })
    }catch ({name, message}){
        next({name, message})
    }
})


// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
    const allActivities = req.params.allActivities
    try{
        const returnedActivities = await getAllActivities(allActivities);
        
       
        res.send(
            returnedActivities
    )
    }catch ({name, message}){
        next({name, message})
    }
})
       

// POST /api/activities
activitiesRouter.post('/', async (req, res, next) => {
    try{
       const{name, description} = req.body
       const returnedName = await getActivityByName(name)
       if (returnedName.name == name)   {
        next({
            error: "This is all wrong",
            message: `An activity with name ${name} already exists`,
            name: "This is all wrong"
        })
       }
       
       if (returnedName.name !== name)   {
           console.log(newActivity, "efg")
       const newActivity = await createActivity({name, description})
       
        res.send({newActivity})
        }
        
    }catch ({name, message}){
        next({name, message})
    }
})

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
