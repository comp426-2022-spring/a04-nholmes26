/** Coin flip functions 
 * This module will emulate a coin flip given various conditions as parameters as defined below
 */

/** Simple coin flip
 * 
 * Write a function that accepts no parameters but returns either heads or tails at random.
 * 
 * @param {*}
 * @returns {string} 
 * 
 * example: coinFlip()
 * returns: heads
 * 
 */

export function coinFlip() {
  var x = Math.floor(Math.random() * 2); //generate a 1 or a 0 to represent Heads or Tails
  if (x == 1) {
    return 'heads';
  } else {
    return 'tails';
  }
}

/** Multiple coin flips
 * 
 * Write a function that accepts one parameter (number of flips) and returns an array of 
 * resulting "heads" or "tails".
 * 
 * @param {number} flips 
 * @returns {string[]} results
 * 
 * example: coinFlips(10)
 * returns:
 *  [
      'heads', 'heads',
      'heads', 'tails',
      'heads', 'tails',
      'tails', 'heads',
      'tails', 'heads'
    ]
 */

export function coinFlips(flips) {
  var results = [];
  for (let i = 0; i < flips; i++) {
    results.push(coinFlip());//coinFlip done 'flips' number of times, result added to array
  }
  return results;
}

/** Count multiple flips
 * 
 * Write a function that accepts an array consisting of "heads" or "tails" 
 * (e.g. the results of your `coinFlips()` function) and counts each, returning 
 * an object containing the number of each.
 * 
 * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
 * { tails: 5, heads: 5 }
 * 
 * @param {string[]} array 
 * @returns {{ heads: number, tails: number }}
 */

export function countFlips(array) {
  var heads_c = 0;
  var tails_c = 0;
  for (var flip of array) {
    if (flip == 'heads') {
      heads_c++;
    } else if (flip == 'tails') {
      tails_c++;
    }
  }
  if (heads_c == 0) {
    return {tails: tails_c};
  } else if (tails_c == 0) {
    return {heads: heads_c};
  } else {
    return {heads: heads_c, tails: tails_c};
  }
}

/** Flip a coin!
 * 
 * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
 * 
 * @param {string} call 
 * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
 * 
 * example: flipACoin('tails')
 * returns: { call: 'tails', flip: 'heads', result: 'lose' }
 */

export function flipACoin(call) {
  const resultant = coinFlip();
  if (call == resultant) {
    return { call: call, flip: resultant, result: 'win' };
  } else {
    return { call: call, flip: resultant, result: 'lose' };
  }
}


/** Export 
 * 
 * Export all of your named functions
*/
