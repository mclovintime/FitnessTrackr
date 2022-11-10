const express = require('express');
const { getUserByUsername, createUser } = require('../db');
const router = express.Router();

// POST /api/users/login


// POST /api/users/register

router.post("/api/users/register", async (req, res, next) =>  {
    console.log("this is a big ol test")
    const   {username, password} = req.body;
    try {
const user = await getUserByUsername(username);

if (password.length < 8)    {
    next({
        message: "Password must be 8 characters or longer",
        name: "Password error"
    });
}

if (user)   {
    next({
        name: "UserExistsError",
        message: "This user already exists",
    });
}

const newUser = await createUser({
    username,
    password
});
console.log(newUser, "this is new user")

res.send({newUser})

return newUser;

    } catch (error){
throw error
    }
})

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
