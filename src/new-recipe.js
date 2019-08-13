const electron = require('electron')
const prompt = require('electron-prompt');

// Get jQuery
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Create List of Ingredients
var ingredients = [];

// Collect Buttons
const addIngredientsBtn = document.getElementById('add-ingredient')

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

// Function to Update List of Ingredients
function updateTable(listOfIngredients) {

    // Delete Existing Table Table
    document.getElementById('ingredientsTable').remove();

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
    
    // Loop Through Ingredients and Redraw Table
    for (var i = 0; i < listOfIngredients.length; i++) {
        //console.log(listOfIngredients[i]);
        
        // Add Item to Table
        tableContents += `
        <tr>
            <td>` + listOfIngredients[i][0] + `</td>
            <td>` + listOfIngredients[i][1] + `</td>
            <td><button class="btn btn-danger btn-block">Delete</button></td>
        </tr>
        `;
    }

    // Finish Creating Table
    tableContents += '</tbody></table>';

    // Create Updated Table
    $( "#tableDiv" ).html(tableContents);

}
