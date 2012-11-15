# mover.js

Utility to move and drag elememts around

## Why?

The main reason of mover's existence is that I needed the following:

* Have an universal function for moving things around. If there's CSS ransformations available it shpuld use them, if not fall back to traditional way
* The same with animations, CSS transformations are smoother, prioritize ti use them
* Function that could take expected end results only, so I don't have to worry if there's any traditional or CSS transformations set earlier. Example: DIV has following style: `left: 100px; -webkit-transform: translate3D(-100px, 0, 0);`, so actual horizontal position according to the parent is `0`. Now, when I want to set actual left to 100px, then `mover.js` in traditional mode sets `left:200px`, in CSS transition mode sets `-webkit-transform: translate3D(0, 0, 0);`
* I have dragging applications, mover must implement boundaries, so I can just dump any mouse or finger coordinates into it and it takes care that movement occures only in predefined boundaries
* _Last but not least_ - on mobile CSS transformations excessive use will kill/crash your browser. I needed support to temporarily turn nodes CSS transformations on, use them for nodes smooth positioning, and then turn them off again, to avoid mobile browser crashes, preserve memory.

`mover.js` does all that, it is written in vanilla Javascript and has one possible dependancy. It takes advantage of jQuery if present and in generic usage jQuery is recommended (for animations and also for Deferred). In case where all targeted browsers have CSS transformations with transitionEnd event full support, jQuery is not needed. More specifically below.

## Usage:

Mover sets ourselves up into `window.atirip` namespace.

**Detect your browser features first**

Include `features-detector.js`

    <script src="path/to/features-detector.js" type="text/javascript"></script>

Or alternatively use your own detector of wish and provide the following classes and variables as below ( I use typical webkit browser values here as an example )

	atirip.jsVendor = "Webkit"
	atirip.cssVendor = "-webkit-"
	atirip.has = {
		threeD: true,
		transform: true
	}
	atirip.transitionEnd = "webkitTransitionEnd"
	atirip.translate = function(x, y) {
		return 'translate3d(' + (x||0) + ',' + (y||0) + ',0)'
	}


**Include mover.js:**

    <script src="path/to/mover.js" type="text/javascript"></script>

**Create mover object**

	var mover = new atirip.mover()

**Available methods**

	mover.getXY(node, round)

Returns:

	{
		x: 0, // summary coordinates
		y: 0,
		left: 0, // CSS traditional coordinates
		top: 0,
		tx: 0, // CSS translated coordinates
		ty: 0		
	}

Parameters:  
__node__ is single, pure vanilla Javascript DOM Node ( or in jQuery something like $('foo')[0] )  
__round__ whether to round CSS translated coordinates, deafult is false 

	mover.setXY(node, options)

Parameters:  
__node__ is single, pure vanilla Javascript DOM Node ( or in jQuery something like $('foo')[0] )  
__options__ Javascript class of options where:

__left__ desired position in pixels  
__top__ desired position in pixels  
__noTransform__ set true to force CSS transforms even if they are supported  
__deferred__ set true to use jQuery Deffereds, pass along Deferred object to use some other Promise API. Passed object must have methods `resolve()`, `reject()` and `promise()` a'la jQuery Deferred.  
__flatten__ removes CSS transition settings after done, default false  
__time__ in ms, desired time for transition, set 0 for no animation, default 0  
__easing__ easing if animated in CSS Transition style  ( f.e ease-out )  
__round__ whether to round CSS translated coordinates, deafult is false  
__success__ function to call after transition is done (as an alternative to Deferred)  
__failure__ function to call if transition failed to start (as an alternative to Deferred) 
 
mover sets `data-moving="1"` attribute on `node` when `time` is set, you cannot start another movement while current one is not finished. If you try, then `failure` is called or Deferred is rejected. 
 
__animate__	function to call if there's no jQuery present and no CSS transformations support. Takes parameters identical to [http://api.jquery.com/animate/](http://api.jquery.com/animate/)
		
__boundaries__ class of x&y boundaries:
 
 	{
 		x: { // top-bottom
 			max : 0,
 			min: 100
 		}
 		y: { // left-right
 			max : 0,
 			min: -100
 		}
 	}

__outOufBoundariesMultiplier__ class of x&y of out of boundaries multipliers

 	{
 		x: { // top-bottom
 			max : 0.5,
 			min: 0.5
 		}
 		y: { // left-right
 			max : 0.5,
 			min: 0.5
 		}
 	}

useful when dragging and rubber effect is needed - when you move box out of boundaries, then actual amount of left, top parameters passed will be multiplied with these settings

## Examples:

	
__Most simplistic__

	this.mover.setXY( $(something) , {
		left: 100
	});

	
__With callback__

	mover.setXY(node, {
		noTransform: true,
		top: 100,
		left: 500,
		time: 1000,
		easing: 'ease-out',
		callback: function() {
			alert('done')
		}
	})

__With jQuery Deferreds__

	$.when( mover.setXY(node, {
			flatten: 1,
			deferred: true,
			top: 100,
			left: 700,
			time: 1000,
			easing: 'ease-out',
			round: true,
		})
	).always(function() {
		alert('done')
	})


## Compatible

Tested on Firefox 16, Chrome 23, Opera 12 on Mountain Lion and Windows, IE 8, IE 7 on Windows
(Windows XP under Parallels 7), Safari 6 on Mountain Lion, iOS6, Android 2.3

## TODO

* nothing I know of.

## Contact me

For support, remarks and requests, please mail me at [atirip@yahoo.com](mailto:atirip@yahoo.com).

## License

Copyright (c) 2012 Priit Pirita, released under the MIT license.