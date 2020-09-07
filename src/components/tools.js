
export const abbrNum = (number, decPlaces=1) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10,decPlaces);

  // Enumerate number abbreviations
  var abbrev = [ "k", "m", "b", "t" ];

  // Go through the array backwards, so we do the largest first
  for (var i=abbrev.length-1; i>=0; i--) {

    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10,(i+1)*3);

    // If the number is bigger or equal do the abbreviation
    if(size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = Math.round(number*decPlaces/size)/decPlaces;

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
}

export const varDiff = (varName, state, nextState) => {
  const {[varName]:v1,} = state
  const {[varName]:v2,} = nextState
  return JSON.stringify(v1) !== JSON.stringify(v2)
}
export const varsDiffAny = (varsArr, state, nextState) => {
  const boolVars = varsArr.map(v=>{
    return varDiff(v, state, nextState)
  })
  return boolVars.some(x=>x)
}
export const varsDiffEvery = (varsArr, state, nextState) => {
  const boolVars = varsArr.map(v=>{
    return varDiff(v, state, nextState)
  })
  return boolVars.every(x=>x)
}

