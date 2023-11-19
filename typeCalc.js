/*
    Pokemon Type Weaknesses
*/
//Listed below is the order of the weaknesss corresponding to each value in the arrays
//Normal, Fire, Water, Electric, Grass, Ice, Fighting, Poison, Ground, Flying, Psychic, Bug, Rock, Ghost, Dragon, Dark, Steel, Fairy
const typeNormal = [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1];
const typeFire = [1, 0.5, 2, 1, 0.5, 0.5, 1, 1, 2, 1, 1, 0.5, 2, 1, 1, 1, 0.5, 0.5];
const typeWater = [1, 0.5, 0.5, 2, 2, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1];
const typeElectric = [1, 1, 1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 0.5, 1];
const typeGrass = [1, 2, 0.5, 0.5, 0.5, 2, 1, 2, 0.5, 2, 1, 2, 1, 1, 1, 1, 1, 1];
const typeIce = [1, 2, 1, 1, 1, 0.5, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1];
const typeFighting = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0.5, 0.5, 1, 1, 0.5, 1, 2];
const typePoison = [1, 1, 1, 1, 0.5, 1, 0.5, 0.5, 2, 1, 2, 0.5, 1, 1, 1, 1, 1, 0.5];
const typeGround = [1, 1, 2, 0, 2, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1];
const typeFlying = [1, 1, 1, 2, 0.5, 2, 0.5, 1, 0, 1, 1, 0.5, 2, 1, 1, 1, 1, 1];
const typePsychic = [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 0.5, 2, 1, 2, 1, 2, 1, 1];
const typeBug = [1, 2, 1, 1, 0.5, 1, 0.5, 1, 0.5, 2, 1, 1, 2, 1, 1, 1, 1, 1];
const typeRock = [0.5, 0.5, 2, 1, 2, 1, 2, 0.5, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 1];
const typeGhost = [0, 1, 1, 1, 1, 1, 0, 0.5, 1, 1, 1, 0.5, 1, 2, 1, 2, 1, 1];
const typeDragon = [1, 0.5, 0.5, 0.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2];
const typeDark = [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 2, 1, 0.5, 1, 0.5, 1, 2];
const typeSteel = [0.5, 2, 1, 1, 0.5, 0.5, 2, 0, 2, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 1, 0.5, 0.5];
const typeFairy = [1, 1, 1, 1, 1, 1, 0.5, 2, 1, 1, 1, 0.5, 1, 1, 0, 0.5, 2, 1];
//Other related arrays
const listOfTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
const pokemonCombinedWeakness = [];
const teamCombinedWeaknessResist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const teamWeakness = [];
const teamResist = [];

/*
    Functions
*/
function weaknessCalc(type1, type2) {
    for (let i = 0; i < listOfTypes.length; i++) {
        let a = type1[i] * type2[i];
        pokemonCombinedWeakness.push(a);
        teamWeaknessCalc(i);
    }
    pokemonCombinedWeakness.length = 0;
}

function teamWeaknessCalc(i) {
    if (pokemonCombinedWeakness[i] == 1) {
        teamCombinedWeaknessResist.splice(i, 1, teamCombinedWeaknessResist[i]);
    } else if (pokemonCombinedWeakness[i] < 1) {
        teamCombinedWeaknessResist.splice(i, 1, teamCombinedWeaknessResist[i] + 1);
    } else if (pokemonCombinedWeakness[i] > 1) {
        teamCombinedWeaknessResist.splice(i, 1, teamCombinedWeaknessResist[i] - 1);
    }
}

/*



weaknessCalc(typeWater, typeSteel);
weaknessCalc(typeFire, typeFighting);

console.log("team weakness array");
console.log(teamCombinedWeaknessResist);
console.log("");
console.log("team weakness:");
for (let i = 0; i < teamCombinedWeaknessResist.length; i++) {
    if (teamCombinedWeaknessResist[i] < 0) {
        console.log(listOfTypes[i]);
    }
}
console.log("");
console.log("team resist:");
for (let i = 0; i < teamCombinedWeaknessResist.length; i++) {
    if (teamCombinedWeaknessResist[i] > 0) {
        console.log(listOfTypes[i]);
    }
}*/