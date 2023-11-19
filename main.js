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

console.log(pokemonData)

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
    };
}