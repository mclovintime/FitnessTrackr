const express = require('express');
const { request } = require('../app');
const {getAllActivities} = require("../db");
const { UserDoesNotExistError } = require('../errors');
const activitiesRouter = express.Router();


// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next)=>{
    const activityId = req.params.activityId
    console.log('activity Id', activityId)
    try{
        const returnedRoutines = await getAllActivities(activityId);
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
    /////////// THIS ONE IS BASICALLY DONE, BUT I'M NOT SURE HOW TO RETURN JUST THE ARRAY WITH THE OBJECT, CHECK THE TEST OUTPUT, ITS ALMOST IDENTICAL//////////////
    try{
        const returnedActivities = await getAllActivities(allActivities);
        res.send({
            returnedActivities
        })
    }catch ({name, message}){
        next({name, message})
    }
})
       

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
