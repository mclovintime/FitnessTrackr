const e = require('express');
const express = require('express');
const {getAllActivities, getActivityById, attachActivitiesToRoutines, createActivity, getActivityByName, updateActivity} = require("../db");
const { requireUser, checkToken } = require('./utils');
const activitiesRouter = express.Router();


// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', checkToken, requireUser, async (req, res, next)=>{
    
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

//BELOW IS WHAT JENNY SEND AS SOLUTION TO ABOVE
// activitiesRouter.get("/:activityId/routines", async(req, res, next) => {
//   const { activityId } = req.params;
//   try {
//       const activity = await getActivityById(activityId)
//       if (!activity) {
//           next({
//               name: "ActivityNotFoundError",
//               message: Activity ${activityId} not found,
//               error: "ActivityNotFoundError"
//           });
//       }
//       else {
//           const publicRoutines = await getPublicRoutinesByActivity(activity)
//           res.send(publicRoutines)
//       }

//   }  catch ({ name, message, error }) {
//           next({ name, message, error });
//           }
// })


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
activitiesRouter.post('/', checkToken, requireUser, async (req, res, next) => {
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
   
      }  
        const createdActivity = await createActivity({name, description})
       
        res.send(createdActivity)

    }catch (error){
        // console.log(error, "the error here")
        next({name: error.name})
    }
})

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", checkToken, requireUser, async (req, res, next) => {
    const { activityId: id } = req.params;
    const fields = req.body;
    console.log(fields, "this is fields")
    // const activity = await getActivityById(id)
    try {
      const activityWithId = await getActivityById(id);
      if (!activityWithId) {
        next({
          error: "Activity Does Not Exist",
          name: "Activity Does Not Exist",
          message: `Activity ${id} not found`,
        });
      }
      const activityWithName = await getActivityByName(fields.name);
      if (activityWithName) {
        console.log(activityWithName, "with name")
        next({
          error: "Activity Does Not Exist",
          name: "Activity Does Not Exist",
          message: `An activity with name ${fields.name} already exists`,
        });
      }
      // console.log("hello", fields)
      const updatedActivity = await updateActivity({ id, ...fields });
  
      res.send(updatedActivity);
    } catch (error) {
      console.error(error.detail);
    }
  });

module.exports = activitiesRouter;
