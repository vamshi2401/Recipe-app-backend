const express = require('express');
const Recipe = require('../models/recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Adding new recipe
router.post('/', auth, async (req, res) => {
  try {
    console.log("Received data:", req.body);
    const { title, description, ingredients, instructions, imageUrl, cookingTime } = req.body;
    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
      cookingTime,
      author: req.user.id
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe added", recipe: newRecipe });
    console.log("Recipe added successfully");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json({ message: "Recipes found", recipes });
    console.log("Recipes found:", recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a recipe
router.put('/:title', auth, async (req, res) => {
  try {
    const { title } = req.params;
    const { description, ingredients, instructions, imageUrl, cookingTime } = req.body;

    const recipe = await Recipe.findOne({ title });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this recipe" });
    }

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.imageUrl = imageUrl || recipe.imageUrl;
    recipe.cookingTime = cookingTime || recipe.cookingTime;

    await recipe.save();
    res.json({ message: "Recipe updated successfully", recipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a recipe
router.delete('/:title', auth, async (req, res) => {
  try {
    const { title } = req.params;

    const recipe = await Recipe.findOne({ title });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    await Recipe.deleteOne({ title });

    res.json({ message: "Recipe deleted" });
    console.log("Recipe deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Search recipes
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }

    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { ingredients: { $regex: query, $options: "i" } }
      ]
    });

    if (recipes.length === 0) {
      return res.json({ message: "No recipes found", recipes: [] });
    } else {
      console.log("Recipes found");
      return res.json({ message: "Recipes found", recipes });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

//get recipe by id
router.get("/:id", auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
