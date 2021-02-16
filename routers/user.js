const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/user', async (req, res) => {
	const user = new User(req.body)

	try{
		await user.save()
		res.status(201).send(user)
	}catch(e){
		res.status(400).send(e)
	}
})

router.get('/users', async (req, res) => {
	try{
		const users = await User.find({isActive: true})
		res.status(200).send(users)
	}catch(e){
		res.status(404).send(e)
	}
})

router.post('/login', async (req, res) => {
	try{
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send(user)
	}catch(e){
		res.status(400).send(e)
	}
})

module.exports = router