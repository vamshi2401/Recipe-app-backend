const mongoose=require('mongoose')

const RecipeSchema= mongoose.Schema({
  title:{type:String,required:true},
  description:{type:String, required:true},
  ingredients:{type:[String], required:true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

module.exports=mongoose.model('Recipe',RecipeSchema)