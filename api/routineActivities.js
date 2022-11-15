const express = require('express');
const { getActivityById, updateActivity, updateRoutine, deleteActivity, getRoutineById } = require('../db');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineId')


// DELETE /api/routine_activities/:routineActivityId

router.delete('/:activityId', express, async(req, res, next)=>{
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

module.exports = router;
