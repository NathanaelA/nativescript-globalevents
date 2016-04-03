/**********************************************************************************
 * (c) 2016, Master Technology
 * Licensed under the MIT license or contact me for a Support or Commercial License
 *
 * I do contract work in most languages, so let me solve your problems!
 *
 * Any questions please feel free to email me or put a issue up on the github repo
 * Version 1.0.0                                      Nathan@master-technology.com
 *********************************************************************************/
"use strict";

/* jshint camelcase: false, nodejs: true */
/* global android */

var Page = require('ui/page').Page;
var View = require('ui/core/view').View;


// If NS has added this ability to core; we want our plugin to gracefully stop working without doing anything...
if (Page.on || Page.addEventListener) {
    console.log("NativeScript-globalevents is disabled; functionality appears to be already present!");
    return;
}

// Setup the original events tracking
var events = {};

// Setup our event trackers
var eventHandlers = {};
eventHandlers[Page.navigatingToEvent] = [];
eventHandlers[Page.navigatedToEvent] = [];
eventHandlers[Page.navigatingFromEvent] = [];
eventHandlers[Page.navigatedFromEvent] = [];
eventHandlers[Page.shownModallyEvent] = [];
eventHandlers[Page.showingModallyEvent] = [];
eventHandlers[View.loadedEvent] = [];
eventHandlers[View.unloadedEvent] = [];

// The event handler names
var eventNames = {};
eventNames[Page.navigatedToEvent] = 'onNavigatedTo';
eventNames[Page.navigatingToEvent] = 'onNavigatingTo';
eventNames[Page.navigatedFromEvent] = 'onNavigatedFrom';
eventNames[Page.navigatingFromEvent] = 'onNavigatingFrom';
eventNames[Page.shownModallyEvent] = '_raiseShownModallyEvent';
eventNames[Page.showingModallyEvent] = '_raiseShowingModallyEvent';
eventNames[View.loadedEvent] = 'onLoaded';
eventNames[View.unloadedEvent] =  'onUnloaded';


/**
 * Setup a static on/addEventLister on the Page object
 * @type {Page.addEventListener}
 */
Page.on = Page.addEventListener = function(event, callback, thisArg) {
    if (typeof eventHandlers[event] === 'undefined') {
        throw new Error("This global page event "+event+" does not exist, or is currently unsupported");
    }
    if (typeof callback !== 'function') {
        throw new Error("Callback should be a function!");
    }

    // Dynamically hijack the event; so that we don't bother hijacking any events that aren't used
    if (eventHandlers[event].length === 0) {
        hijackEvent(event);
    }
    eventHandlers[event].push({callback: callback, thisArg: thisArg});
};

/**
 * Setup a static off/removeEventLister
 * @type {Page.removeEventListener}
 */
Page.off = Page.removeEventListener = function(event, callback, thisArg) {
    if (typeof eventHandlers[event] === "undefined") {
        throw new Error("This global page event "+event+" does not exist.");
    }
    var orgLength = eventHandlers[event].length;
    if (callback) {
        var index = indexOfListener(eventHandlers[event], callback, thisArg);
        if (index >= 0) {
            eventHandlers[event].splice(index, 1);
        }
    } else {
        eventHandlers[event] = [];
    }
    if (eventHandlers[event].length === 0 && orgLength !== 0) {
        restoreEvent(event);
    }
};


/**
 * Used to dynamically hijack the event
 * @param event
 */
function hijackEvent(event) {
    var handlerName = eventNames[event];
    console.log("Handler", handlerName, event);

    if (typeof Page.prototype[handlerName] === 'function') {
        events[event] = Page.prototype[handlerName];
    } else if (typeof View.prototype[handlerName] === 'function') {
        events[event] = View.prototype[handlerName];
    } else {
        throw new Error("NativeScript-globalEvents is unable to find the proper event to attach to.  Please alert the author!");
    }
    Page.prototype[handlerName] = getEventHandler(event);
}

/**
 * Used to dynamically restore the event
 * @param event
 */
function restoreEvent(event) {
    var handlerName = eventNames[event];

    if (typeof events[event] !== 'function') {
        throw new Error("NativeScript-globalEvent, this event was never hijacked to be removed!");
    }
    Page.prototype[handlerName] = events[event];
}


/**
 * Find the Event in the callback list and return its index
 * @param events
 * @param callback
 * @param thisArg
 * @returns {number}
 */
function indexOfListener (events, callback, thisArg) {
    var i;
    if (thisArg) {
        for (i = 0; i < events.length; i++) {
            if (events[i].callback === callback && events[i].thisArg === thisArg) {
                return i;
            }
        }
    } else {
        for (i = 0; i < events.length; i++) {
            if (events[i].callback === callback) {
                return i;
            }
        }
    }
    return -1;
}


/**
 * Setups a custom event handler for usage
 * @param eventType
 * @returns {Function}
 */
function getEventHandler(eventType) {
    return function (arg1, arg2) {
        var eh = eventHandlers[eventType];

        // Run real original event which will trigger any configuration that needs to be setup before our event is ran
        events[eventType].apply(this, arguments);


        var eventArgs;
        switch (eventType) {
            case Page.navigatingToEvent:
                eventArgs = this.createNavigatedData(Page.navigatingToEvent, arg2);
                break;
            case Page.shownModallyEvent:
                eventArgs = {
                    eventName: Page.shownModallyEvent,
                    object: this,
                    context: arg2};
                break;
            case Page.showingModallyEvent:
                eventArgs = {
                    eventName: Page.showingModallyEvent,
                    object: this
                };
                break;
            case View.unloadedEvent:
            case View.loadedEvent:
                eventArgs = {
                    eventName: eventType,
                    object: this
                };
                break;
            default:
                eventArgs = this.createNavigatedData(eventType, arg1);
        }
        if (typeof eh !== 'undefined' && eh.length) {
            for (var i = 0; i < eh.length; i++) {
                var thisArg = eh[i].thisArg || this;
                eh[i].callback.call(thisArg, eventArgs);
            }
        }
    };
}





