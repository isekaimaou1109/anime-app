const { Schema, model } = require('mongoose');

const { CommentSchema } = require('./comment.model')

const EpisodeSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  episodeNumber: { type: Number, required: true },
  animeUri: { type: String, required: true },
  uploadedAt: { type: String, required: true }
})

const AnimeSchema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  vietnameseName: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: true, maxlength: 255 },
  star: { type: Number, required: true, min: 0, max: 5 },
  imageUri: { type: String, required: true },
  genres: { type: [String], required: true },
  animeModel: { type: String, required: true },
  createdAt: { type: String, required: true, default: new Date().toLocaleString() },
  views: { type: Number, required: true, default: 0 },
  episodes: [EpisodeSchema],
  totalEpisode: { type: Number, required: true },
  comments: [CommentSchema]
});

const AnimeModel = () => model('anime', AnimeSchema)
module.exports = { AnimeSchema, AnimeModel }