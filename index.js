const express = require('express');
const ejs = require('ejs');
const app = express();

app.set("view engine", "ejs");

app.get("/", function(req,res){
	res.render("home.ejs");
});

// start server
app.listen(8080, function(){
    console.log("Express server has started");
})