# nativescript-globalevents
A NativeScript plugin to deal with Global events

## License

This is released under the MIT License, meaning you are free to include this in any type of program -- However for entities that need a support contract, changes, enhancements and/or a commercial license please contact me (nathan@master-technology.com).


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
- View.loaded
- View.unloaded

If you have any other global events you would like supported please open an issue on the github issue tracker and I will investigate its relevance.

## You ask, how exactly does this help?
Well, my usage is I have several plugins that need to be notified when a new page is loaded/unloaded to allow custom handling to occur automatically.  It could be useful for your own app if you need to do something globally when every page is loaded or unloaded.

```js
require('nativescript-globalevents'); // need only once in the application total

var Page = require('ui/page').Page;
Page.on(Page.navigatingTo, function() { console.log("We have navigated to a new page!"); });
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
