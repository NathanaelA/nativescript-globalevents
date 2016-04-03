var createViewModel = require("./main-view-model").createViewModel;

function onNavigatingTo(args) {
    console.log("Page.OnNavigatingTo");
    var page = args.object;
    page.bindingContext = createViewModel();
}
exports.onNavigatingTo = onNavigatingTo;


exports.onLoaded = function (args) {
    console.log("Page.onLoaded");
    console.keys(args);
};