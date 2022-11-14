const express = require('express');
const router = express.Router();
const {getUserByUsername, getUserById} = require('../db')
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function requireUser(req,res,next)  {
if (!req.user){
    res.status(401);
    next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
    });
}

next();
}

//jeremy helped with this
async function checkToken(req, res, next){
    try{

    const authArray = req.headers.authorization.split(" ")
    console.log(authArray[1], "is test array")
    console.log(req.headers, "is headers")
    
    const userId = jwt.verify(authArray[1], JWT_SECRET);
    console.log(userId, "is userID")
    const user = await getUserById(userId.id)
    
    req.user = user
    console.log(user, "is the user")
    if (user == undefined)  {
        res.status(401).send({
            error: "issue with token authorization"
        })
    }
    next();
} catch{
    console.error(
        error.details
    )
}
}

const auth = async (req, res, next) => {
    const { username, password } = req.body;
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && user.password == password) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET
        );
        const userData = jwt.verify(token, JWT_SECRET);
        res.send({ user, message: "you're logged in!", token });
        return userData;
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
      return user;
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
    


module.exports =    {
    requireUser, auth, checkToken
}