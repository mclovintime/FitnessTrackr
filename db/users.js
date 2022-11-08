/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {

  try{
    const{
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
      `, [username, password]
    );
    // console.log(user.username, "this is the user test")
    delete user.password;
    return user;
  }catch (error){
    throw error;
  }
  }

// still workin on this one
async function getUser({ username, password }) {
  try {
    const {
        rows: [user],
    } = await client.query(`
    SELECT id, username, password FROM users
    WHERE username=$1;
    `, [username]);
  


    if (user.password===password){
      delete user.password
      console.log(user, "This is get user test")
      return user;
    }

    }catch (error){
    throw error;
  }
  }

async function getUserById(userId) {
try {
        const {
            rows: [user],
        } = await client.query(`
    SELECT id, username FROM users
        WHERE id=${userId};
    `);
    
return user;
} catch (error) {
  throw error;
}
}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
