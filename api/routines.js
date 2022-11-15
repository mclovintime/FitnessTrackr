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
router.post('/', async (req, res, next)=>{
    const userId=''
    console.log(req.body, "testing testing")
    const{isPublic, name, goal}=req.body
    console.log(req.body.name, "working on this")
    try{
        const newRoutine= await createRoutine({userId, isPublic, name, goal})
    }catch({name, message}){
        next({name, message})
    }
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
