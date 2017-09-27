"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HelloWorld = (function () {
    function HelloWorld() {
    }
    HelloWorld.prototype.sayHello = function () {
        console.log("hi");
    };
    HelloWorld.prototype.sayGoodbye = function () {
        console.log("goodbye");
    };
    return HelloWorld;
}());
exports.HelloWorld = HelloWorld;
