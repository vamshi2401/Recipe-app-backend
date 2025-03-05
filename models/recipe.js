const mongoose = require('mongoose')

const RecipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true,  },
  imageUrl: { type: String, required: true,},
  cookingTime: { type: Number, required: true,},
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model('Recipe', RecipeSchema)