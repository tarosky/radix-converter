(function () {
  'use strict';

  var reporters = require('jasmine-reporters');

  var junitReporter = new reporters.JUnitXmlReporter({
      savePath: __dirname,
      consolidateAll: false
  });

  var its = function(fn) {
    it(fn.toString(), fn);
  };

  var fits = function(fn) {
    fit(fn.toString(), fn);
  };

  var xits = function(fn) {
    xit(fn.toString(), fn);
  };

  var itsData = function(data, fn) {
    var getArgsString = function(values) {
      return "Values: [" + values.map(function(v) {
        return '"' + v.toString() + '"';
      }).join(', ') + '], ';
    };

    data.forEach(function(values) {
      var fn2;
      if (values.length < fn.length) {
        fn2 = function(done) {
          return fn.apply(null, values.concat([done]));
        };
      } else {
        fn2 = function() {
          return fn.apply(null, values);
        };
      }
      it(getArgsString(values) + fn.toString(), fn2);
    });
  };

  var radixConverter = require('../radix-converter');
  var fromBin = radixConverter.fromBin;
  var toBin = radixConverter.toBin;
  var fillZeroes = radixConverter.fillZeroes;

  describe("test/util/radix-converter", function() {
    describe("fromBin", function() {
      describe("binToQuartal", function() {
        var d = [
          ['0', '0'],
          ['11', '3'],
        ];
        itsData(d, function(a, b) {
          expect(fromBin(a, 4, 4, false)).toEqual(b);
        });
      });

      describe("binToDec", function() {
        describe("as unsigned", function() {
          var d = [
            ['1000', '8'],
            ['1111', '15'],
            ['0', '0'],
            ['1', '1'],
          ];
          itsData(d, function(a, b) {
            expect(fromBin(a, 10, 4, false)).toEqual(b);
          });
        });

        describe("as signed", function() {
          var d = [
            ['1000', '-8'],
            ['1111', '-1'],
            ['0000', '0'],
            ['0001', '1'],
            ['0111', '7'],
          ];
          itsData(d, function(a, b) {
            expect(fromBin(a, 10, 4, true)).toEqual(b);
          });
        });
      });
    });

    describe("toBin", function() {
      describe("hexToBin", function() {
        var d = [
          ['1', 4, '0001'],
          ['4', 4, '0100'],
          ['a', 4, '1010'],
          ['a0', 8, '10100000'],
          ['0a0', 8, '10100000'],
        ];
        itsData(d, function(a, b, c) {
          expect(toBin(a, 16, b)).toEqual(c);
        });
      });

      describe("quartalToBin", function() {
        var d = [
          ['1', '0001'],
          ['3', '0011'],
          ['11', '0101'],
          ['33', '1111'],
        ];
        itsData(d, function(a, b) {
          expect(toBin(a, 4, 4)).toEqual(b);
        });
      });

      describe("decToBin", function() {
        describe("positive", function() {
          var d = [
            ['0', '0000'],
            ['1', '0001'],
            ['7', '0111'],
            ['10', '1010'],
            ['15', '1111'],
          ];
          itsData(d, function(a, b) {
            expect(toBin(a, 10, 4)).toEqual(b);
          });
        });

        describe("negative", function() {
          var d = [
            ['-0', '0000'],
            ['-1', '1111'],
            ['-2', '1110'],
            ['-8', '1000'],
          ];
          itsData(d, function(a, b) {
            expect(toBin(a, 10, 4)).toEqual(b);
          });
        });
      });
    });

    describe("fillZeroes", function() {
      describe("passed a string", function() {
        var d = [
          [5, '00abc'],
          [4, '0abc'],
          [3, 'abc'],
          [2, 'abc'],
          [0, 'abc'],
        ];
        itsData(d, function(a, b) {
          expect(fillZeroes('abc', a)).toEqual(b);
        });

        its(function() {
          expect(fillZeroes('', 3)).toEqual('000');
        });
      });

      describe("passed an array", function() {
        var d = [
          [5, ['0', '0', 'a', 'b', 'c']],
          [4, ['0', 'a', 'b', 'c']],
          [3, ['a', 'b', 'c']],
          [2, ['a', 'b', 'c']],
          [0, ['a', 'b', 'c']],
        ];
        itsData(d, function(a, b) {
          expect(fillZeroes(['a', 'b', 'c'], a)).toEqual(b);
        });

        its(function() {
          expect(fillZeroes([], 3)).toEqual(['0', '0', '0']);
        });
      });
    });
  });
}());
