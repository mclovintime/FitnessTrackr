/* eslint-disable no-useless-catch */
const client = require('./client')

async function getRoutineActivityById(id){

  try{
    const{
      rows: [routineactivity]
    } = await client.query(`
    SELECT * FROM routine_activities
    WHERE id=${id};`)
  
  return routineactivity;
}catch(error) {
  throw error;
}
}


async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  
    try {
      const{
        rows: [routineActivity]
      } = await client.query(
        `
        INSERT INTO routine_activities ("routineId", "activityId", "count", "duration")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("routineId", "activityId") DO NOTHING
        RETURNING *;
        `,  [routineId, activityId, count, duration]
      );
      return routineActivity;
    } catch (error) {
      throw error
    }
  }

async function getRoutineActivitiesByRoutine({id}) {
  console.log(id, "this is waht is passed to routineactivitiesbyroutine")
  try{
    const{
      rows
    } = await client.query(`
    SELECT * FROM routine_activities
    WHERE "routineId"=$1
    ;
    `, [id]);
  console.log(rows, "this is the routineactivity you")
  return rows;
}catch(error) {
  throw error;
}
}

async function updateRoutineActivity ({id, ...fields}) {
  if (fields.duration)  {
    try {
      const {
          rows: [updatedRoutineActivity],
      } = await client.query(`
  UPDATE routine_activities 
  SET duration=$1
  WHERE id=$2
  RETURNING *
  `, [fields.duration, id]);
  
  
  } catch (error) {
  throw error;
  }
    }

    if (fields.count)  {
      try {
        const {
            rows: [updatedRoutineActivity],
        } = await client.query(`
    UPDATE routine_activities 
    SET count=$1
    WHERE id=$2
    RETURNING *
    `, [fields.count, id]);
   
    return updatedRoutineActivity;
    } catch (error) {
    throw error;
    }
      }
}

async function destroyRoutineActivity(id) {
  
  try{
    const{
      rows: [nill],
    } = await client.query(`
      DELETE FROM routine_activities
      WHERE id=${id}
      RETURNING *
      ;
      `,
      );
    return nill;
    } catch (error) {
      throw error;
    }
}

async function canEditRoutineActivity(routineActivityId, userId) {

  try{
    const{
      rows: [routine]
    } = await client.query(`
      SELECT routines.* FROM routine_activities 
      JOIN routines ON routine_activities."routineId" = routines.id
      WHERE routine_activities.id=$1
      ;
      `,[routineActivityId]
      );
    return routine.creatorId == userId
      
    
    } catch (error) {
      throw error;
    }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
