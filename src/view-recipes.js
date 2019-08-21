const electron = require('electron')
const prompt = require('electron-prompt');
const { dialog } = require('electron').remote
const remote = require('electron').remote;

const Store = require('electron-store');
const store = new Store();

// Get jQuery
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Create List of Recipes
var recipeNames = [];
var recipeIngredients = [];

// Load Recipe Data
rawData = store.get('recipes');
cleanData = rawData.substring(1, rawData.length - 1);
indivData = cleanData.split("||");

// Loop Through Recipes and Add to Recipes Array
for (var i = 0; i < indivData.length; i++) {
    
    // Get Recipe
    rawRecipe = indivData[i];
    cleanRecipe = rawRecipe.substring(1, rawRecipe.length);
    recipeComponents = cleanRecipe.split(":");

    // Get Recipe Name
    recipeName = recipeComponents[0];
    recipeIngredient = recipeComponents[1];

    // Get Recipe Ingredients

    // Add Recipe to Array
    recipeNames.push(recipeName);
    recipeIngredients.push(recipeIngredient);

}

updateTable();

// Function to Update List of Ingredients
function updateTable() {

    try {
        // Delete Existing Table Table
        document.getElementById('recipesTable').remove();
    } catch(error) {
        console.error(error);
    }

    if (recipeNames.length != 0) {
        // Create New Table
        var tableContents = `
        <table class="table table-striped" id="ingredientsTable">
            <thead>
                <tr>
                <th scope="col">Recipe</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>`;

        // Button Numbering
        var currentBtn = 0;
        
        // Loop Through Ingredients and Redraw Table
        for (var i = 0; i < recipeNames.length; i++) {
            
            // Add Item to Table
            tableContents += `
            <tr>
                <td>` + recipeNames[i] + `</td>
                <td><button class="btn btn-warning btn-block" onclick="editRecipe(` + currentBtn + `);">Edit</button></td>
                <td><button class="btn btn-danger btn-block" onclick="deleteRecipe(` + currentBtn + `);">Delete</button></td>
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

// Edit Recipe
function editRecipe(recipeIndex) {
    
    // Open Edit Window
}

// Delete Recipe From List
function deleteRecipe(recipeIndex) {

    const options = {
        type: 'question',
        buttons: ['Cancel', 'Yes', 'No'],
        defaultId: 2,
        title: 'Confirm Deletion',
        message: 'Confirm Deletion',
        detail: 'Are you sure that you want to delete this recipe?'
    };

    dialog.showMessageBox(null, options, (response) => {
        if (response == 1) {
            
            // Delete Ingredient From Array
            recipeNames.splice(recipeIndex, 1);

            // Redraw Table
            updateTable(recipeNames);

            // Save Data to Storage -------------------------
            var newRecipes = "";

            // Loop Through Recipes And Add to String
            for (var i = 0; i < recipeNames.length; i++) {
                
                // Add Name to String
                newRecipes += "|:" + recipeNames[i] + ":" + recipeIngredients[i] + "|";

            }

            // Save The Recipes
            if (store.get('recipes') != undefined) {
                store.set('recipes', newRecipes);
            }

            // Setup Messagebox
            const options = {
                type: 'info',
                title: 'Recipe Deleted',
                message: 'The recipe was deleted.',
            };

            dialog.showMessageBox(null, options);

        }
    });
}
