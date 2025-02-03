import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 2000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))


// Array with ingredients
const arrayOfIngredients = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Whiskey",
  "Brandy",
  "Triple Sec",
  "Amaretto",
  "Coffee Liqueur",
  "Campari",
  "Tonic Water",
  "Soda Water",
  "Cola",
  "Ginger Beer",
  "Lime Juice",
  "Lemon Juice",
  "Cranberry Juice",
  "Orange Juice",
  "Simple Syrup",
  "Grenadine"
];



// Displays all ingredients on the website
app.get('/', async (req,res) =>{
  res.render('ingredients.ejs',{
    'data': arrayOfIngredients
  })
})


// Gets chose ingredients and responses all recipies possible
app.post('/submit', async (req,res) =>{
  // Takes ingredients from request
    const ingedientsFromReq = req.body;


    // Try for seing does the user really chosed ingredients
    try{ 
      if(Object.entries(ingedientsFromReq).length>0){
        let ingredientsOn = []
        for(let i=0; i<arrayOfIngredients.length; i++){
            if (ingedientsFromReq[arrayOfIngredients[i]] === 'on'){
                ingredientsOn.push(arrayOfIngredients[i])
            }
        }
        console.log(ingredientsOn)


        // Makes all ingredients as one array
        const ingredientsAvailable = ingredientsOn.join(', ')
      

        // Puts all ingredients into API and gets recipies json
        try{
            const response = await axios.get(`https://api.api-ninjas.com/v1/cocktail`,{
                params:{ingredients: ingredientsAvailable},
                headers: {'X-Api-Key': 'qwxfGepOJ5gU16NUAfIPPQ7UYm8KmjyRVNiQdnZK'}
            });
            res.render("recipies.ejs", {
                data: response.data, ingredients: ingredientsAvailable
            })
        } catch(error){
          // error if problem with API
            console.error('Error in receiving data from api', error.message)
            res.status(500).send('Server error with connecting API')
        }
      }else{
        throw new Error();
      }
        
    }catch(error){
      // Error if no ingredients were selected
      console.error('No ingredients were selected.', error.message)
      res.status(500).send('No ingredients were selected.')
    }
})




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
