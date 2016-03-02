/**
* Long型はJavaScriptには存在しないので、任意長の数値を文字列として基数変換
* するライブラリを作成した。
* コードを単純化するために、n進数からm進数への変換は、一度unsignedの2進数
* を介して行うことにした。
*/
(function () {
  'use strict';

  var divide = function(charsVal, fromRadix, toRadix) {
    var res = charsVal.reduce(function(acc, cVal) {
      var v = parseInt(cVal, fromRadix) + acc.remainder * fromRadix;
      var q = Math.floor(v / toRadix);
      var r = v % toRadix;
      acc.quotient.push(q.toString(fromRadix));
      acc.remainder = r;
      return acc;
    }, {
      quotient: [],
      remainder: 0
    });
    return res;
  };

  var fillZeroes = function(chars, size) {
    var zeroLen = Math.max(size - chars.length, 0);
    if (typeof chars == 'string') {
      return Array(zeroLen + 1).join('0') + chars;
    }
    var zeroes = Array(zeroLen + 1).join('0').split('');
    return zeroes.concat(chars);
  };

  var flip = function(chars) {
    return chars.map(function(c) {
      return c == '0' ? '1' : '0';
    });
  };

  var addOne = function(chars) {
    var added = chars.reduceRight(function(acc, v) {
      if (acc.carry) {
        if (v == '0') {
          acc.res.unshift('1');
          return {
            res: acc.res,
            carry: false
          };
        }
        acc.res.unshift('0');
        return {
          res: acc.res,
          carry: true
        };
      }
      acc.res.unshift(v);
      return {
        res: acc.res,
        carry: false
      };
    }, {
      res: [],
      carry: true
    });
    return added.res;
  };

  var transformRadixUnsigned = function(fromChars, fromRadix, toRadix) {
    var isZero = function(c) {
      return c == '0';
    };
    var toChars = [];
    do {
      var r = divide(fromChars, fromRadix, toRadix);
      toChars.unshift(r.remainder.toString(toRadix));
      fromChars = r.quotient;
    } while (!fromChars.every(isZero));
    return toChars;
  };

  var toBin = function(numStr, radix, sizeByBits) {
    var numStrChars = numStr.split('');
    var isNegative = false;
    if (0 < numStrChars.length && numStrChars[0] == '-') {
      isNegative = true;
      numStrChars.shift();
    }

    var binChars = fillZeroes(transformRadixUnsigned(numStrChars, radix, 2), sizeByBits);

    if (isNegative) {
      binChars = addOne(flip(binChars));
    }

    return binChars.join("");
  };

  var fromBin = function(binStr, radix, sizeByBits, asSigned) {
    var numStrChars = fillZeroes(binStr.split(''), sizeByBits);
    var isNegative = asSigned && numStrChars[0] == '1';
    if (isNegative) {
      numStrChars = addOne(flip(numStrChars));
    }
    var resChars = transformRadixUnsigned(numStrChars, 2, radix);
    if (isNegative && resChars.join("") != '0') {
      resChars.unshift('-');
    }
    return resChars.join("");
  };

  module.exports = {
    fromBin: fromBin,
    toBin: toBin,
    fillZeroes: fillZeroes,
  };
}());
