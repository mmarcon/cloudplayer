/*global define, document, Element*/
define(function() {
    'use strict';

    //jQuery selector kind of approach.
    //If no elements are found a fake element is created and returned
    //so on still works and doesn't break tests.
    var $ = function(selector){
        var results = document.querySelectorAll(selector);
        if(results.length === 0) {
            [].push.call(results, document.createElement('div'));
        }
        return results;
    };

    //I want to support jQuery-style event binding
    //
    //$('.myselector')[0].on('click', handleClick);
    Element.prototype.on = Element.prototype.addEventListener;

    //Utility class to attach arbitrary objects to DOM nodes
    var Data = function(){
        this.store = {};
        this.counter = 0;
    }, P, d;
    P = Data.prototype;
    P.data = function(element, key, object){
        if(!object) {
            //getter
            return this.store[element.__data] && this.store[element.__data][key];
        }
        if(!element.__data) {
            element.__data = 'cache' + this.counter++;
        }
        this.store[element.__data] = this.store[element.__data] || {};
        this.store[element.__data][key] = object;
    };
    P.removeData = function(element, key){
        if(!element.__data) {
            return;
        }

        if(key) {
            this.store[element.__data][key] = null;
            return;
        }
        this.store[element.__data] = null;
    };

    d = new Data();
    function data(){
        return d.data.apply(d, arguments);
    }
    function removeData(){
        return d.removeData.apply(d, arguments);
    }

    //Convenience method to empty DOM nodes
    //Takes care of removing corresponding objects
    //stored with data.
    function empty(element) {
        while(element.firstChild) {
            d.removeData(element.firstChild);
            element.removeChild(element.firstChild);
        }
    }

    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    var cache = {};

    function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
        cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
        .replace(/[\r\t\n]/g, " ")
        .split("<%").join("\t")
        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
        .replace(/\t=(.*?)%>/g, "',$1,'")
        .split("\t").join("');")
        .split("%>").join("p.push('")
            .split("\r").join("\\'")
            + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    }

    return {
        $: $,
        empty: empty,
        data: data,
        removeData: removeData,
        tmpl: tmpl
    };
});