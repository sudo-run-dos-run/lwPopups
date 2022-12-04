/*!
 * Author: Tobias Weigl
 * http://www.tobias-weigl.de
 *
 * This source code is free to use under the CC0 license.
 */

/*jslint browser: true, devel: true, sloppy: true, vars: true*/
/*global $, jQuery*/

var tobias_weigl_de,
    tobias_weigl_de = tobias_weigl_de || {};

/**
 * Convenience functions. This namespace will probably be exchanged for underscore.js some time in the future.
 *
 * @class tobias_weigl_de.utilities
 * @module Utilities
 */

tobias_weigl_de.utilities = (function () {
    return {};
}());

tobias_weigl_de.utilities.associative_array = (function () {

    function length(object) {
        var result = 0, key;
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                result += 1;
            }
        }
        return result;
    }

    function contains(object, value) {
        var result = false, key;
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                if (value === object[key]) {
                    result = true;
                }
            }
        }
        return result;
    }

    return {
        length : length,
        contains : contains
    };
}());

tobias_weigl_de.utilities.html = (function () {

    // We need this primarily because IE supports CSS 3D Transitions, but the Implementation is flawed
    function isInternetExplorer() {
        return !!navigator.userAgent.match(/Trident/) || jQuery.browser.msie !== undefined;
    }

    function createUniqueIDWithSafetyCount(idPrefix, safetyCount) {
        if (idPrefix === undefined) {
            idPrefix = 'autoCreatedUniqueID-';
        }
        if (safetyCount === undefined) {
            safetyCount = 1000;
        }
        var index = 0;
        var result = idPrefix + index;
        while ($('#' + idPrefix + index).size() !== 0 && index < safetyCount) {
            index += 1;
            result = idPrefix + index;
        }
        return result;
    }

    return {
        isInternetExplorer : isInternetExplorer,
        createUniqueIDWithSafetyCount : createUniqueIDWithSafetyCount
    };
}());