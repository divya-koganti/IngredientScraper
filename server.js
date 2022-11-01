const express = require('express'); 
const superagent = require('superagent');
const cheerio = require('cheerio');

const app = express(); 
const bodyParser    = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Listening on port ${port}`)); 



app.post('/express_backend', async(req, res) => { 
    console.log(req.body);
    const response = await superagent("https://www.allrecipes.com/recipe/269004/one-pot-spaghetti-with-meat-sauce/");
    
    const $ = cheerio.load(response.text);
        // note that I'm not using .html(), although it works for me either way
    const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data; 
        // do not use JSON.stringify on the jsonRaw content, as it's already a string
    const result = JSON.parse(jsonRaw);
    
        // var mytable = "<table><tr>";
        // for (var CELL of result.recipeIngredient) {  mytable += "<td>" + CELL + "</td>"; }
        // mytable += "</tr></table>";
    
    
    
   
  res.send(result[0].recipeIngredient);
}); 


