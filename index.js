const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql2/promise')
require('dotenv').config();

const app = express();
app.use(express.urlencoded({
    extended: false
  })); // enable forms

// initialise the database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.set("view engine", "ejs");

app.get("/", function(req,res){
	res.render("home");
});

/*
app.get('/recipes', async function(req,res){
    const [results] = await pool.query('SELECT * FROM recipes');
    // without array destructuring 
    // const response = await... 
    // const results = response[]
    res.json(results);
})
*/

app.get('/recipes', async function(req,res){
    const [results] = await pool.query('SELECT * FROM recipes');
    res.render("recipes", { recipes: results });
});


app.get('/recipes/add', function(req, res){
    res.render("newRecipe");
});

app.post('/recipes', async function(req, res){
    const { name, ingredients, instructions } = req.body;
    await pool.query('INSERT INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?)', [name, ingredients, instructions]);
    res.redirect('/recipes');
});


app.get('/recipes/:id/edit', async function(req, res){
    const { id } = req.params;
    const [results] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    res.render("editRecipe", { recipe: results[0] });
});

app.post('/recipes/:id', async function(req, res){
    const { id } = req.params;
    const { name, ingredients, instructions } = req.body;
    await pool.query('UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id = ?', [name, ingredients, instructions, id]);
    res.redirect('/recipes');
});

app.get('/recipes/:id/delete', async function(req, res){
    const { id } = req.params;
    await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
    res.redirect('/recipes');
});

// start server
app.listen(8080, function(){
    console.log("Express server has started");
})