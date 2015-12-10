﻿var assert = require("../assert.js");
var test = require("../test.js");
var utilities = require("../utilities.js");

module.exports.runTests = runTests;
function runTests() {
    // utilities.count() tests
    test.run(function () { assert.Equal(0, utilities.count(null, null)); });
    test.run(function () { assert.Equal(0, utilities.count("", "")); });
    test.run(function () { assert.Equal(5, utilities.count("aaaaa", "a")); });
    test.run(function () { assert.Equal(1, utilities.count("dad", "dad")); });
    test.run(function () { assert.Equal(3, utilities.count("dadadad", "dad")); });
    
    // utilities.toString() tests
    test.run(function () { assert.Equal("\"test\"", utilities.toString("test")); });
    test.run(function () { assert.Equal("null", utilities.toString(null)); });
    test.run(function () { assert.Equal("undefined", utilities.toString(undefined)); });
    test.run(function () { assert.Equal("27", utilities.toString(27)); });
    test.run(function () { assert.Equal("[\n  1,\n  2,\n  3,\n  4\n]", utilities.toString([1, 2, 3, 4])); });
    test.run(function () { assert.Equal("{\n  \"a\": \"aValue\"\n}", utilities.toString({ "a": "aValue" })); });
    test.run(function () { assert.Equal("{\n  \"a\": {\n    \"b\": \"bValue\"\n  }\n}", utilities.toString({ "a": { "b": "bValue" } })); });
    
    // utilities.getProperty() tests
    test.run(function () { assert.Equal("aValue", utilities.getProperty("a", { "a": "aValue" })); });
    test.run(function () { assert.Equal("aValue", utilities.getProperty("#a", { "a": "aValue" })); });
    test.run(function () { assert.Equal("aValue", utilities.getProperty("/a", { "a": "aValue" })); });
    test.run(function () { assert.Equal("aValue", utilities.getProperty("#/a", { "a": "aValue" })); });
    test.run(function () { assert.Equal("aValue", utilities.getProperty("a/b/c", { "a": { "b": { "c": "aValue" } } })); });
    test.run(function () { assert.Throws(function () { utilities.getProperty("a", {}); }); });

    // utilities.resolveSchemaLocalReferences() tests
    test.run(function () { assert.Equal("hello", utilities.resolveSchemaLocalReferences("hello", "there")); });
    test.run(function () { assert.Equal("hello", utilities.resolveSchemaLocalReferences("hello")); })
    test.run(function () { assert.Equal("hello", utilities.resolveSchemaLocalReferences("hello", null)); })

    test.run(function () {
        var fullSchemaJson = {
            "a": "aValue",
            "aRef": { "$ref": "#/a" }
        };
        var resolvedSchemaJson = utilities.resolveSchemaLocalReferences(fullSchemaJson, fullSchemaJson);
        assert.Same(fullSchemaJson, resolvedSchemaJson);
    });

    test.run(function () {
        var fullSchemaJson = {
            "a": {
                "b": "bValue",
                "a": { "$ref": "#/a" }
            }
        };
        var resolvedSchemaJson = utilities.resolveSchemaLocalReferences(fullSchemaJson, fullSchemaJson);
        assert.Same(fullSchemaJson, resolvedSchemaJson);
    });
    
    test.run(function () {
      var fullSchemaJson = {
        "a": "aValue",
        "b": {
          "a": {
            "$ref": "#/a"
          }
        }
      };
      
      var resolvedSchemaJson = utilities.resolveSchemaLocalReferences(fullSchemaJson.b, fullSchemaJson);
      assert.NotSame(resolvedSchemaJson, fullSchemaJson);
      
      var expectedResolvedSchemaJson = { "a": "aValue" };
      assert.Equal(expectedResolvedSchemaJson, resolvedSchemaJson);
    });
}

if (require.main === module) {
    runTests();

    test.showResults();
}