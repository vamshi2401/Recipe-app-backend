const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()

const Recipe=require('./models/recipe')
const auth=require('./middleware/auth')



import { UserRouter } from './routes/user.js';


const app=express()
const PORT=3000
app.use(express.json());

app.use('/auth',UserRouter)

//home page api
app.get('/',(req,res)=>{
  res.send("MERN stack...")
});

//registration page api
//basic structure for any api get post etc





//adding new recipes
app.post('/recipes',auth,async (req,res)=>{
  try {
    console.log("Received data:", req.body);
    const {title,description,ingredients}=req.body;
    const newrecipe= new Recipe({title,description,ingredients, author:req.user.id});
    
    await newrecipe.save();
    res.status(201).json({message:"Recipe added ",recipe:newrecipe});
    console.log("recipe added successfully")

  } catch (err){
    console.log(err);
    res.status(500).json({error:"server error"})
  }
});

//fetching recipes
app.get('/recipes',async (req,res)=>{
  try {
    
    const recipes=await recipe.find()

    res.json({message:"recipes","recipes":recipes});
    console.log("found recipes",recipes);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// updating recipes
app.patch('/recipes/:title', auth, async (req, res) => {
  try {
    const { title } = req.params;
    const { description, ingredients } = req.body;

    console.log('req.user:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in again.' });
    }

    
    
    const recipe = await Recipe.findOne({title});
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    console.log("author", recipe.author)

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this recipe' });
    }

    
    
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;

    
    await recipe.save();

    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//deleting recipes
app.delete('/recipes/:title',auth, async (req,res)=>{
  try {
    const {title}=req.params

    const recipe=await Recipe.findOne({title})
    console.log(recipe)
    if (!recipe){
      console.log("recipe not found")
      return res.status(404).json({message:"Recipe not found"})
    }

    if (recipe.author.toString()!==req.user.id){
      console.log("you are not authorized")
      return res.status(403).json({message:"You are not authorized"})
    }

    await Recipe.deleteOne({ title });

    res.json({message:"recipe deleted"});
    console.log("recipe deleted")


  } catch(err){
    console.log(err);
    res.status(500).json({error:"Server error"})
  }
});


//searching recipes
app.get('/recipes/search',async (req,res)=>{
  try {
    const  query=req.query.query;
    if (!query){
      return res.status(400).json({error:"query required"});

    }
    const recipes=await Recipe.find({
      $or:[
        {title:{$regex:query, $options:"i"}},
        {ingredients:{$regex: query, $options:"i"}}
      ]
    });

    if (recipes.length==0) {
      return res.json({message:"No recipes found",recipes:[]});
    } else {
      
      console.log("Recipes are found")
      return res.json({message:"recipes found",recipes})
    }

    

  } catch(err){
    console.log(err)
    res.status(500).json({error:"server error"})
  }
});


mongoose.connect(process.env.MONGO_URI).then(
  ()=>console.log("database connected")
) .catch(
  (err)=>console.log(err)
)


app.listen(PORT, (err)=>{
  if (err)
  {
    console.log(err)
  }
  console.log("Server is running properly")
});