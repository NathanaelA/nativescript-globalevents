import { Component } from "@angular/core";
const utils = require("utils/utils");

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})

export class AppComponent {
    public tap() {
        console.log("Tap");
        utils.openUrl("http://www.master.technology");
    }


}
