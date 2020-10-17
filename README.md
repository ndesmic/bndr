# bndr

Bndr is a multi-way data-binding library.  Its design allows you to keep great semantic separation of your html and js.  You do not write html in your js, you do not need to pollute your html with special syntax and attributes, you don't need to use special observable data stores, it doesn't attach or require strange properties on your model.  Just setup the Bndr "glue", and everything just works.

Bndr is also very modular so you can take as much or as little as you want as well as write extensions for it. Bndr is web-first, that means the entirety of the project should be web-accessable, there is no package, there is no command-line build process, you can create what you need from the [Bndr build web-application](http://ndesmic.github.io/bndr/).

Under the hood bndr uses proxies to observe changes making it fast and ergonomic.  You will need a browser that supports them.

In this codebase "selector" is a string representing a css selector (e.g. "#id.class[attr] div"). "accessor" is a string representing a property accessor (e.g. "property.subproperty.subsubproperty").

## bndr.core

This module contains all the basic code for bndr.  You can write extensions with it but not a lot else. There are a few basic methods on bndr:

### setModel(model)

This sets the model that will be observed with proxies.  Note that arrays have special behavior, they will duplicate their template for each item in the array and the object in the array will act the same way a singular model would within that template.  Adding or removing items will add or remove those template automatically. This allows you to create dynamic lists.

### setTemplate(element)

This sets the template which acts as the entry point for the bndr's DOM scope. A template element will be stamped out, an existing element will be directly bound to.

### attachTo(element)

This will attach the bndr to that DOM element and stamp out the template.  Use this if your template is a template element that will add to the DOM.

### attach()

This will attach the bndr to existing DOM. Not useful with arrays.

### Bndr.register(registeration)

This is a static method that registers an extension.  A registration has 3 properties:

#### api

This is an object with multiple keys, each representing an API method that will be added to bndr globally. There are muliples because sometime it's useful to have multiple related methods like bindClass and bindClassReversed that use almost all of the same code but with a few parameter changes. Each function should return a binding object.  A binding object can contain any properties you find useful for implementing the binding but at the very least it needs a "type" which an extension unique string to identify which binding implementation to use. Optionally, but most likely, you'll also provide an "accessor" which determines which property will be watched to trigger the implementation.

#### implementation

This is a function that takes in an object with:

* elements - an array of elements at the root of the bndr.
* model - the model
* binding - the binding that the user setup with your API method.
* storage - a tree of maps that lets you store data for lookup on the bndr.  This is useful for remembering event handlers and the like.
* root - the dom root from the bndrs point of view
* isInitial - this will be true of this is the first time the binding is hit, false otherwise. Useful if you need to set things up on the first run.

This is where all the meat happens.  This will be triggered anytime the accessed property (given by the bindings "accessor" property if it exists) changes.

#### type

A string to identify the type.  This should match the type of the binding object the API method creates.  Should be unique from other bindings.

## bndr.dom

This module is where the meat is.  This allows you to bind to dom elements. Extension methods include:

### bindElement(selector, accessor)

For regular elements this will bind the model value to textContent.  For input elements it should do what you expect:  checkboxes will be set with truthy or falsey values, text and textarea will get the text, selects will select the matching key, radios will select the matching value in the group, all others will have their value set to the propery value.

### bindElementReverse(selector, accessor, [initialBind=true])

This is the reverse of bindElement. It will ignore changes to the model but will change the model if the input value changes.  This does nothing for non-input elements.  "initialBind" will allow the model to take the initial value of the input.

### bindElementTwoWay(selector, accessor, [initialBind=true])

This will bind two directions.  Updates to the model will change the element, updates to the element will change the model.

## bndr.class

This module lets you set classes on elements.

### bindClass(selector, accessor, className)

This will set the class if the property is truthy, and remove it otherwise.

### bindClassReversed(selector, accessor, className)

This works like bind class except reversed.  If falsey is sets the class and removes it otherwise.

## bndr.attributes

This module lets you set attributes.

### bindAttribute(selector, accessor, attributeName)

This will set the attribute to the property value.

### bindAttributeExistence(selector, accessor, attributeName)

This will add the attribute if the value is truthy and remove it otherwise. Good for things like disabled.

### bindAttributeExistenceReversed(selector, accessor, attributeName)

This will add the attribute if the value is falsey and remove it otherwise.

## bndr.style

This module lets you set styles.

### bindStyle(selector, accessor, style)

This set the style to the property value.

## bndr.toggle

This module gives multi-toggle functionality to elements.

### bindToggle(selector, eventName, accessor, [values=[true,false]])

This will toggle the model property between values on the particular event.  By default this is between true and false, though using "values" you can add an array of values to toggle between.  You can have many values and they will cycle in order. This is good for building toggle buttons.

## bndr.events

This module lets you set events.

### bindEvent(selector, eventName, handler, accessor)

This will attach an event listener with the eventName to the element, the handle is the function that handles it.  The first argument of the handler will be the event, the second will be the model property.  Note that selector can also be an object that has the method addEventListener if you wish to accept events from outside sources.

## bndr.compute

This module compute other values from your model.

### computeValue(accessors, handler, resultAccessor)

"accessors" can be a single string or an array of strings representing accessors. This will take in the properties each accessor points and if any of them changes it will run the handler, the return value of which will be set to the property indicated by the resultAccessor. Don't use accessors that are not used to compute the new value.  Also, because the values are set to the model, extra care needs to be taken to avoid circular update loops.

## bndr.change

This module observes changes to a property and runs a function.

### bindChange(accessor, handler)

When the accessed property changes, the handler will run.  The first argument passed is the updated value, the second is the whole model.

## bndr.storage

This module allows you to persist values using indexedDB.

### bindStorage(accessor, namespace)

When the property changes that change will set the value to the namespace in indexedDB. This value will also be loaded into the property if it already existed the first time this binding is run.

## bndr.drag

This module  is used for drag operations.

### bindDrag(selector, accessor)

When the user drags over the selector, the accessed property will be set to true, false if else.

## bndr.view

This module is used for setting vanilla views.

### bindView(selector, accessor, view, options)

This will take the provided view (the whole module, not just the create function) and pass it the selected element as "root", and the accessed property as "model" on the options passed into create.  Options are extra properties to be merged into options.  This is useful for making subviews and otherwise breaking down the view code into smaller, manageable pieces.
