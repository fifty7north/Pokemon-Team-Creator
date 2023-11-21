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
    const [, pokemonDataEntries] = entry;
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

//adjust pokemon weakness values where necessary according to ability
function abilityWeaknessModifier(entry) {
    if (entry[1].ability_weakness_modifier == "none") {
        //if pokemon does not have an ability that modifies weakness, do nothing
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

console.log(pokemonData);

/**
 * 
 * Populate page with grid of all pokemon
 * 
 */

//table with values of all pokemon type colours
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
    newPokemonLi.classList.add("pokedex-entry");
    newPokemonLi.setAttribute("id", entry[0]);
    newPokemonLi.setAttribute("title", entry[0]);
    //creates new button with pokemon name as id
    const newPokemonButton = document.createElement("button");
    newPokemonButton.classList.add("pokedex-button");
    newPokemonButton.setAttribute("id", entry[0]);
    newPokemonLi.appendChild(newPokemonButton);
    //creates new image of pokemon
    const newPokemonImageContainer = document.createElement("div");
    newPokemonImageContainer.classList.add("pokemon-image-container");
    const newPokemonImage = document.createElement("img");
    newPokemonImage.setAttribute("src", "./images/pokemon/"+entry[0]+".png");
    newPokemonImage.setAttribute("alt", entry[0]);
    newPokemonImage.setAttribute("onerror", "if (this.src != '/images/pokeball.png') this.src = './images/pokeball.png';");
    newPokemonLi.appendChild(newPokemonImageContainer);
    newPokemonImageContainer.appendChild(newPokemonImage);
    //creates new container for pokemon info
    const newPokemonInfoContainer = document.createElement("div");
    newPokemonInfoContainer.classList.add("pokemon-info-container");
    newPokemonLi.appendChild(newPokemonInfoContainer);
    //creates new pokemon title
    const newPokemonTitle = document.createElement("div");
    newPokemonTitle.classList.add("pokemon-info-title");
    newPokemonTitle.appendChild(document.createTextNode(entry[1].name));
    newPokemonInfoContainer.appendChild(newPokemonTitle);
    //creates new pokemon type cards
    if (entry[1].pokemon_type.length > 1) {
        //for duo type
        for (let i = 0; i < entry[1].pokemon_type.length; i++) {
            const newPokemonTypeCard = document.createElement("div");
            newPokemonTypeCard.classList.add("pokemon-info-type");
            newPokemonTypeCard.classList.add("duo-type-"+(i+1)+"");
            let colourIndex = ((typeColours.flat().findIndex(x => x == entry[1].pokemon_type[i]))/2);
            newPokemonTypeCard.style.backgroundColor = typeColours[colourIndex][1];
            newPokemonTypeCard.appendChild(document.createTextNode(entry[1].pokemon_type[i]));
            newPokemonInfoContainer.appendChild(newPokemonTypeCard);
        }
    } else {
        //for single type
        const newPokemonTypeCard = document.createElement("div");
        newPokemonTypeCard.classList.add("pokemon-info-type");
        newPokemonTypeCard.classList.add("single-type");
        newPokemonTypeCard.appendChild(document.createTextNode(entry[1].pokemon_type[0]));
        let colourIndex = ((typeColours.flat().findIndex(x => x == entry[1].pokemon_type[0]))/2);
        newPokemonTypeCard.style.backgroundColor = typeColours[colourIndex][1];
        newPokemonInfoContainer.appendChild(newPokemonTypeCard);
    }
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
    let element = document.getElementById("pokemon-list");
    element.appendChild(newPokemonLi);
});

/**
 * 
 * Adding/removing pokemon from team
 * 
 */

//array for storing members of current team
const currentTeamArray = [];

//on clicking a pokedex entry to add that pokemon to the current team, 
document.querySelectorAll(".pokedex-button").forEach(pokedexButton => {
    pokedexButton.addEventListener("click", function() {
        let id = pokedexButton.id;
        if(currentTeamArray.length < 6) {
            //If current team has < 6 pokemon, hides the clicked pokedex entry in the pokemon list
            document.getElementById(id).classList.add("in-team");
        } else {
            //If current team has >= 6 pokemon, displays error message on screen
            alert("Team slots already filled");
        };
        Object.entries(pokemonData).forEach(entry => {
            if(entry[0] == id) {
                //for every entry in pokemon data, checks if the id of the clicked pokedex entry matches an entry
                //if there is a match, adds that data entry to the current team array
                currentTeamArray.push(entry);
                if(currentTeamArray.length > 6) {
                    //if current team > 6 pokemon, removes last pokemon added
                    currentTeamArray.length = 6;
                };
                updateTeamArray();
            };
        });
    });
});

//on clicking a team member entry to remove that pokemon from the current team
document.querySelectorAll(".team-member-button").forEach(teamMember => {
    teamMember.addEventListener("click", function() {
        let pokemonID = (teamMember.parentElement.getAttribute("pokemon"));
        if(pokemonID !== "") {
            //unhides the pokemon clicked in the pokemon list
            document.getElementById(pokemonID).classList.remove("in-team");
            //if the team slot is not empty, gets the team member slot number and splices that number from the current team array
            let id = teamMember.parentElement.getAttribute("id");
            let teamMemberNum = id.substring(id.length-1);
            let currentTeamArrayIndex = teamMemberNum - 1;
            currentTeamArray.splice(currentTeamArrayIndex, 1);  
            //removes all current team member ui entries on screen, so they can be updated to the new current team without the removed pokemon
            for (let i = 1; i <= 6; i++) {
                let teamMember = document.querySelector("#team-member-"+i);
                teamMember.setAttribute("pokemon", "");
                teamMember.querySelector(".team-member-image").setAttribute("src", "");
                teamMember.querySelector(".team-member-name").innerHTML = "";
            };
            //updates current team ui
            updateTeamArray();
        };
    });
});

//for each team slot, updates the current team ui data with the current team data
function updateTeamArray() {
    for (let i = 0; i < 6; i++) {
        let slotNum = i + 1;
        let teamMember = document.getElementById("team-member-"+slotNum);
        if(slotNum <= currentTeamArray.length) {
            teamMember.setAttribute("pokemon", currentTeamArray[i][0]);
            teamMember.querySelector(".team-member-image").setAttribute("src", "./images/pokemon/"+currentTeamArray[i][0]+".png");
            teamMember.querySelector(".team-member-name").innerHTML = currentTeamArray[i][1].name;
        };
    };
};

/**
 * 
 * Animations
 * 
 */

//pokedex entry hover effect
document.querySelectorAll(".pokedex-button").forEach(pokedexButton => {
    pokedexButton.addEventListener("mouseenter", function() {
        let id = pokedexButton.id;
        document.getElementById(id).classList.add("pokedex-entry-hover");
    });
    pokedexButton.addEventListener("mouseleave", function() {
        let id = pokedexButton.id;
        document.getElementById(id).classList.remove("pokedex-entry-hover");
    });
});

//team member hover effect
document.querySelectorAll(".team-member-entry").forEach(teamMember => {
    teamMember.addEventListener("mouseenter", function() {
        let id = teamMember.id;
        document.getElementById(id).querySelector(".team-member-image").style.backgroundColor = "lightgrey";
    });
    teamMember.addEventListener("mouseleave", function() {
        let id = teamMember.id;
        document.getElementById(id).querySelector(".team-member-image").style.backgroundColor = "white";
    });
});
