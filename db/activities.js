const client = require("./client")

// database functions
async function getAllActivities() {

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
  
}

async function getActivityByName(name) {

}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {

try{
  const{
    rows: [activity],
  } = await client.query(
    `
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]
  );
  return activity;
} catch (error) {
  throw error;
}
  }




// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
