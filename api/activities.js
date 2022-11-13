const express = require('express');
const {getAllActivities} = require("../db")
const activitiesRouter = express.Router();


// GET /api/activities/:activityId/routines


// GET /api/activities
activitiesRouter.get('/activities', async (req, res, next) => {
    
   
    try{
        const allActivities = await getAllActivities()
        console.log(allActivities, "all activities")
res.send(allActivities)


    }catch ({name, message}) {
        next({name, message})
    }

})

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
