/* eslint-disable no-useless-catch */
const express = require('express');
const { getUserByUsername, createUser } = require('../db');
const router = express.Router();
const jwt = require("jsonwebtoken");
router.use((req, res, next)=>{
    console.log("A request has been made to /users");
    next();
})
// POST /api/users/login


// POST /api/users/register


router.post('/register', async (req, res, next) => {
    const{username, password}= req.body;

    try{
        const userObj = await getUserByUsername(username)
        if (userObj){
            next({
                name:'UserExistsError',
                message:'A user by that username already exists'
            })
        }
        const newUser = await createUser({
            username: username, 
            password: password, 
        })
        const token = jwt.sign(
            newUser, 
            process.env.JWT_SECRET, 
        )
        res.send({
            message: "thank you for signing up",
            token: token,
            user: {id:newUser.id,
                 username: newUser.username},
         
        })
    }catch ({name, message}) {
        next({name, message})
    }

})

//     if (password.length < 8){
//     next({
//         name: "Password error",
//         message: "Password must be 8 characters or longer"
//     });
// }

// if (user)   {
//     next({
//         name: "UserExistsError",
//         message: "This user already exists",
//     });
// }

// const newUser = await createUser({
//     username,
//     password
// });
// console.log(newUser, "this is new user")

// res.send({newUser})

// return newUser;

//     } catch (error){
// throw error
//     }


// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
