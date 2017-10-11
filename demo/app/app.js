var application = require("application");
var page = require('ui/page').Page;
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


application.start({ moduleName: "main-page" });
