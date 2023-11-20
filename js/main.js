import pokemonData from "./pokemon-data.js"
import typeDataObject from "./type-data.js"

const typeData = Object.entries(typeDataObject);
const pokemonWeakness = [];
const pokemonCombinedWeakness = [];

/**
 * 
 * Populate pokemonData object with pokemon type weaknesses
 * 
 */

Object.entries(pokemonData).forEach(entry => {
    const [pokemon, pokemonDataEntries] = entry;
    //for each type the pokemon has, checks through list of all types to find matching types and adds their data to weakness array
    pokemonDataEntries.pokemon_type.forEach(type => {
        for (let i = 0; i < typeData.length; i++) {
            if (typeData[i][0] == type) {
                let typeIndex = typeData[i][1];
                pokemonWeakness.push(typeIndex);
            }
        }
    });
    if (pokemonWeakness.length > 1) {
        //if pokemon has 2 types, slices the data from both weakness arrays in the main pokemon weakness array, calculates the combines type weakness and pushes it to pokemonData
        //slices the data from both weakness arrays in the main pokemon weakness array and assigns them their own variable for calculation
        let weakness1 = pokemonWeakness[0].slice();
        let weakness2 = pokemonWeakness[1].slice();
        //calculates combined type weakness for pokemon
        for (let i = 0; i < typeData.length; i++) {
            let weakness = weakness1[i] * weakness2[i];
            pokemonCombinedWeakness.push(weakness);
        }
    } else if (pokemonWeakness.length == 1) {
        //if pokemon has 1 type, slices the data from main pokemon weakness array and pushes it to pokemonData
        let weakness = pokemonWeakness[0].slice();
        for (let i = 0; i < typeData.length; i++) {
            pokemonCombinedWeakness.push(weakness[i]);
        }
    }
    //adds weakness array to corresponding pokemon in pokemonData
    Object.assign(pokemonDataEntries, {weakness_array: pokemonCombinedWeakness.slice()});
    //calls ability weakness modifier function to adjust pokemon weakness values where necessary
    abilityWeaknessModifier(entry)
    //resets weakness and combined weakness arrays
    pokemonWeakness.length = 0;
    pokemonCombinedWeakness.length = 0;
});
console.log(pokemonData);

/**
 * 
 * Populate page with grid of all pokemon
 * 
 */

//custom colours
const typeColours = [
    ["normal", "#A8A77A"],
    ["fire", "#EE8130"],
    ["water", "#6390F0"],
    ["electric", "#F7D02C"],
    ["grass", "#7AC74C"],
    ["ice", "#96D9D6"],
    ["fighting", "#C22E28"],
    ["poison", "#A33EA1"],
    ["ground", "#E2BF65"],
    ["flying", "#A98FF3"],
    ["psychic", "#F95587"],
    ["bug", "#A6B91A"],
    ["rock", "#B6A136"],
    ["ghost", "#735797"],
    ["dragon", "#6F35FC"],
    ["dark", "#705746"],
    ["steel", "#B7B7CE"],
    ["fairy", "#D685AD"]
];

Object.entries(pokemonData).forEach(entry => {
    //creates new list entry and populates it with attributes
    const newPokemonLi = document.createElement("li");
    newPokemonLi.setAttribute("class", "pokedex-entry");
    newPokemonLi.setAttribute("title", entry[0]);
    newPokemonLi.setAttribute("data-region-pokedex-id", entry[1].region_pokedex_id);
    newPokemonLi.setAttribute("data-national-pokedex-id", entry[1].national_pokedex_id);
    newPokemonLi.setAttribute("data-variant-id", entry[1].variant_id);
    //creates new button and populates it with attributes
    const newPokemonButton = document.createElement("button");
    newPokemonButton.setAttribute("onclick", "");
    //creates new image of pokemon
    const newPokemonImage = document.createElement("img");
    newPokemonImage.setAttribute("src", "./images/"+entry[0]+".png");
    newPokemonImage.setAttribute("alt", entry[0]);
    newPokemonImage.setAttribute("onerror", "if (this.src != '/images/placeholder.png') this.src = './images/placeholder.png';");
    //assigns custom colours according to type
    if (entry[1].pokemon_type.length > 1) {
        //flattens typeColours array and finds the matching indexes in the flattened array for the pokemon's types
        //halves those values so that they will correspond with the corresponding indexes in the non-flattened typeColours arrays
        //assigns the background gradient to the colour codes of the colourIndex variables
        let colourIndex1 = ((typeColours.flat().findIndex(x => x == entry[1].pokemon_type[0]))/2);
        let colourIndex2 = ((typeColours.flat().findIndex(x => x == entry[1].pokemon_type[1]))/2);
        newPokemonLi.style.backgroundImage = "linear-gradient("+typeColours[colourIndex1][1]+", "+typeColours[colourIndex2][1]+")";
    } else {
        //flattens typeColours array and finds the matching index in the flattened array for the pokemon's type
        //halves that value so that it will correspond with the same index in the non-flattened typeColours array
        //assigns the background colour to the colour code of the colourIndex
        let colourIndex = ((typeColours.flat().findIndex(x => x == entry[1].pokemon_type[0]))/2);
        newPokemonLi.style.backgroundColor = typeColours[colourIndex][1];
    }
    //adds new element to pokemonList in HTML
    let element = document.getElementById("pokemonList");
    element.appendChild(newPokemonLi);
    newPokemonLi.appendChild(newPokemonButton);
    newPokemonLi.appendChild(newPokemonImage);
})

/**
 * 
 * Functions
 * 
 */

function abilityWeaknessModifier(entry) {
    if (entry[1].ability_weakness_modifier == "none") {
        //if pokemon does not have an ability that modifies weakness, do nothing
    } else if (entry[1].ability_weakness_modifier == "filter") {
        //if pokemon has filter ability, slightly reduces all super effective damage (0.75x)
        for (let i = 0; i < entry[1].weakness_array.length; i++) {
            if (entry[1].weakness_array[i] > 1) {
                let typeWeakness = (entry[1].weakness_array[i]) * 0.75;
                entry[1].weakness_array[i] = typeWeakness;
            }
        }
    } else if (entry[1].ability_weakness_modifier == "dry skin") {
        //if pokemon has flash fire ability, negates water damage and slightly increases fire damage (1.25x)
        let fireWeakness = (entry[1].weakness_array[1]) * 1.25;
        let waterWeakness = (entry[1].weakness_array[2]) * 0;
        entry[1].weakness_array[1] = fireWeakness;
        entry[1].weakness_array[2] = waterWeakness;
    } else if (entry[1].ability_weakness_modifier == "flash fire") {
        //if pokemon has flash fire ability, negates fire damage
        let fireWeakness = (entry[1].weakness_array[1]) * 0;
        entry[1].weakness_array[1] = fireWeakness;
    } else if (entry[1].ability_weakness_modifier == "heatproof") {
        //if pokemon has heatproof ability, halves fire weakness
        let fireWeakness = (entry[1].weakness_array[1]) * 0.5;
        entry[1].weakness_array[1] = fireWeakness;
    } else if (entry[1].ability_weakness_modifier == "levitate") {
        //if pokemon has levitate ability, negates ground weakness
        let groundWeakness = (entry[1].weakness_array[8]) * 0;
        entry[1].weakness_array[8] = groundWeakness;
    } else if (entry[1].ability_weakness_modifier == "thick fat") {
        //if pokemon has levitate ability, halves fire and ice weakness
        let fireWeakness = (entry[1].weakness_array[1]) * 0.5;
        let iceWeakness = (entry[1].weakness_array[1]) * 0.5;
        entry[1].weakness_array[1] = fireWeakness;
        entry[1].weakness_array[5] = iceWeakness;
    } else if (entry[1].ability_weakness_modifier == "water absorb") {
        //if pokemon has levitate ability, negates water weakness
        let waterWeakness = (entry[1].weakness_array[2]) * 0;
        entry[1].weakness_array[2] = waterWeakness;
    };
}