const { Schema, model } = require('mongoose')

const CommentSchema = new Schema({
  createdAt: { type: String, required: true },
  meassage: { type: String, required: true },
  username: { type: String, required: true }
})

const CommentModel = () => model('comments', CommentSchema)
module.exports = { CommentModel, CommentSchema }