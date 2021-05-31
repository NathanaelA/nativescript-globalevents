if (global.TNS_WEBPACK) {
    //registers @nativescript/core UI framework modules
    require("bundle-entry-points");

    //register application modules
    global.registerModule("main-page", function () { return require("./main-page"); });
}
