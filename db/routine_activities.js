/* eslint-disable no-useless-catch */
const client = require('./client')

async function getRoutineActivityById(id){
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
    try {
      await client.query(
        `
        INSERT INTO routine_activities (routine_id, activity_id, count, duration)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (routine_id, activity_id) DO NOTHING
        RETURNING *;
        `,
        [routineId, activityId, count, duration]
      );
    } catch (error) {
      throw error
    }
  }

async function getRoutineActivitiesByRoutine({id}) {
}

async function updateRoutineActivity ({id, ...fields}) {
}

async function destroyRoutineActivity(id) {
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
