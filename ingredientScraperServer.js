const http = require('http');
const path = require("path");
const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser"); 
const superagent = require("superagent");
const cheerio = require('cheerio');


app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

const portNumber = 5000;
const successStatus = 200;

app.use(express.static(__dirname + '/public'));

app.get("/", (request, response) => { 
    response.render("index");
});

app.post("/results", async (request, response) => { 
    let {url} = request.body;
    const res = await superagent(url);
    const $ = cheerio.load(res.text);

    const jsonRaw = $("script[type='application/ld+json']")[0].children[0].data; 
    let obj = $("script[type='application/ld+json']");
    let recipeIngredients = 0;


    for(var k in obj){
        for(var j in obj[k].children){
            var data = obj[k].children[j].data;
            if(data){
                let result = JSON.parse(data);
                
                let i = 0;
                recipeIngredients = result.recipeIngredient;


                while (!recipeIngredients && i <= result.length) {
                    recipeIngredients = result[i].recipeIngredient;
                    i += 1;
            
                }

            }
            
        }
    }
    

    
    let str = "";
    
    if (recipeIngredients) {
        str = "<ul>";

        recipeIngredients.forEach(element =>{
            str += `<li>${element}</li>`;
    
    
        });
        str += "</ul>";

    }
    else {
        str = "Could not get ingredients in this format";
    }
   


    let variable = {list:str}
    response.render("results",variable)
});




app.listen(portNumber);
console.log(`Web server is running at http://localhost:${portNumber}`);
const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);
process.stdin.setEncoding("utf8");
process.stdin.on('readable', () => {
	let dataInput = process.stdin.read();
	if (dataInput !== null) {
        let command = dataInput.trim();
		if (command === 'stop') {
			console.log("Shutting down the server");
            process.exit(0);
        } 

        else {
			console.log(`Invalid command: ${command}`);
		}
        process.stdout.write(prompt);
        process.stdin.resume();
    }
});