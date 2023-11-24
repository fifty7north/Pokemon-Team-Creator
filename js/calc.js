onmessage = (input) => {
    //processes input (current team array & pokemon data) from worker.postmessage into variables used in calculator
    const currentTeamArray = input.data[0];
    const pokemonData = input.data[1];
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
    //for each pokemon in pokemon data that isn't in the team, push their data to an array
    Object.entries(pokemonData).forEach(pokemon => {
        if (
            !pokemon[0].includes(inTeam[0]) &&
            !pokemon[0].includes(inTeam[1]) &&
            !pokemon[0].includes(inTeam[2]) &&
            !pokemon[0].includes(inTeam[3]) &&
            !pokemon[0].includes(inTeam[4]) &&
            !pokemon[0].includes(inTeam[5])
        ) {
            notInTeam.push(pokemon);
        };
    });

    
    //removes duplicate weaknesses
    let duplicateWeaknessRemove = new Map();
    notInTeam.forEach((pokemon) => duplicateWeaknessRemove.set(pokemon[1].weakness_array.join(), pokemon));
    const notInTeamUnique = Array.from(duplicateWeaknessRemove.values());
    
    
    //gets an array of all possible remaining team combinations
    const possibleCombos = (combo(notInTeamUnique, emptySlots, emptySlots));
    //adds current team members to start of array to create a full team for each possible combo
    for (let i = 0; i < possibleCombos.length; i++) {
        for (let teamSize = currentTeamArray.length - 1; teamSize > -1; teamSize--) {
            possibleCombos[i].unshift(currentTeamArray[teamSize]);
        };
    };
    
    //calculates each possible team's overall type weakness array
    for (let i = 0; i < possibleCombos.length; i++) {
        let totalWeaknesses = 0;
        let combinedTeamWeakness = 0;
        let combinedTeamResist = 0;
        let combinedTeamWeaknessArray = [];
        combinedTeamWeaknessArray.length = 0;
        for (let type = 0; type < possibleCombos[i][0][1].weakness_array.length; type++) {
            combinedTeamWeaknessArray.push(0);
        };
        for (let teamSize = 0; teamSize < possibleCombos[i].length; teamSize++) {
            for (let type = 0; type < combinedTeamWeaknessArray.length; type++) {
                if (possibleCombos[i][teamSize][1].weakness_array[type] > 1) {
                    combinedTeamWeaknessArray[type] = ++combinedTeamWeaknessArray[type];
                } else if (possibleCombos[i][teamSize][1].weakness_array[type] < 1) {
                    combinedTeamWeaknessArray[type] = --combinedTeamWeaknessArray[type];
                };
            };
        };
        //calculates each possible team's total number of weaknesses and resists
        for (let type = 0; type < combinedTeamWeaknessArray.length; type++) {
            if (combinedTeamWeaknessArray[type] > 0) {
                totalWeaknesses = totalWeaknesses + combinedTeamWeaknessArray[type];
                ++combinedTeamWeakness;
            } else if (combinedTeamWeaknessArray[type] < 0) {
                ++combinedTeamResist;
            };
        }
        //adds team weakness data to the relevant entry in the possible combos array
        possibleCombos[i].unshift({"total_weaknesses": totalWeaknesses, "type_weaknesses": combinedTeamWeakness, "type_resists": combinedTeamResist, "weakness_array": combinedTeamWeaknessArray });
    };
    //sorts possible combos array by total weaknesses and resists
    possibleCombos.sort((a, b) => {
        if (a[0].total_weaknesses === b[0].total_weaknesses && a[0].type_weaknesses === b[0].type_weaknesses) {
            return b[0].type_resists - a[0].type_resists;
        } else if (a[0].total_weaknesses === b[0].total_weaknesses) {
            return a[0].type_weaknesses - b[0].type_weaknesses;
        } else {
            return a[0].total_weaknesses - b[0].total_weaknesses;
        }
    });
    //removes excess combos by splicing the possible combos array in one of two ways, then posts the resulting array back to main.js
    //if there is a team where the total weaknesses <= size of current team, returns all team combos weaknesses <= size of current team
    //e.g. for 2 chosen team members, returns all teams with total weaknesses <= 2
    //otherwise removes all teams with more weaknesses than the best team
    let a = possibleCombos.findIndex((element) => element[0].type_weaknesses > currentTeamArray.length)
    if (a >= 0) {
        postMessage(possibleCombos.splice(0, a));
    } else {
        let bestTeamWeaknesses = possibleCombos[0][0].type_weaknesses
        let b = possibleCombos.findIndex((element) => element[0].type_weaknesses > bestTeamWeaknesses);
        postMessage(possibleCombos.splice(0, b));
    };
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