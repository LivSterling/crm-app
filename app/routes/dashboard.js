  const express = require('express')
const router = express.Router()
const Client = require('../models/client')

// Middleware to protect the dashboard, this will push someone back to login of they arnt already
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

// Dashboard routes ===============================================================
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.user })
})

// Clients routes ===============================================================

// GET(read) /clients - List all clients for the logged-in user 
router.get('/clients', isLoggedIn, async (req, res) => {
    try {
      const clients = await Client.find({ userId: req.user._id })
      res.render('clients', { user: req.user, clients: clients })
    } catch (err) {
      console.log(err)  
      res.redirect('/dashboard')
    }
  })

  router.post('/clients', isLoggedIn, async (req, res) => {//this Sets up a POST(Create). we making it aysc so we can set up an await bellow
    try { //were gonna use a try block so it runs. good data or bad
      const { name, company, email, phone, notes } = req.body //pulling all at the same time instead of one by one/saves time and key strokes
  
      await Client.create({// create a new log in mongdb. were making it await so it...... awaits untilll its done
        userId: req.user._id,
        name,
        company,
        email,
        phone,
        notes,
      })
  
      res.redirect('/clients')// refresh page
    } catch (err) {
      console.log(err)
      res.redirect('/clients')// bad thing happen
    }
  })

 // GET(read )/clients/:id - View a single client's details
router.get('/clients/:id', isLoggedIn, async (req, res) => {
    try {//were gonna use a try block so it runs. good data or bad
      const client = await Client.findOne({ 
        _id: req.params.id, //pilling the id part
        userId: req.user._id 
      })// looking for a client by an id then we'll check if belongs to the current user
  
      if (!client) {
        return res.redirect('/clients') // if no matching client go back
      }
  
      res.render('clientdetails', { user: req.user, client: client })// if match it renders a new client page
    } catch (err) {
      console.log(err)
      res.redirect('/clients')// bad thing happen again
    }
  })

  router.post('/clients/:id/update', isLoggedIn, async (req, res) => {
    try {
      const { name, company, email, phone, notes } = req.body //pulling all at the same time instead of one by one/saves time and key strokes
  
      await Client.findOneAndUpdate( //same as last time but now its updating a log
        { _id: req.params.id, userId: req.user._id },
        { name, company, email, phone, notes }
      )
  
      res.status(200).json({ message: 'Client updated' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error updating client' })
    }
  })

  // POST /clients/:id/delete - Delete a client
router.post('/clients/:id/delete', isLoggedIn, async (req, res) => { // had to use a POST here because I couldnt get the delete to play nice with the form
    try {
      await Client.findOneAndDelete({ _id: req.params.id, userId: req.user._id }) //this double checks the client and user ID so somebody else client doesnt get deleted by mistake
      res.status(200).json({ message: 'Client deleted' })
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error deleting client' })
    }
  })

module.exports = router