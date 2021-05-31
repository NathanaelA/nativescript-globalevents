/**********************************************************************************
 * (c) 2016-2017, Master Technology
 * Licensed under the MIT license or contact me for a Support or Commercial License
 *
 * I do contract work in most languages, so let me solve your problems!
 *
 * Any questions please feel free to email me or put a issue up on the github repo
 * Version 1.2.1                                      Nathan@master-technology.com
 *********************************************************************************/
"use strict";

/* jshint camelcase: false, nodejs: true */
/* global android */

var page = require("@nativescript/core/ui/page");
var View = require("@nativescript/core/ui/core/view").View;

// global.android is already defined on android devices
// We are defining global.ios on ios devices because the ios team refuses to do it
if (global.NSObject && global.NSString && typeof global.ios === "undefined") {
  global.ios = true;
  Object.freeze(global.ios);
}

// If NS has added this ability to core; we want our plugin to gracefully stop working without doing anything...
if (page.Page.on || page.Page.addEventListener) {
  console.log(
    "NativeScript-globalevents auto disabled; functionality appears to be already present!"
  );
} else {
  var createdPageEvent = "pageCreated";
  var loadedFirst = View.loadedEvent + "First";
  var unloadedFirst = View.unloadedEvent + "First";
  var navigatingToFirst = page.Page.navigatingToEvent + "First";
  var navigatingFromFirst = page.Page.navigatingFromEvent + "First";
  var navigatedToFirst = page.Page.navigatedToEvent + "First";
  var navigatedFromFirst = page.Page.navigatedFromEvent + "First";
  var shownModallyFirst = page.Page.shownModallyEvent + "First";
  var showingModallyFirst = page.Page.showingModallyEvent + "First";

  // Setup the original events tracking
  var events = {};

  // Setup our event trackers
  var eventHandlers = {};
  eventHandlers[page.Page.navigatingToEvent] = [];
  eventHandlers[page.Page.navigatedToEvent] = [];
  eventHandlers[page.Page.navigatingFromEvent] = [];
  eventHandlers[page.Page.navigatedFromEvent] = [];
  eventHandlers[page.Page.shownModallyEvent] = [];
  eventHandlers[page.Page.showingModallyEvent] = [];
  eventHandlers[View.loadedEvent] = [];
  eventHandlers[View.unloadedEvent] = [];
  eventHandlers[createdPageEvent] = [];
  eventHandlers[loadedFirst] = [];
  eventHandlers[unloadedFirst] = [];
  eventHandlers[navigatingToFirst] = [];
  eventHandlers[navigatingFromFirst] = [];
  eventHandlers[navigatedToFirst] = [];
  eventHandlers[navigatedFromFirst] = [];
  eventHandlers[showingModallyFirst] = [];
  eventHandlers[shownModallyFirst] = [];

  // The event handler names
  var eventNames = {};
  eventNames[page.Page.navigatedToEvent] = "onNavigatedTo";
  eventNames[page.Page.navigatingToEvent] = "onNavigatingTo";
  eventNames[page.Page.navigatedFromEvent] = "onNavigatedFrom";
  eventNames[page.Page.navigatingFromEvent] = "onNavigatingFrom";
  eventNames[page.Page.shownModallyEvent] = "_raiseShownModallyEvent";
  eventNames[page.Page.showingModallyEvent] = "_raiseShowingModallyEvent";
  eventNames[View.loadedEvent] = "onLoaded";
  eventNames[View.unloadedEvent] = "onUnloaded";
  eventNames[createdPageEvent] = createdPageEvent;
  eventNames[loadedFirst] = "onLoaded";
  eventNames[unloadedFirst] = "onUnloaded";
  eventNames[navigatingToFirst] = "onNavigatingTo";
  eventNames[navigatingFromFirst] = "onNavigatingFrom";
  eventNames[navigatedToFirst] = "onNavigatedTo";
  eventNames[navigatedFromFirst] = "onNavigatedFrom";
  eventNames[shownModallyFirst] = "_raiseShownModallyEvent";
  eventNames[showingModallyFirst] = "_raiseShowingModallyEvent";

  /** Add our newly Created Page Event **/
  page.Page.createdPageEvent = createdPageEvent;
  page.Page.loadedFirst = loadedFirst;
  page.Page.unloadedFirst = unloadedFirst;
  page.Page.navigatedFromFirst = navigatedFromFirst;
  page.Page.navigatingFromFirst = navigatingFromFirst;
  page.Page.navigatedToFirst = navigatedToFirst;
  page.Page.navigatingToFirst = navigatingToFirst;
  page.Page.showingModallyFirst = showingModallyFirst;
  page.Page.shownModallyFirst = shownModallyFirst;

  // Overwrite the Page class with our Page class.
  var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      runEvent(Page.createdPageEvent, { object: this });
      return _this;
    }

    /**
     * Setup a static on/addEventLister on the Page object
     * @type {Page.addEventListener}
     */
    Page.on = Page.addEventListener = function (event, callback, thisArg) {
      if (typeof eventHandlers[event] === "undefined") {
        throw new Error(
          "This global page event " +
            event +
            " does not exist, or is currently unsupported"
        );
      }
      if (typeof callback !== "function") {
        throw new Error("Callback should be a function!");
      }

      var lookupEvent;
      if (event.indexOf("First") !== -1) {
        lookupEvent = event.substring(0, event.length - 5);
      } else {
        lookupEvent = event;
      }
      // Dynamically hijack the event; so that we don't bother hijacking any events that aren't used
      if (eventHandlers[event].length === 0) {
        hijackEvent(lookupEvent);
      }
      eventHandlers[event].push({ callback: callback, thisArg: thisArg });
    };

    /**
     * Setup a static off/removeEventLister
     * @type {Page.removeEventListener}
     */
    Page.off = Page.removeEventListener = function (event, callback, thisArg) {
      if (typeof eventHandlers[event] === "undefined") {
        throw new Error("This global page event " + event + " does not exist.");
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
    return Page;
  })(page.Page);

  // In case they include globalevents AFTER they have the Page variable; we need to
  // Make sure the original Page variable also has these events.
  page.Page.on = page.Page.addEventListener = Page.on;
  page.Page.off = page.Page.removeEventListener = Page.off;

  // If NativeScript-Angular has been loaded; this will be defined
  if (typeof global.Zone === "undefined") {
    // Overwrite the Page variable with our class only in a PAN or VUE app
    page.Page = Page;
  } else {
    // Because we are in Angular; we will grab the "Default" page class and
    // use it, instead of our new Page class.  Basically we "forget" about our
    // new page class in Angular mode.
    Page = page.Page;
  }
}

/**
 * Used to dynamically hijack the event
 * @param event
 */
function hijackEvent(event) {
  // We don't need to hijack the pageCreated event
  if (event === createdPageEvent) {
    return;
  }

  // Event has already been hijacked, no need to do anything more
  if (events[event]) {
    return;
  }

  var handlerName = eventNames[event];

  if (typeof Page.prototype[handlerName] === "function") {
    events[event] = Page.prototype[handlerName];
  } else if (typeof View.prototype[handlerName] === "function") {
    events[event] = View.prototype[handlerName];
  } else {
    throw new Error(
      "NativeScript-globalEvents is unable to find the proper event to attach to.  Please alert the author!"
    );
  }
  Page.prototype[handlerName] = getEventHandler(event);
}

/**
 * Used to dynamically restore the event
 * @param event
 */
function restoreEvent(event) {
  // We don't need to restore the pageCreated event
  if (event === createdPageEvent) {
    return;
  }

  // Get handler name
  var handlerName = eventNames[event];

  if (typeof events[event] !== "function") {
    throw new Error(
      "NativeScript-globalEvent, this event was never hijacked to be removed!"
    );
  }
  Page.prototype[handlerName] = events[event];
  events[event] = null;
}

/**
 * Find the Event in the callback list and return its index
 * @param events
 * @param callback
 * @param thisArg
 * @returns {number}
 */
function indexOfListener(events, callback, thisArg) {
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

function runEvent(eventType, eventArgs) {
  var eh = eventHandlers[eventType];
  if (typeof eh !== "undefined" && eh.length) {
    for (var i = 0; i < eh.length; i++) {
      var thisArg = eh[i].thisArg || this;
      eh[i].callback.call(thisArg, eventArgs);
    }
  }
}

/**
 * Setups a custom event handler for usage
 * @param eventType
 * @returns {Function}
 */
function getEventHandler(eventType) {
  return function (arg1, arg2) {
    var eventArgs;
    switch (eventType) {
      case Page.navigatingToEvent:
        eventArgs = this.createNavigatedData(Page.navigatingToEvent, arg2);
        break;

      case Page.shownModallyEvent:
        eventArgs = {
          eventName: Page.shownModallyEvent,
          object: this,
          context: arg2,
        };
        break;

      case Page.showingModallyEvent:
        eventArgs = {
          eventName: Page.showingModallyEvent,
          object: this,
        };
        break;

      case View.unloadedEvent:
      case View.loadedEvent:
        eventArgs = {
          eventName: eventType,
          object: this,
        };
        break;

      default:
        eventArgs = this.createNavigatedData(eventType, arg1);
    }

    // Run the "First" Events
    runEvent(eventType + "First", eventArgs);

    // Run real original event
    events[eventType].apply(this, arguments);

    // Run the normal "post" events
    runEvent(eventType, eventArgs);
  };
}
