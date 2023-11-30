onmessage = (input) => {

    /**
     * 
     * Create array of all possible combos
     * 
     */

    //processes input (current team array & pokemon data) from worker.postmessage into variables used in calculator
    const currentTeamArray = input.data[0];
    const pokemonData = input.data[1];
    var uniqueTypesOnlyToggle = input.data[2][0];
    var onlyOneStarterToggle = input.data[2][1];
    //defines/resets current inTeam and notInTeam arrays
    const inTeam = [];
    const notInTeam = [];
    const notInTeamData = [];
    var settingsFilter = [];
    inTeam.length = 0;
    notInTeam.length = 0;
    notInTeamData.length = 0;
    settingsFilter.length = 0;
    //gets number of empty slots in team
    const emptySlots = 6 - currentTeamArray.length;
    //gets names of all pokemon in team
    for (let teamSize = 0; teamSize < currentTeamArray.length; teamSize++) {
        inTeam.push(currentTeamArray[teamSize][0]);
    }
    //for each pokemon in pokemon data that isn't in the team, push their data to an array
    pokemonData.forEach(pokemon => {
        if (
            !pokemon[0].includes(inTeam[0]) &&
            !pokemon[0].includes(inTeam[1]) &&
            !pokemon[0].includes(inTeam[2]) &&
            !pokemon[0].includes(inTeam[3]) &&
            !pokemon[0].includes(inTeam[4]) &&
            !pokemon[0].includes(inTeam[5])
        ) {
            settingsFilter.push(pokemon);
        };
    });

    console.log(settingsFilter)
    //primary pokemon filter for generation, version, legendary/mythic status & trade evolution
    for (let i = 0; i < settingsFilter.length; i++) {
        let usePokemon = true;
        settingsFilter[i][1].hidden_settings.forEach(setting => { if (setting == true) { usePokemon = false } });
        if (usePokemon == false) {
            settingsFilter.splice(settingsFilter.indexOf(settingsFilter[i]), 1);
            i--;
        }
    }
    //various settings to filter certain types of pokemon
    if (uniqueTypesOnlyToggle == true) {
        settingsFilter = uniqueTypesOnly(currentTeamArray, settingsFilter);
    };
    if (onlyOneStarterToggle == true) {
        settingsFilter = starterFilter(currentTeamArray, settingsFilter);
    }
    //
    for (let i = 0; i < settingsFilter.length; i++) {
        notInTeam.push(settingsFilter[i][1].weakness_array);
        notInTeamData.push(settingsFilter[i]);
    };
    //removes duplicate weakness arrays
    let duplicateWeaknessRemove = new Map();
    notInTeam.forEach((pokemon) => duplicateWeaknessRemove.set(pokemon.join(), pokemon));
    const notInTeamUnique = Array.from(duplicateWeaknessRemove.values());
    //gets an array of all possible remaining team combinations
    const possibleCombos = (combo(notInTeamUnique, emptySlots, emptySlots));

    /**
     * 
     * Adds data to each possible team combo, such as team weaknesses, resists and coverage
     * 
     */

    for (let i = 0; i < possibleCombos.length; i++) {
        //adds current team weakness data
        for (let teamSize = currentTeamArray.length - 1; teamSize > -1; teamSize--) {
            possibleCombos[i].unshift(currentTeamArray[teamSize][1].weakness_array);
        };
        //adds current team data to self contained team data array
        possibleCombos[i].unshift([]);
        for (let teamSize = 0; teamSize < currentTeamArray.length; teamSize++) {
            possibleCombos[i][0].push([]);
            possibleCombos[i][0][teamSize].push(currentTeamArray[teamSize]);
        };
        //moves full team weakness data to self contained team weaknesses array
        possibleCombos[i][1] = possibleCombos[i].splice(1, 6);
        //gets data of all pokemon that match the weakness arrays of possible team members and adds them to team data array
        for (let x = possibleCombos[i][0].length; x < possibleCombos[i][1].length; x++) {
            possibleCombos[i][0][x] = [];
            notInTeamData.forEach(pokemon => {
                if (arraysEqual(pokemon[1].weakness_array, possibleCombos[i][1][x]) == true) {
                    possibleCombos[i][0][x].push(pokemon);
                };
            });
        };
        //calculates each possible team's overall type weaknesses and resists
        let totalWeaknesses = 0;
        let combinedTeamWeakness = 0;
        let combinedTeamResist = 0;
        let combinedTeamWeaknessArray = [];
        combinedTeamWeaknessArray.length = 0;
        for (let type = 0; type < possibleCombos[i][1][0].length; type++) {
            combinedTeamWeaknessArray.push(0);
        };
        for (let teamSize = 0; teamSize < possibleCombos[i][1].length; teamSize++) {
            for (let type = 0; type < combinedTeamWeaknessArray.length; type++) {
                if (possibleCombos[i][1][teamSize][type] > 1) {
                    combinedTeamWeaknessArray[type] = ++combinedTeamWeaknessArray[type];
                } else if (possibleCombos[i][1][teamSize][type] < 1) {
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
        };
        //calculates each possible team's overall type coverage
        let totalTypeCoverage = 0;
        let combinedTypeCoverageArray = [];
        combinedTypeCoverageArray.length = 0;
        for (let type = 0; type < possibleCombos[i][0][0][0][1].coverage_array.length; type++) {
            combinedTypeCoverageArray.push(0);
        };
        for (let teamSize = 0; teamSize < possibleCombos[i][0].length; teamSize++) {
            for (let type = 0; type < combinedTypeCoverageArray.length; type++) {
                if (possibleCombos[i][0][teamSize][0][1].coverage_array[type] > 0) {
                    combinedTypeCoverageArray[type] = ++combinedTypeCoverageArray[type];
                };
            };
        };
        //calculates each possible team's total type coverage
        for (let type = 0; type < combinedTypeCoverageArray.length; type++) {
            if (combinedTypeCoverageArray[type] > 0) {
                ++totalTypeCoverage;
            };
        };
        //adds team weaknesses, resists and coverage data to the relevant entry in the possible combos array
        possibleCombos[i].unshift({ "total_weaknesses": totalWeaknesses, "total_type_coverage": totalTypeCoverage, "type_weaknesses": combinedTeamWeakness, "type_resists": combinedTeamResist, "weakness_array": combinedTeamWeaknessArray, "coverage_array": combinedTypeCoverageArray });
    };

    /**
     * 
     * Organise and further filter possible team combos
     * 
     */

    //sorts possible combos array by total weaknesses and resists
    possibleCombos.sort((a, b) => {
        if (a[0].total_weaknesses === b[0].total_weaknesses && a[0].total_type_coverage === b[0].total_type_coverage && a[0].type_weaknesses === b[0].type_weaknesses) {
            return b[0].type_resists - a[0].type_resists;
        } else if (a[0].total_weaknesses === b[0].total_weaknesses && a[0].total_type_coverage === b[0].total_type_coverage) {
            return b[0].type_weaknesses - a[0].type_weaknesses;
        } else if (a[0].total_weaknesses === b[0].total_weaknesses) {
            return b[0].total_type_coverage - a[0].total_type_coverage;
        } else {
            return a[0].total_weaknesses - b[0].total_weaknesses;
        }
    });
    //removes excess combos by splicing the possible combos array in one of two ways, then posts the resulting array back to main js file
    //if there is a team where the total weaknesses <= size of current team, returns all team combos weaknesses <= size of current team
    //e.g. for 2 chosen team members, returns all teams with total weaknesses <= 2
    //otherwise removes all teams with more weaknesses than the best team
    let a = possibleCombos.findIndex((element) => element[0].type_weaknesses > currentTeamArray.length);
    if (a > 0) {
        var finalCombos = possibleCombos.slice(0, a);
    } else {
        let bestTeamWeaknesses = possibleCombos[0][0].type_weaknesses
        let b = possibleCombos.findIndex((element) => element[0].type_weaknesses > bestTeamWeaknesses);
        var finalCombos = possibleCombos.slice(0, b);
    };
    //removes teams with duplicate pokemon (e.g. 2 of the same pokemon with different abilities)
    finalCombos.forEach(team => {
        let notInTeam = [];
        for (let i = currentTeamArray.length; i < team[1].length; i++) {
            team[1][i].forEach(pokemon => {
                notInTeam.push(pokemon[1].name)
            });
        }
        notInTeam = notInTeam.flat();
        for (let i = 0; i < notInTeam.length; i++) {
            if (notInTeam[i] == notInTeam[i + 1]) {
                finalCombos.splice(finalCombos.indexOf(team), 1);
            };
        };
    });
    //various settings
    if (uniqueTypesOnlyToggle == true) {
        finalCombos = uniqueTypesOnlyPostSort(finalCombos, currentTeamArray);
    }
    if (onlyOneStarterToggle == true) {
        finalCombos = starterFilterPostSort(finalCombos, currentTeamArray);
    }
    //post final results back to main js file
    postMessage(finalCombos);
};

/**
 * 
 * Functions
 * 
 */

function uniqueTypesOnly(inTeam, notInTeam) {
    let inTeamTypes = [];
    inTeam.forEach(pokemon => {
        inTeamTypes.push(pokemon[1].pokemon_type)
    });
    inTeamTypes = inTeamTypes.flat();
    for (let i = 0; i < notInTeam.length; i++) {
        let removePokemon = false;
        notInTeam[i][1].pokemon_type.forEach(notInTeamType => {
            inTeamTypes.forEach(inTeamType => {
                if (inTeamType == notInTeamType) {
                    removePokemon = true;
                }
            });
        });
        if (removePokemon == true) {
            notInTeam.splice(i, 1);
            i--;
        }
    }
    return notInTeam;
}

function uniqueTypesOnlyPostSort(listOfTeams, currentTeam) {
    for (let i = 0; i < listOfTeams.length; i++) {
        let removeTeam = false;
        let notInTeam = [];
        for (let j = currentTeam.length; j < listOfTeams[i][1].length; j++) {
            notInTeam.push(listOfTeams[i][1][j][0][1].pokemon_type);
        }
        notInTeam = notInTeam.flat().sort();
        for (let j = 0; j < notInTeam.length; j++) {
            if (notInTeam[j] == notInTeam[j + 1]) {
                removeTeam = true;
            }
        }
        if (removeTeam == true) {
            listOfTeams.splice(i, 1);
            i--;
        }
    }
    return listOfTeams;
}

function starterFilter(inTeam, notInTeam) {
    let starterInTeamCheck = false;
    for (let i = 0; i < inTeam.length; i++) {
        if (inTeam[i][1].starter == true) {
            starterInTeamCheck = true;
        }
    }
    if (starterInTeamCheck == true) {
        for (let i = 0; i < notInTeam.length; i++) {
            if (notInTeam[i][1].starter == true) {
                notInTeam.splice(i, 1);
                i--;
            }
        }
    }
    return notInTeam;
}

function starterFilterPostSort(listOfTeams, currentTeam) {
    for (let i = 0; i < listOfTeams.length; i++) {
        let notInTeam = [];
        notInTeam.length = 0;
        for (let j = currentTeam.length; j < listOfTeams[i][1].length; j++) {
            notInTeam.push(listOfTeams[i][1][j])
        }
        notInTeam = notInTeam.flat();
        let starterCount = 0;
        notInTeam.forEach(pokemon => {
            if (pokemon[1].starter == true) {
                starterCount++;
            }
        });
        if (starterCount > 1) {
            listOfTeams.splice(i, 1);
            i--;
        }
    }
    return listOfTeams;
}

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

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};