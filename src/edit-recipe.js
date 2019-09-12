const electron = require('electron')
const prompt = require('electron-prompt');
const { dialog } = require('electron').remote
const remote = require('electron').remote;

const Store = require('electron-store');
const store = new Store();

// Receive recipeIndex
var recipeIndex = store.get("recipeIndex");
console.log(recipeIndex);

// Load Recipe Data
rawData = store.get('recipes');
cleanData = rawData.substring(1, rawData.length - 1);
indivData = cleanData.split("||");
rawRecipe = indivData[recipeIndex];

cleanRecipe = rawRecipe.substring(1, rawRecipe.length);
recipeComponents = cleanRecipe.split(":");

// Get Recipe Name
recipeName = recipeComponents[0];
recipeIngredient = recipeComponents[1];

console.log(recipeName)
console.log(recipeIngredient)

// Get jQuery
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

window.$ = window.jQuery = require('jquery');

// Update Recipe Name Field
$(document).ready(function(){
    $("#recipe-name").val(recipeName);
});

// Create List of Ingredients
var ingredients = [];

// Update Ingredients
recipeIngredients = recipeIngredient.substring(1, recipeIngredient.length - 1);
recipeIngredients = recipeIngredients.split("][");

var i;
for (i = 0; i < recipeIngredients.length; i++) { 
    rawIngredientInfo = recipeIngredients[i].split(",");
    ingredients.push([rawIngredientInfo[0], rawIngredientInfo[1]]);
}

// Update Table
updateTable(ingredients);

// Collect Buttons
const addIngredientsBtn = document.getElementById('add-ingredient')
const saveRecipeBtn = document.getElementById('save-recipe')

// Button Responses
addIngredientsBtn.addEventListener('click', function (event) {
    prompt({
        title: 'Add Ingredient',
        label: 'Ingredient Name:',
        inputAttrs: {
            type: 'text'
        }
    })
    .then((ingredientName) => {
        if(ingredientName != null) {
            prompt({
                title: 'Add Ingredient',
                label: 'Ingredient Amount:',
                inputAttrs: {
                    type: 'text'
                }
            })
            .then((ingredientAmount) => {
                if(ingredientAmount != null) {
                    var newIngredient = [ingredientName, ingredientAmount];
                    ingredients.push(newIngredient);
                    updateTable(ingredients);
                }
            })
            .catch(console.error);
        }
    })
    .catch(console.error);
})

saveRecipeBtn.addEventListener('click', function (event) {
    
    // Check For Valid Input
    var recipeName = document.getElementById("recipe-name").value;
    
    if (recipeName !== "") {
        // Assemble Recipe
        var recipeInfo = "|:" + recipeName + ":";

        for (var i = 0; i < ingredients.length; i++) {
            recipeInfo += "[" + ingredients[i][0] + "," + ingredients[i][1] + "]";
        }

        recipeInfo += "|";

        // Save The Recipe
        if (store.get('recipes') != undefined) {
            store.set('recipes', store.get('recipes') + recipeInfo);
        } else {
            store.set('recipes', recipeInfo);
        }

        // Setup Messagebox
        const options = {
            type: 'info',
            title: 'Recipe Saved',
            message: 'The recipe was saved.',
          };

        dialog.showMessageBox(null, options);

        // Close Window
        var window = remote.getCurrentWindow();
        window.close();

        // Produces Something Like |:BBQ Chicken:[Chicken Pack,1][BBQ Sauce,1]|

    } else {
        // Show An Error
        dialog.showErrorBox('Name Error', 'Please Enter a Recipe Name to Continue.')
    }

})

// Function to Update List of Ingredients
function updateTable(listOfIngredients) {

    try {
        // Delete Existing Table Table
        document.getElementById('ingredientsTable').remove();
    } catch(error) {
        console.error(error);
    }

    if (ingredients.length != 0) {
        // Create New Table
        var tableContents = `
        <table class="table table-striped" id="ingredientsTable">
            <thead>
                <tr>
                <th scope="col">Ingredient</th>
                <th scope="col">Quantity</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>`;

        // Button Numbering
        var currentBtn = 0;
        
        // Loop Through Ingredients and Redraw Table
        for (var i = 0; i < listOfIngredients.length; i++) {
            //console.log(listOfIngredients[i]);
            
            // Add Item to Table
            tableContents += `
            <tr>
                <td>` + listOfIngredients[i][0] + `</td>
                <td>` + listOfIngredients[i][1] + `</td>
                <td><button class="btn btn-danger btn-block" onclick="deleteIngredient(` + currentBtn + `);">Delete</button></td>
            </tr>
            `;

            // Increment Current Button
            currentBtn++;
        }

        // Finish Creating Table
        tableContents += '</tbody></table>';

        // Create Updated Table
        $( "#tableDiv" ).html(tableContents);
    }
}

// Delete Ingredient From List
function deleteIngredient(ingredientIndex) {

    // Delete Ingredient From Array
    ingredients.splice(ingredientIndex, 1);

    // Redraw Table
    updateTable(ingredients);

}
