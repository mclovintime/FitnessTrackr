/* eslint-disable no-useless-catch */
const { set } = require("../app");
const { UserDoesNotExistError } = require("../errors");
const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function getRoutineById() {
  try {
    const {
      rows: [routine],
    } = await client.query(`
    SELECT routine
    FROM routines
    WHERE id = $1`);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
      SELECT *
      FROM activities;
    `);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    ;`);
    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE username=$1;`,
      [username]
    );
    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"= true;`);
    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
    ////// not sure we're getting public routines by user on this one
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"=true;`);
    const routinesWithActivities = await attachActivitiesToRoutines(rows);
    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"=true;`);
    const routinesWithActivities = await attachActivitiesToRoutines(rows);

    return routinesWithActivities;
  } catch (error) {
    throw error;
  }
}

// it seems that createRoutine's test is not passing, but the rest of the tests which
// rely on it seem to be working fine

async function createRoutine({ creatorId, isPublic, name, goal }) {
  if (isPublic !== undefined && name !== undefined && goal !== undefined) {
    try {
      const {
        rows: [routine],
      } = await client.query(
        `
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
      `,
        [creatorId, isPublic, name, goal]
      );

      return routine;
    } catch (error) {
      throw error;
    }
  }
}

async function updateRoutine({ id, fields, usersId, usersName, trueRoutine }) {
  let updatedRoutineReturn = {};

  // console.log(usersId, "userId from req.users")

  if (id) {
    try {
      const {
        rows: [testingthis],
      } = await client.query(
        `
      SELECT "creatorId", name
    FROM routines
    WHERE id = $1
      `,
        [id]
      );
      // console.log(testingthis.creatorId, "creatorid from query")

      if (testingthis.creatorId !== usersId) {
        res.status(403)
        res.send({
          
          error: "ERROR",
          message: `User ${usersName} is not allowed to update ${testingthis.name}`,
          name: "Update request denied!"
        })
        return 
      }
    } catch (error) {
      
      throw res.status(403);
    }
  }

  if (fields.name) {
    try {
      const {
        rows: [updatedRoutine],
      } = await client.query(
        `
  UPDATE routines 
  SET name=$1
  WHERE id=$2
  RETURNING *
  `,
        [fields.name, id]
      );

      // console.log(fields.name, updatedActivity, "THIS IS UPDATED ACTIVITY")
      updatedRoutineReturn = updatedRoutine;
    } catch (error) {
      throw error;
    }
  }

  if (fields.goal) {
    try {
      const {
        rows: [updatedRoutine],
      } = await client.query(
        `
    UPDATE routines 
    SET goal=$1
    WHERE id=$2
    RETURNING *
    `,
        [fields.goal, id]
      );

      updatedRoutineReturn = updatedRoutine;
    } catch (error) {
      throw error;
    }
  }

  if (fields.isPublic == true || fields.isPublic == false) {
    try {
      const {
        rows: [updatedRoutine],
      } = await client.query(
        `
      UPDATE routines 
      SET "isPublic"=$1
      WHERE id=$2
      RETURNING *
      `,
        [fields.isPublic, id]
      );
      // console.log(fields.description, updatedActivity, "THIS IS UPDATED ACTIVITY")
      updatedRoutineReturn = updatedRoutine;
    } catch (error) {
      throw error;
    }
  }
  return updatedRoutineReturn;
}



async function destroyRoutine(id, reqUser, reqUsername) {
  let goodToGo = true
  let toBeReturned = {}
  console.log(id, "testing id of routine")
  console.log(reqUser, "testing reqUser")
// getting the destroyed routine to be returned
  try {
    const {
      rows: [testingthis],
    } = await client.query(
      `
    SELECT *
  FROM routines
  WHERE id = $1
    `,
      [id]
    );
    console.log(testingthis.creatorId, " is creator id from query")
    console.log(reqUser, "testing reqUser")

    if (testingthis.creatorId !== reqUser) {
      console.log("error caught in db!")
      goodToGo = false
      return {
        error: "ERROR",
        message: `User ${reqUsername} is not allowed to delete ${testingthis.name}`,
        name: "Denied delete request"
      };
    } 

    // console.log(testingthis, "output from query")
 toBeReturned = testingthis
 

  } catch (error) {
    throw error;
  }
 
if (goodToGo) {
  try {
    const {
      rows: [bingbong],
    } = await client.query(`
      DELETE FROM routine_activities
      WHERE "routineId"=${id}
      ;
      `);
  } catch (error) {
    throw error;
  }
  try {
    const {
      rows: [placeholder],
    } = await client.query(
      `
        DELETE FROM routines 
        WHERE id=${id}
        ;
        `
    );
    
    return(toBeReturned)
  } catch (error) {
    throw error;
  }
}
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
