import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { AppRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";

import { ItemService } from "./item/item.service";
import { ItemsComponent } from "./item/items.component";
import { ItemDetailComponent } from "./item/item-detail.component";

require('nativescript-globalevents');

import { Page } from "ui/page";

// The "pageCreated" event will not be called if the ns-globalevents is not require'd before the nativescript-angular is imported!
// So if you want to use this event, you need to put the "require('nativescript-globalevents');" as the
// _very_ first line of the main.ts and main.aot.ts files.
(<any>Page).on('pageCreated', function(args) {
    console.log("Global Page Created event");
});

(<any>Page).on('loadedFirst', function(args) {
    console.log("Global Page Loaded FIRST event");
});

(<any>Page).on('loaded', function(args) {
    console.log("Global Page Loaded event");
});

(<any>Page).on('navigatingToFirst', function(args) {
    console.log("Global Navigating to FIRST");
});

(<any>Page).on('navigatingTo', function(args) {
    console.log("Global Navigating to");
});

(<any>Page).on('navigatedTo', function(args) {
    console.log("Global Navigated to");
});

(<any>Page).on('navigatedToFirst', function(args) {
    console.log("Global Navigated to FIRST!");
});


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpModule } from "nativescript-angular/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ItemsComponent,
        ItemDetailComponent
    ],
    providers: [
        ItemService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
