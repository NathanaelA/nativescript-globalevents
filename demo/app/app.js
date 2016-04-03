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
};

page.on('loaded', function(args) {
    console.log("Global Page Loaded event");
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



application.start({ moduleName: "main-page" });
