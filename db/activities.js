/* eslint-disable no-useless-catch */
const { addListener } = require("nodemon");
const client = require("./client")

// database functions
async function getAllActivities() {
  console.log("testing to see if there's anything here")

  try {
    const{
      rows: activities
    } = await client.query(`
    SELECT * 
    FROM activities;
    `);


    return activities;
    } catch(error) {
      throw error;
  }
}



async function getActivityById(id) {
  try {
    const {
      rows: [activity]
    } = await client.query(`
    SELECT name, description, id FROM activities
    WHERE id=${id}
    `);

    return activity;
  } catch (error) {
    throw error;
  }
  }


async function getActivityByName(name) {
  try {
    const {
      rows: [activity]
    } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1
    `, [name]);

   if (activity == undefined) {
    return {error: "undefined activity from getactivitybyname"}
   }
   
    console.log(activity, "is getactivitybyname h")
    return activity;
  } catch (error) {
    console.error(error);
  }
}

// select and return an array of all activities

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}

// return the new activity
async function createActivity({ name, description }) {
// console.log(name, description, "testing createAct")
try {
  const {
    rows: [activity]
  } = await client.query(
    `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]
  );
  
 

  return activity;

  // return activity;
} catch (error) {
  console.error(error);
}
  }




// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {
if (fields.name)  {
  try {
    const {
        rows: [updatedActivity],
    } = await client.query(`
UPDATE activities 
SET name=$1
WHERE id=$2
RETURNING *
`, [fields.name, id]);
// console.log(fields.name, updatedActivity, "THIS IS UPDATED ACTIVITY")
if (updatedActivity == undefined) {
  return {error: "undefined activity from updateActivity"}
}
return updatedActivity;
} catch (error) {
throw error;
}
  }

  if (fields.description)  {
    try {
      const {
          rows: [updatedActivity],
      } = await client.query(`
  UPDATE activities 
  SET description=$1
  WHERE id=$2
  RETURNING *
  `, [fields.description, id]);
  // console.log(fields.description, updatedActivity, "THIS IS UPDATED ACTIVITY")
  
  return updatedActivity;
  } catch (error) {
  throw error;
  }
    }
}





module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
