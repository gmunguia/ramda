var _curry2 = require('./internal/_curry2');
var _slice = require('./internal/_slice');
var arity = require('./arity');


/**
 * Returns a curried equivalent of the provided function, with the
 * specified arity. The curried function has two unusual capabilities.
 * First, its arguments needn't be provided one at a time. If `g` is
 * `R.curryN(3, f)`, the following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value `R.__` may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is `R.__`,
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      var addFourNumbers = function() {
 *        return R.sum([].slice.call(arguments, 0, 4));
 *      };
 *
 *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
 *      var f = curriedAddFourNumbers(1, 2);
 *      var g = f(3);
 *      g(4); //=> 10
 */
module.exports = _curry2(function curryN(length, fn) {
  return arity(length, function() {
    var n = arguments.length;
    var shortfall = length - n;
    var idx = n - 1;
    while (idx >= 0) {
      if (arguments[idx] != null &&
          arguments[idx]['@@functional/placeholder'] === true) {
        shortfall += 1;
      }
      idx -= 1;
    }
    if (shortfall <= 0) {
      return fn.apply(this, arguments);
    } else {
      var initialArgs = _slice(arguments);
      return curryN(shortfall, function() {
        var currentArgs = _slice(arguments);
        var combinedArgs = [];
        var idx = 0;
        var currentArgsIdx = 0;
        while (idx < n) {
          var val = initialArgs[idx];
          if (val != null && val['@@functional/placeholder'] === true) {
            combinedArgs[idx] = currentArgs[currentArgsIdx];
            currentArgsIdx += 1;
          } else {
            combinedArgs[idx] = val;
          }
          idx += 1;
        }
        while (currentArgsIdx < currentArgs.length) {
          combinedArgs[idx] = currentArgs[currentArgsIdx];
          idx += 1;
          currentArgsIdx += 1;
        }
        return fn.apply(this, combinedArgs);
      });
    }
  });
});
