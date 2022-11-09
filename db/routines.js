/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require('./activities');
const client = require('./client');

async function getRoutineById(){
  try {
    const{
    rows: [routine]
    } = await client.query(`
    SELECT routine
    FROM routines
    WHERE id = $1`);
    return routine;
  }catch(error){
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try {
    const { rows: routines } = await client.query(`
      SELECT *
      FROM activities;
    `);
    return routines;
  }catch (error){
    throw error;
  }
}

async function getAllRoutines() {
   try {
    const {rows } = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    ;`);
    const routinesWithActivities = await attachActivitiesToRoutines(rows)
    return routinesWithActivities;

   } catch (error) {
    throw error;
   }
}

async function getAllRoutinesByUser({username}) {
  try{
    const{rows} = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE username=$1;`,[username])
    const routinesWithActivities= await attachActivitiesToRoutines(rows)
    return routinesWithActivities;
  }catch(error){
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
  try{
    const{rows}=await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"= true;`)
    const routinesWithActivities= await attachActivitiesToRoutines(rows)
    return routinesWithActivities;
    ////// not sure we're getting public routines by user on this one
  }catch(error){
    throw error;
  }
}

async function getAllPublicRoutines() {
  try{
    const{rows} = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"=true;`)
    const routinesWithActivities= await attachActivitiesToRoutines(rows)
    return routinesWithActivities;
  }catch (error){
    throw error;
  }
}

async function getPublicRoutinesByActivity({id}) {
  try{
    const{rows} = await client.query(`
    SELECT routines.* , users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE "isPublic"=true;`)
    const routinesWithActivities= await attachActivitiesToRoutines(rows)
    return routinesWithActivities;
  }catch (error){
    throw error;
  }

}

async function createRoutine({creatorId, isPublic, name, goal}) {

  try{
    const{
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
      `, [creatorId, isPublic, name, goal]
    );
    return routine;
  }catch(error){
    throw(error);
  }
}
  


async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
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
}