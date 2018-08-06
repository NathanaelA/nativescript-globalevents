[![npm](https://img.shields.io/npm/v/nativescript-globalevents.svg)](https://www.npmjs.com/package/nativescript-globalevents)
[![npm](https://img.shields.io/npm/l/nativescript-globalevents.svg)](https://www.npmjs.com/package/nativescript-globalevents)
[![npm](https://img.shields.io/npm/dt/nativescript-globalevents.svg?label=npm%20d%2fls)](https://www.npmjs.com/package/nativescript-globalevents)
[![Twitter Follow](https://img.shields.io/twitter/follow/congocart.svg?style=social&label=Follow%20me)](https://twitter.com/congocart)


# nativescript-globalevents
A NativeScript plugin to deal with Global events

## Developed by
[![MasterTech](https://plugins.nativescript.rocks/i/mtns.png)](https://plugins.nativescript.rocks/mastertech-nstudio)


## License

This is released under the MIT License, meaning you are free to include this in any type of program -- However for entities that need support or a support contract, changes, enhancements and/or a commercial license please contact me at [http://nativescript.tools](http://nativescript.tools).

I also do contract work; so if you have a module you want built for NativeScript (or any other software projects) feel free to contact me [nathan@master-technology.com](mailto://nathan@master-technology.com).

[![Donate](https://img.shields.io/badge/Donate-PayPal-brightgreen.svg?style=plastic)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=HN8DDMWVGBNQL&lc=US&item_name=Nathanael%20Anderson&item_number=nativescript%2dglobalevents&no_note=1&no_shipping=1&currency_code=USD&bn=PP%2dDonationsBF%3ax%3aNonHosted)
[![Patreon](https://img.shields.io/badge/Pledge-Patreon-brightgreen.svg?style=plastic)](https://www.patreon.com/NathanaelA)


## Installation 

tns plugin add nativescript-globalevents


## Usage

To use the module you just `require()` it:

```js
require( "nativescript-globalevents" );
```

Notice: You do NOT need to keep a reference to it; and you only need to load it once.

It will automatically attach its methods to all the proper classes in the NativeScript library making it act as if they are built in.

What this does is automatically add support to allow you to setup events on all the page events globally.  For example; if you need a pageLoaded event to occur on every page; you can use this library to get a global pageLoaded event.

Events currently on the **Page** globally that are supported are:
- Page.navigatingToEvent
- Page.navigatedToEvent
- Page.navigatingFromEvent
- Page.navigatedFromEvent
- Page.shownModallyEvent
- Page.showingModallyEvent
- View.loadedEvent
- View.unloadedEvent

All these events list above run **AFTER** the normal page's equivalent event.  So the Page's navigatingTo will run before the Global navigatingTo event.

New Events:
- Page.createdPageEvent    = When a new Page is created.
- Page.loadedFirst         = Runs before the page's load
- Page.unloadedFirst       = Runs before the page's unload
- Page.navigatingToFirst   = Runs before the page's navigatingTo
- Page.navigatingFromFirst = Runs before the page's navigatingFrom

These *First* events will run **BEFORE** the normal page's equivalent event.  Please note; parts of the page MAY not be setup at this point in time, so be warned!

So basically the events goes:
<pre>
- Page Created Event

- Global Navigating to FIRST
- Page.OnNavigatingTo
- Global Navigating to
  
- Global Page Loaded FIRST  
- Page.onLoaded
- Global Page Loaded 
  
- Global Navigated to FIRST!
- Page.OnNavigatedTo
- Global Navigated to
</pre>

If you have any other global events you would like supported please open an issue on the github issue tracker and I will investigate its relevance.

## You ask, how exactly does this help?
Well, my usage is I have several plugins that need to be notified when a new page is loaded/unloaded to allow custom handling to occur automatically.  It could be useful for your own app if you need to do something globally when every page is loaded or unloaded.

```js
require('nativescript-globalevents'); // need only once in the application total

var Page = require('ui/page').Page;
Page.on(Page.navigatingToEvent, function() { console.log("We have navigated to a new page!"); });
```

## Why use this?
If you need to track globally an event and you don't want to put a handler in each separate page.xml/page.js file.

### Commands and functions
Static Page class now has four new STATIC functions

##### Page.on / Page.addEventHandler (eventName, callback[, thisArg])
##### Page.off / Page.removeEventHandler (eventName[[, callback], thisArg])

### Notes:
If thisArg is null/undefined it will use the current page's "this".

If callback is null on the off/removePageHandler it will remove ALL handlers.


## Angular and VueJS support
Angular and VueJS has their own event systems, however both of them create a underlying NativeScript page(s) to do things.  So in those cases you can use these events to actually tie in before the Angular or Vue framework events occur.  This is probably rarely needed; but it is a option if you find you need it.

### Angular
Do to the fact that the nativescript-angular plugin actually gets a reference to the "Page" variable, you have two choice for using this in Angular
1. You put the require('nativescript-globalevents') as the VERY first statement of the `main.ts` and `main.aot.ts` files
2. You put it anywhere BUT, the pageCreated event will never be called, as is to late to monkey patch the creation part of the class after Angular has got a reference. 

The `app.module.ts` has an example of how to tie into the events in Angular.    

