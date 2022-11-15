const express = require("express");
const { getAllRoutines, createRoutine, updateRoutine } = require("../db");
const { checkToken, requireUser } = require("./utils");
const router = express.Router();

// GET /api/routines

router.get("/", async (req, res) => {
  const routines = await getAllRoutines();
  res.send(routines);
});

// POST /api/routines
router.post("/", checkToken, requireUser, async (req, res, next) => {
  const userId = req.user.id;
  const { isPublic, name, goal } = req.body;

  try {
    const newRoutine = await createRoutine({
      creatorId: userId,
      isPublic: isPublic,
      name: name,
      goal: goal,
    });

    res.send(newRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", checkToken, requireUser, async (req, res, next) => {
  routineId = req.params.routineId;
  reqUsername = req.user.username;
  

  // const{isPublic, name, goal}=req.body
  fields = {
    isPublic: req.body.isPublic,
    name: req.body.name,
    goal: req.body.goal,
  };

  try {
    const updatedRoutineHere = await updateRoutine({
      id: routineId,
      fields: fields,
      usersId: req.user.id,
      usersName: req.user.username,
      trueRoutine: req.body.name,
    });

    
    if (updatedRoutineHere.error) {
    //   console.log("we've caught an error");
      res.status(403);
      const errorResponse = {
        error: "ERROR",
      };
      next(errorResponse);
    }

    res.send(updatedRoutineHere);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
