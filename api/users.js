const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getPublicRoutinesByUser, getAllRoutinesByUser } = require("../db/routines.js");
const { createUser, getUserByUsername, } = require("../db/users.js");
const { JWT_SECRET } = process.env;
// const { token } = require("morgan");
const { requireUser, auth , checkToken} = require("./utils");

// POST /api/users/login

usersRouter.post("/login", auth);

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (password.length < 8) {
      next({
        name: "PasswordLengthError",
        message: "Password Too Short!",
        error: "error",
      });
    }

    if (_user) {
      next({
        name: "duplicateUser",
        message: `User ${username} is already taken.`,
        error: "error",
      });
    } else {
      const user = await createUser({
        username,
        password,
      });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "Thanks for signing up",
        token,
        user,
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/users/me

usersRouter.get("/me", checkToken, requireUser, async (req, res, next) => {
  try {
    if (req.user) {
      res.send(req.user);
    } else {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action",
        error: "MissingUserError",
      });
    }
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async(req, res, next) => {
  try {
    const username = req.params;
    const routines = await getPublicRoutinesByUser(username);
    res.send(routines)
  } catch ({ name, message, error }) {
    next({ name, message, error });
  }
}) 




module.exports = usersRouter;

