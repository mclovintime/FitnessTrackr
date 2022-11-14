const e = require('express');
const express = require('express');
const {getAllActivities, getActivityById, attachActivitiesToRoutines, createActivity, getActivityByName, updateActivity} = require("../db");
const activitiesRouter = express.Router();


// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next)=>{
    
    const activityId = req.params.activityId
    // console.log('activity Id', activityId)
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
    //    console.log(returnedName, "is returned name")
       
      if (returnedName) {

       if (returnedName.name == name)   {
        next({
            error: "This is all wrong",
            message: `An activity with name ${name} already exists`,
            name: "This is all wrong"
        })
       }

    else    {
    console.log(name, description, "123")
       const createdActivity = await createActivity({name, description})
       const activity = await getActivityByName(name)
    //    console.log(activity, "is activity")
      
        res.send(createdActivity)
    }
}   else    {
    next({error: "no activity found by this name",
        message: "no activity by this name fam",
        name: "undefined error"})
}
    
    }catch (error){
        // console.log(error, "the error here")
        next({name: error.name})
    }
})

// PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId', async (req, res, next) => {
    const activityId = req.params.activityId
    const {name, description} = req.body

    try{
        const testingDoesExist = await getActivityByName(name)
        console.log(testingDoesExist, "testing does exist")
//IF TESTINGDOESEXIST RETURNS AN ERROR, TAKE CARE OF IT
        if (!testingDoesExist)  {
            console.log("we've caught an error")
        }

        console.log(description, name, "is description to be added plus name")
        const updatedActivity = await updateActivity({id: activityId, description})
        const updatedActivity2 = await updateActivity({id: activityId, name})
        res.send(
           updatedActivity2
    )
    }catch ({name, message}){
        next({name, message})
    }
})

module.exports = activitiesRouter;
