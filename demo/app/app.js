/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

require("./bundle-config");
var application = require("application");

// Grab the Page, so we can add our events
var page = require('ui/page').Page;

// Install our GlobalEvents so the below events actually work
require('nativescript-globalevents');

console.keys = function(obj) {
    console.log("--------------------------");
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            console.log(key);
        }
    }
    console.log("--------------------------");
    console.log(" ");

};

page.on('pageCreated', function(args) {
    console.log("Global Page Created event");
    console.keys(args);
});

page.on('loadedFirst', function(args) {
    console.log("Global Page Loaded FIRST event");
    console.keys(args);
});

page.on('loaded', function(args) {
    console.log("Global Page Loaded event");
    console.keys(args);
});

page.on('navigatingToFirst', function(args) {
    console.log("Global Navigating to FIRST");
    console.keys(args);
});

page.on('navigatingTo', function(args) {
    console.log("Global Navigating to");
    console.keys(args);
});

page.on('navigatedTo', function(args) {
    console.log("Global Navigated to");
    console.keys(args);
});

page.on('navigatedToFirst', function(args) {
    console.log("Global Navigated to FIRST!");
    console.keys(args);
});


// ------------------------------------------------

application.start({ moduleName: "main-page" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
