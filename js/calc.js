onmessage = (input) => {
    //processes input (current team array & pokemon data) from worker.postmessage into variables used in calculator
    let currentTeamArray = input.data[0];
    let pokemonData = input.data[1];   
    //defines/resets current inTeam and notInTeam arrays
    const inTeam = [];
    const notInTeam = [];
    inTeam.length = 0;
    notInTeam.length = 0;
    //gets number of empty slots in team
    let emptySlots = 6 - currentTeamArray.length;
    //gets names of all pokemon in team
    for (let teamSize = 0; teamSize < currentTeamArray.length; teamSize++) {
        inTeam.push(currentTeamArray[teamSize][0]);
    }
    //for each pokemon in pokemon data that isn't in the team,
    Object.entries(pokemonData).forEach(pokemon => {
        if (
            !pokemon[0].includes(inTeam[0]) &&
            !pokemon[0].includes(inTeam[1]) &&
            !pokemon[0].includes(inTeam[2]) &&
            !pokemon[0].includes(inTeam[3]) &&
            !pokemon[0].includes(inTeam[4]) &&
            !pokemon[0].includes(inTeam[5])
        ) {
            notInTeam.push(pokemon[1].weakness_array);
        };
    });
    //removes duplicate weaknesses
    let duplicateWeaknessRemove = new Map();
    notInTeam.forEach((item) => duplicateWeaknessRemove.set(item.join(), item));
    const notInTeamUnique = Array.from(duplicateWeaknessRemove.values());
    //gets an array of all possible remaining team combinations
    const calcResult = (combo(notInTeamUnique, emptySlots, emptySlots));
    postMessage(calcResult);
};

//function that combines, link @https://github.com/firstandthird/combinations, credit to the following:
//jgallen23, iX315, andfaulkner: creators/contributors
//GCastilho: max size bug fix
var combo = function (a, min, max) {
    min = min || 1;
    max = max < a.length ? max : a.length;
    var fn = function (n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < Math.min(max + 1, a.length); i++) {
        fn(i, a, [], all);
    }
    if (a.length == max) all.push(a);
    return all;
};