const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a name."],
        maxlength: [50, "Name cannot be more than 50 characters."],
        minlength: [2, "Name must be at least 2 characters."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please provide a valid email.",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 charachters long."],
        maxlength: [100, "Password cannot be longer than 100 characters."],
        match: [
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
          "Password must be 6 characters long, contain a lower and uppercase letter and a number",
        ],
  },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      default: []
    },
  ],  
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
})

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

UserSchema.methods.getJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
        }
    )
}
  
UserSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}

UserSchema.pre('remove', async function (next) {
  await this.model('Comment').deleteMany({ creator: this._id })
  await this.model('Like').deleteMany({ creator: this._id })
  await this.mode('Post').deleteMany({ creator: this._id })
  await this.model('FriendRequest').deleteMany({ $or: [{creator: this._id}, {invitee: this._id }]})
  next()
})
  
UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

UserSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

UserSchema.virtual('sentrequests', {
  ref: 'FriendRequest',
  localField: '_id',
  foreignField: 'creator',
  justOne: false
})

UserSchema.virtual('receivedrequests', {
  ref: 'FriendRequest',
  localField: '_id',
  foreignField: 'invitee',
  justOne: false
})

const User = model('User', UserSchema)
module.exports = User