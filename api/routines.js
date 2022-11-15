const express = require('express');
const { getAllRoutines, createRoutine } = require('../db');
const { checkToken } = require('./utils');
const router = express.Router();

// GET /api/routines

router.get('/', async(req, res)=>{
    const routines = await getAllRoutines()
    res.send(routines)
})
// POST /api/routines
router.post('./:routines', async (req, res, next)=>{
    try{
        const{name} = req.body
        const newActivity = await createRoutine(name)
        if (newActivity){
            if(newActivity.name == name){
                next({
                    error: "error",
                    message: `A routine with name ${name} already exists`
                })
            }
        }
    }catch (error){
        console.error(error)
    }
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
