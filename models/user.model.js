const { Schema, model } = require('mongoose')
const UserSchema = new Schema({
  firstname: { type: String, required: true, maxlength: 50 },
  lastname: { type: String, required: true, maxlength: 50 },
  username: { type: String, required: true, maxlength: 20 },
  salt: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  avatarUri: { type: String, required: true },
  createdAt: { type: String, required: true, default: new Date().toLocaleString() },
  animeFavourites: [String],
  clientId: { type: String, required: true }
})

const UserModel = () => model('users', UserSchema)
module.exports = { UserModel, UserSchema }