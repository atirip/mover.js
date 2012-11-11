/*jshint laxcomma:true, laxbreak: true, asi:true */
/*
* MIT Licensed
* Copyright (c) 2012, Priit Pirita, atirip@yahoo.com
* https://github.com/atirip/mover.js
*/

// it is sort of dependent of jQuery - good to have, but not nessesary

;(function(window, APP, $) {

	if ($) $.extend(true, $.easing, {
		easeOut: function(x,t,b,c,d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b
		}

	})

var mover = (function() {

	var	jsVendor, cssVendor, hasThreeD, transitionEndEvent, hasTransform, translate, setAttr, getAttr
	,	doc = window.document
	,	div = doc.createElement('div')
	,	attrName = 'data-moving'

	// cross-browser set/get attribute
	div.setAttribute("data-test", "t")
	if ( div.getAttribute("data-test") !== "t" ) {
		// lifted from jQuery for IE<8
		setAttr = function( node, name, value ) {
			var ret = node.getAttributeNode( name )
			if ( !ret ) {
				ret = doc.createAttribute( name )
				node.setAttributeNode( ret )
			}
			ret.nodeValue = value + ""
		}
		getAttr = function( node, name ) {
			var ret = node.getAttributeNode( name )
			return ret.nodeValue
		}
	} else {
		setAttr = function( node, name, val ) {
			node.setAttribute(name, val)
		}
		getAttr = function( node, name ) {
			return node.getAttribute(name)
		}
	}

	// matches jQuery style easing names to CSS easings
	function jsEasing(cssEasing) {
		switch(cssEasing) {
			case 'linear':
				return 'linear'
			case 'ease-out':
				return 'easeOut'
			default:
				return 'swing'
		}
	}

	function constructor() {
		// it depends from feature-detector.js or falls back into basics
		if ( APP.jsVendor ) {
			jsVendor = APP.jsVendor
			cssVendor = APP.cssVendor
			hasThreeD = APP.has.threeD
			transitionEndEvent = APP.transitionEnd
			hasTransform = APP.has.transform
			translate = APP.translate
		}
	}

	constructor.prototype = {
		/*
			node - DOM node
			round - wheter to round CSS transform X&Y (yes, you can transform by not full pixels)
		*/
		getXY: function(node, round) {
			var transform
			,	matrix
			,	pos = {
					x: 0, // sum of coordinates
					y: 0,
					left: 0, // CSS coordinates
					top: 0,
					tx: 0, // translate coordinates
					ty: 0
				}
			,	nr
			,	pr
				
			// if somebody passed jQuery result?
			node = node && node.length ? node[0] : node
			if ( !node || !node.nodeName ) { return pos }

			transform = window.getComputedStyle && window.getComputedStyle(node)[jsVendor + 'Transform']
			if ( transform) {
				if ( hasThreeD) {
					// webkit
					matrix = new WebKitCSSMatrix(transform)
					pos.tx = round ? ~~matrix.m41 : matrix.m41
					pos.ty = round ? ~~matrix.m42 : matrix.m42
				} else if ( -1 !== transform.indexOf('matrix') ) {
					// parse from CSS string
					matrix = transform.substring(transform.indexOf('(')+1, transform.indexOf(')')).split(',').slice(4)
					matrix[0] = parseFloat(matrix[0].replace(/[^0-9\.]+/g, ''))
					matrix[1] = parseFloat(matrix[1].replace(/[^0-9\.]+/g, ''))
					pos.tx = round ? ~~matrix[0] : matrix[0]
					pos.ty = round ? ~~matrix[1] : matrix[1]
				}
			}

			// it is faster if inline styles in px for both are set, I guess TODO: get some proof
			if ( ~node.style.top.indexOf('px') && ~node.style.left.indexOf('px') ) {
				pos.left = parseInt(node.style.left, 10)
				pos.top = parseInt(node.style.top, 10)
				pos.x = pos.left + pos.tx
				pos.y = pos.top + pos.ty
			} else {
				nr = node.getBoundingClientRect()
				pr = node.parentNode.getBoundingClientRect()
				pos.x = nr.left - pr.left
				pos.y = nr.top - pr.top
				pos.left = pos.x - pos.tx
				pos.top = pos.y - pos.ty
			}
			return pos
		},

		setXY: function(node, options) {

			// if somebody passed jQuery result?
			node = node && node.length ? node[0] : node
			if ( !node || !node.nodeName || (+getAttr(node, attrName)||0) ) return

			options = options || {}
			options.outOufBoundariesMultiplier = options.outOufBoundariesMultiplier || {
				x: {min: 0, max : 0}, 
				y: {min: 0, max : 0}
			}
			
			options.time = options.time||0
			// too small time setting sometimes means, that transitionEnd does not fire at all,
			// this is safety net, as when time=0 we fire transitionEnd manually
			options.time < 50 && (options.time = 0)

			var checkBoundaries = function(k, z) {
					var boundaries = options.boundaries
					if ( boundaries && z && boundaries[z] ) { 
						if ( undefined !== boundaries[z].min && k < boundaries[z].min ) {
							return boundaries[z].min + (k - boundaries[z].min) * options.outOufBoundariesMultiplier[z].min
						} else if ( undefined !== boundaries[z].max && k > boundaries[z].max ) {
							return boundaries[z].max + (k - boundaries[z].max) * options.outOufBoundariesMultiplier[z].max
						}
					}
					return k
				}
			,	dest = {}
			,	dfd
			,	X
			,	Y
			,	pos = this.getXY(node, options.round)
			,	transitionEnd
			,	resolved = false
			,	finish = function() {
					setAttr(node, attrName, 0)
					if ( options.deferred ) {
						dfd.resolve()
					} else if ( options.callback ) {
						options.callback()
					}
				}
			,	useTransform = hasTransform

			;(undefined !== options.top) && (dest.top = checkBoundaries(~~options.top, 'y'))
			;(undefined !== options.left) && (dest.left = checkBoundaries(~~options.left, 'x'))

			// if not jQuery present you must pass deferred object, otherwise pass just true
			if ( true === options.deferred && $ ) {
				dfd = $.Deferred()
			} else if ( options.deferred ) {
				dfd = options.deferred
			}

			// default is to use transform when available
			// set noTransform to true to force standard animation
			true === options.noTransform && (useTransform = false)
			// you can not flatten without transitionEnd event fired
			;(options.flatten || options.deferred) && (options.endEvent = true)

			if ( useTransform ) {
				// we change transform property
				X = pos.tx + ( undefined !== dest.left ? dest.left - pos.x : 0 )
				Y = pos.ty + ( undefined !== dest.top ? dest.top - pos.y  : 0 )

				transitionEnd = function() {
					window.removeEventListener(transitionEndEvent, transitionEnd, false)
					node.style[jsVendor + 'TransitionDuration'] = '0ms'
					if ( options.flatten ) {
						undefined !== dest.left && ( node.style.left = dest.left + 'px' )
						undefined !== dest.top && ( node.style.top = dest.top + 'px' )
						node.style[jsVendor + 'Transform'] = ''
						// actually there's no need, because transition setting do not put node in GPU accelerated mode
						// node.style[jsVendor + 'Transition'] = ''
					}
					finish()
				}

				if ( options.time && options.endEvent ) {
					resolved = true
					setAttr(node, attrName, 1)
					window.addEventListener(transitionEndEvent, transitionEnd, false)
				}

				node.style[jsVendor + 'TransitionProperty'] = cssVendor + 'transform'
				node.style[jsVendor + 'Transform'] = translate(X + 'px', Y + 'px')
				node.style[jsVendor + 'TransitionDuration'] = options.time + 'ms'
				options.easing && (node.style[jsVendor + 'TransitionTimingFunction'] = options.easing)

				// there is no transition and also no transition end event is fired when time=0 or no change in X,Y
				if ( !options.time || (pos.tx === X && pos.ty === Y) && options.endEvent ) {
					resolved = true
					transitionEnd()
				}
				!resolved && finish()

			} else {
				X = pos.left + ( undefined !== dest.left ? dest.left - pos.x : 0 )
				Y = pos.top + ( undefined !== dest.top ? dest.top - pos.y  : 0 )
				
				if ( options.time && ($ || options.animate) ) {
					setAttr(node, attrName, 1)
					if ( $ ) {
						$(node).stop().animate({left: X, top: Y}, options.time, jsEasing(options.easing), finish )
					} else {
						options.animate({left: X, top: Y}, options.time, jsEasing(options.easing), finish )
					}
				} else {
					node.style.left = X + 'px'
					node.style.top = Y + 'px'
					finish()
				}
			}
			if ( options.deferred ) {
				return dfd.promise()
			}				
		}
	}

	return constructor
	
})() // end of class definition

APP.mover = mover
	
})(window, window.atirip || (window.atirip={}), window.jQuery);
