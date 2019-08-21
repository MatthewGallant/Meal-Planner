const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

const newRecipeBtn = document.getElementById('new-recipe')
const viewRecipesBtn = document.getElementById('past-recipes')

newRecipeBtn.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, 'new-recipe.html')
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
  win.show()
})

viewRecipesBtn.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, 'view-recipes.html')
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
  win.show()
})