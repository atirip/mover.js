/*
* MIT Licensed
* Copyright (c) 2012, Priit Pirita, atirip@yahoo.com
* https://github.com/atirip/mover.js
*/
;(function(a,b,c){c&&c.extend(!0,c.easing,{easeOut:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c}});var d=function(){function o(a){switch(a){case"linear":return"linear";case"ease-out":return"easeOut";default:return"swing"}}function p(){b.jsVendor&&(d=b.jsVendor,e=b.cssVendor,f=b.has.threeD,g=b.transitionEnd,h=b.has.transform,i=b.translate)}var d,e,f,g,h,i,j,k,l=a.document,m=l.createElement("div"),n="data-moving";return m.setAttribute("data-test","t"),m.getAttribute("data-test")!=="t"?(j=function(a,b,c){var d=a.getAttributeNode(b);d||(d=l.createAttribute(b),a.setAttributeNode(d)),d.nodeValue=c+""},k=function(a,b){var c=a.getAttributeNode(b);return c.nodeValue}):(j=function(a,b,c){a.setAttribute(b,c)},k=function(a,b){return a.getAttribute(b)}),p.prototype={getXY:function(b,c){var e,g,i,j,h={x:0,y:0,left:0,top:0,tx:0,ty:0};return b=b&&b.length?b[0]:b,b&&b.nodeName?(e=a.getComputedStyle&&a.getComputedStyle(b)[d+"Transform"],e&&(f?(g=new WebKitCSSMatrix(e),h.tx=c?~~g.m41:g.m41,h.ty=c?~~g.m42:g.m42):-1!==e.indexOf("matrix")&&(g=e.substring(e.indexOf("(")+1,e.indexOf(")")).split(",").slice(4),g[0]=parseFloat(g[0].replace(/[^0-9\.]+/g,"")),g[1]=parseFloat(g[1].replace(/[^0-9\.]+/g,"")),h.tx=c?~~g[0]:g[0],h.ty=c?~~g[1]:g[1])),~b.style.top.indexOf("px")&&~b.style.left.indexOf("px")?(h.left=parseInt(b.style.left,10),h.top=parseInt(b.style.top,10),h.x=h.left+h.tx,h.y=h.top+h.ty):(i=b.getBoundingClientRect(),j=b.parentNode.getBoundingClientRect(),h.x=i.left-j.left,h.y=i.top-j.top,h.left=h.x-h.tx,h.top=h.y-h.ty),h):h},setXY:function(b,f){f=f||{},f.outOufBoundariesMultiplier=f.outOufBoundariesMultiplier||{x:{min:0,max:0},y:{min:0,max:0}},f.time=f.time||0,50>f.time&&(f.time=0);var p,q,r,s,t,l=function(a,b){var c=f.boundaries;if(c&&b&&c[b]){if(void 0!==c[b].min&&c[b].min>a)return c[b].min+(a-c[b].min)*f.outOufBoundariesMultiplier[b].min;if(void 0!==c[b].max&&a>c[b].max)return c[b].max+(a-c[b].max)*f.outOufBoundariesMultiplier[b].max}return a},m={},u=!1,v=function(){j(b,n,0),f.deferred?p.resolve():f.success&&f.success()},w=h;return void 0!==f.top&&(m.top=l(~~f.top,"y")),void 0!==f.left&&(m.left=l(~~f.left,"x")),b=b&&b.length?b[0]:b,!0===f.deferred&&c?p=c.Deferred():f.deferred&&(p=f.deferred),b&&b.nodeName&&!+k(b,n)?(s=this.getXY(b,f.round),!0===f.noTransform&&(w=!1),(f.flatten||f.deferred)&&(f.endEvent=!0),w?(q=s.tx+(void 0!==m.left?m.left-s.x:0),r=s.ty+(void 0!==m.top?m.top-s.y:0),t=function(){a.removeEventListener(g,t,!1),b.style[d+"TransitionDuration"]="0ms",f.flatten&&(void 0!==m.left&&(b.style.left=m.left+"px"),void 0!==m.top&&(b.style.top=m.top+"px"),b.style[d+"Transform"]=""),v()},f.time&&f.endEvent&&(u=!0,j(b,n,1),a.addEventListener(g,t,!1)),b.style[d+"TransitionProperty"]=e+"transform",b.style[d+"Transform"]=i(q+"px",r+"px"),b.style[d+"TransitionDuration"]=f.time+"ms",f.easing&&(b.style[d+"TransitionTimingFunction"]=f.easing),(!f.time||s.tx===q&&s.ty===r&&f.endEvent)&&(u=!0,t()),!u&&v()):(q=s.left+(void 0!==m.left?m.left-s.x:0),r=s.top+(void 0!==m.top?m.top-s.y:0),f.time&&(c||f.animate)?(j(b,n,1),c?c(b).stop().animate({left:q,top:r},f.time,o(f.easing),v):f.animate({left:q,top:r},f.time,o(f.easing),v)):(b.style.left=q+"px",b.style.top=r+"px",v())),f.deferred?p.promise():void 0):f.deferred?(p.reject(),p.promise()):(f.failure&&f.failure(),void 0)},halt:function(a,b){var e,f=h;return a=a&&a.length?a[0]:a,a&&a.nodeName?(b=b||{},!0===b.noTransform&&(f=!1),+k(a,n)?(j(a,n,0),f?(e=this.getXY(a),a.style[d+"Transition"]="",this.setXY(a,{left:e.x,top:e.y,flatten:b.flatten})):c?c(a).stop():b.stop&&b.stop(),!0):void 0):void 0}},p}();b.mover=d})(window,window.atirip||(window.atirip={}),window.jQuery);