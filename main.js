import pokemonData from "./pokemon-data.js"
import typeDataObject from "./type-data.js"

const typeData = Object.entries(typeDataObject);
const pokemonWeakness = [];
const pokemonCombinedWeakness = [];

let pokemon = pokemonData.empoleon;




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
    //slices the data from both weakness arrays in the main pokemon weakness array and assigns the values to their own arrays that are refered to later
    let weakness1 = pokemonWeakness[0].slice();
    let weakness2 = pokemonWeakness[1].slice();
    //calculates combined type weakness for pokemon from the pokemon weakness array
    for (let i = 0; i < typeData.length; i++) {
        let weakness = weakness1[i] * weakness2[i];
        pokemonCombinedWeakness.push(weakness);
    }
    //adds weakness array to corresponding pokemon in pokemonData
    Object.assign(pokemonDataEntries, {weakness_array: pokemonCombinedWeakness.slice()});
    //resets weakness and combined weakness arrays
    pokemonWeakness.length = 0;
    pokemonCombinedWeakness.length = 0;
});
console.log(pokemonData);

