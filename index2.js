import { createThings, createThingsMadeOutOfThings } from './index.js'

class Inventory {
  constructor() {
    this.amounts = new Map()
  }

  determineAmount(thing) {
    return this.amounts.get(thing) ?? 0
  }

  setAmount(thing, amount) {
    this.amounts.set(thing, amount)
  }

  incrementAmount(thing) {
    this.setAmount(thing, this.determineAmount(thing) + 1)
  }
}

const recipes = new Map()
const inventory = new Inventory()
const nameToThing = new Map()
const thingToNode = new Map()
const rows = []
const thingToRow = new Map()

const $things = document.querySelector('#things')

const things = createThings(5)

const thingTemplate = document.querySelector('#thing')

const $row = document.createElement('div')
$row.className = 'row'

for (const thing of things) {
  nameToThing.set(thing.name, thing)

  const $thing = thingTemplate.content.cloneNode(true)
  renderThing({ thing }, $thing.querySelector('.thing'))
  thingToNode.set(thing, $thing.querySelector('.thing'))
  $row.appendChild($thing)
}
const row = Array.from(things)
rows.push(row)
row.map(thing => thingToRow.set(thing, row))
$things.appendChild($row)

function createThingsMadeOutOfThings2(potentialIngredients) {
  const thingsMadeOutOfThings = createThingsMadeOutOfThings(
    potentialIngredients,
    3,
    {
      minimumIngredients: 2,
      maximumIngredients: 3,
      minimumAmount: 1,
      maximumAmount: 5
    }
  )

  const $row = document.createElement('div')
  $row.className = 'row'

  for (const thing of thingsMadeOutOfThings) {
    things.push(thing.thing)
    nameToThing.set(thing.thing.name, thing.thing)
    recipes.set(thing.thing, thing.recipe)

    const $thing = thingTemplate.content.cloneNode(true)
    renderThing(thing, $thing.querySelector('.thing'))

    thingToNode.set(thing.thing, $thing.querySelector('.thing'))
    $row.appendChild($thing)
  }
  const row = thingsMadeOutOfThings.map(({ thing }) => thing)
  rows.push(row)
  row.map(thing => thingToRow.set(thing, row))
  $things.appendChild($row)
}

function renderThing(thing, $thing) {
  let html = `<h2 class="thing__name-and-amount">${thing.thing.name} (${ inventory.determineAmount(thing.thing) })</h2>`
  if (thing.recipe) {
    html += '<strong>Ingredients:</strong><ul class="thing__ingredients">' +
      thing.recipe.ingredients.map(ingredient => `<li>${ ingredient.quantity } × ${ ingredient.thing.name }</li>`)
        .join('') + '</ul>'
  }
  $thing.innerHTML = html

}

createThingsMadeOutOfThings2(things)

$things.addEventListener('click', function onClick(event) {
  const { target } = event
  const $thing = target.closest('.thing')
  if ($thing) {
    const name = $thing.textContent.split(' ')[0]
    const thing = nameToThing.get(name)

    if (isMadeOutOfOtherThings(thing)) {
      const recipe = recipes.get(thing)

      if (areAllIngredientsAvailableInInventory(recipe)) {
        removeIngredientsFromInventory(recipe)
        for (const ingredient of recipe.ingredients) {
          updateThingUI(ingredient.thing)
        }
        inventory.incrementAmount(thing)
        renderThing({ thing, recipe: recipes.get(thing) }, $thing)
        const row = thingToRow.get(thing)
        if (rows[rows.length - 1] === row && isFirstThingMadeFromRow(row)) {
          createThingsMadeOutOfThings2(things)
        }
      }
    } else {
      inventory.incrementAmount(thing)
      renderThing({ thing, recipe: recipes.get(thing) }, $thing)
    }
  }
})

function isMadeOutOfOtherThings(thing) {
  return recipes.has(thing)
}

function areAllIngredientsAvailableInInventory(recipe) {
  return recipe.ingredients.every(ingredient => inventory.determineAmount(ingredient.thing) >= ingredient.quantity)
}

function removeIngredientsFromInventory(recipe) {
  for (const ingredient of recipe.ingredients) {
    inventory.setAmount(ingredient.thing, inventory.determineAmount(ingredient.thing) - ingredient.quantity)
  }
}

function updateThingUI(thing) {
  const $thing = thingToNode.get(thing)
  renderThing({ thing, recipe: recipes.get(thing) }, $thing)
}

function isFirstThingMadeFromRow(row) {
  return sum(row.map(thing => inventory.determineAmount(thing))) === 1
}

function sum(values) {
  return values.reduce(plus)
}

function plus(a, b) {
  return a + b
}
