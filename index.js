class Thing {
  constructor(name) {
    this.name = name
  }
}

class Recipe {
  constructor(ingredients, product) {
    this.ingredients = ingredients
    this.product = product
  }
}

class Ingredient {
  constructor(thing, quantity) {
    this.thing = thing
    this.quantity = quantity
  }
}

let id = 1

export function createThings(amount) {
  const things = []
  for (let i = 1; i <= amount; i++) {
    const thing = new Thing('I' + id)
    id++
    things.push(thing)
  }
  return things
}

export function createThingsMadeOutOfThings(
  ingredients,
  amount,
  {
    minimumIngredients,
    maximumIngredients,
    minimumAmount,
    maximumAmount
  }
) {
  const thingsMadeOutOfThings = []
  const recipes = []
  for (let i = 1; i <= amount; i++) {
    const thingMadeOutOfThings = new Thing('I' + id)
    id++

    const ingredientsToPickFrom = Array.from(ingredients)
    const recipeIngredients = []
    const numberOfIngredients = randomInteger(minimumIngredients, maximumIngredients + 1)
    for (let i = 1; i <= numberOfIngredients; i++) {
      const index = randomInteger(0, ingredientsToPickFrom.length)
      const quantity = randomInteger(minimumAmount, maximumAmount + 1)
      const ingredient = new Ingredient(
        ingredientsToPickFrom.splice(index, 1)[0],
        quantity
      )
      recipeIngredients.push(ingredient)
    }

    const recipe = new Recipe(
      recipeIngredients,
      thingMadeOutOfThings
    )
    recipes.push(recipe)
    thingsMadeOutOfThings.push({
      thing: thingMadeOutOfThings,
      recipe
    })
  }
  return thingsMadeOutOfThings
}

function randomInteger(min, max) {
  return Math.floor(randomFloat(min, max))
}

function randomFloat(min, max) {
  return min + (max - min) * Math.random()
}
