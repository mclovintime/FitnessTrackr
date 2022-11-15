const express = require('express');
const { getActivityById, updateActivity, updateRoutine, deleteActivity, getRoutineById } = require('../db');
const routineActivitiesRouter = express.Router();
const { requireUser, checkToken } = require('./utils');

// PATCH /api/routine_activities/:routineActivityId

// routineActivitiesRouter.patch('/:routineActivityId', express, async(req,res,next) => {
// console.log(req.body, "testing req body")

// try{

//     const returnedUpdatedActivity = updateRoutineActivity({id: })

//     res.send()
// } catch (error) {
//     throw error;
// }

// })



///////////////////STILL NEED TO FINISH THESE TWO/////////////

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete('./:activityId', express, async(req, res, next)=>{
    const activity_Id=req.params.activityId
    // console.log(activity_Id, "i am activity id");

    try{
        const activityToDelete = await getActivityById(activity_Id)

        if(activityToDelete.creator.id===req.user.id){
            const returnedActivity = await deleteActivity(activity_Id)
            console.log(returnedActivity, "i am returned activity")
            res.send({"activity": returnedActivity})
        }else{
            next({
                name: 'UnauthorizedUserError',
                message: 'You cannot delete a post that is not yours'
            })
        }
    }catch({name, message}){
        next({name, message})
    }
})

module.exports = routineActivitiesRouter;
