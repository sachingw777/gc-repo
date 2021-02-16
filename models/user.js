const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique:true,
		trim: true
	},
	password:{
		type: String,
		required: true,
		minLength: 4,
		trim: true
	},
	firstName: {
		type: String,
		required: true,
		trim: true
	},
	lastName: {
		type: String,
		required: true,
		trim: true
	},
	mobile: {
		type: Number,
		required: true,
		trim: true 
	},
	isActive: {
		type: Boolean,
		required: true
	},
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})

userSchema.pre('save', async function(next) {
	if(this.isModified('password')){
		this.password = await bcrypt.hash(this.password, 8)
	}
	next()
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    return {
    	username: userObject.username, 
    	isActive: userObject.isActive
    }
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user || !user.isActive) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

const User = mongoose.model('User', userSchema)
module.exports = User