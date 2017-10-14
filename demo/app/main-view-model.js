var Observable = require("data/observable").Observable;
var utils = require('utils/utils');

function createViewModel() {
    var viewModel = new Observable();
	viewModel.tap = function() {
        utils.openUrl("http://www.master.technology");
    }

    return viewModel;
}

exports.createViewModel = createViewModel;