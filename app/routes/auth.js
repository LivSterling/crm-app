const express = require('express')
const passport = require('passport')
const User = require('../models/user')

const router = express.Router()

// Show registration form
router.get('/signup', (req, res) => {
  res.render('signup') // Make a signup.ejs file
})

// this creates(posts) a user zignup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body
    const newUser = new User({ username, email })
    await User.register(newUser, password) // This comes from passport-local-mongoose
    res.redirect('/login')
  } catch (err) {
    console.log(err)
    res.redirect('/signup')
  }
})

// this reads(gets) the log in form
router.get('/login', (req, res) => {
  res.render('login') // Make a login.ejs file
})

// Handle login logic
router.post('/login',passport.authenticate('local', {
    successRedirect: '/dashboard', // or wherever you want to redirect after login
    failureRedirect: '/login',
  })
)

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

module.exports = router
