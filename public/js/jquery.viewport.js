(function(b){var a={getElementPosition:function(d){var e=b(this);var c=d?e.parents(d):e.parents(":have-scroll");if(!c.length){return false}var h=a.getRelativePosition.call(this,d);var f=h.top-c.scrollTop();var g=h.left-c.scrollLeft();return{elemTopBorder:f,elemBottomBorder:f+e.height(),elemLeftBorder:g,elemRightBorder:g+e.width(),viewport:c,viewportHeight:c.height(),viewportWidth:c.width()}},getRelativePosition:function(d){var c=0;var f=0;var g=null;for(var e=b(this).get(0);e&&!b(e).is(d?d:":have-scroll");e=b(e).parent().get(0)){g=b(e);if(typeof g.data("pos")=="undefined"||new Date().getTime()-g.data("pos")[1]>1000){c+=e.offsetTop;f+=e.offsetLeft;g.data("pos",[[e.offsetTop,e.offsetLeft],new Date().getTime()])}else{c+=g.data("pos")[0][0];f+=g.data("pos")[0][1]}}return{top:Math.round(c),left:Math.round(f)}},aboveTheViewport:function(c){var d=a.getElementPosition.call(this);return d?d.elemTopBorder-c<0:false},partlyAboveTheViewport:function(c){var d=a.getElementPosition.call(this);return d?d.elemTopBorder-c<0&&d.elemBottomBorder-c>=0:false},belowTheViewport:function(c){var d=a.getElementPosition.call(this);return d?d.viewportHeight<d.elemBottomBorder+c:false},partlyBelowTheViewport:function(c){var d=a.getElementPosition.call(this);return d?d.viewportHeight<d.elemBottomBorder+c&&d.viewportHeight>d.elemTopBorder+c:false},leftOfViewport:function(c){var d=a.getElementPosition.call(this);return d?d.elemLeftBorder-c<=0:false},partlyLeftOfViewport:function(c){var d=a.getElementPosition.call(this);return d?d.elemLeftBorder-c<0&&d.elemRightBorder-c>=0:false},rightOfViewport:function(c){var d=a.getElementPosition.call(this);return d?d.viewportWidth<d.elemRightBorder+c:false},partlyRightOfViewport:function(c){var d=a.getElementPosition.call(this);return d?d.viewportWidth<d.elemRightBorder+c&&d.viewportWidth>d.elemLeftBorder+c:false},inViewport:function(c){var d=a.getElementPosition.call(this);return d?!(d.elemTopBorder-c<0)&&!(d.viewportHeight<d.elemBottomBorder+c)&&!(d.elemLeftBorder-c<0)&&!(d.viewportWidth<d.elemRightBorder+c):true},getState:function(i,e,d){var j={inside:false,posY:"",posX:""};var k=a.getElementPosition.call(this,e);if(!k){j.inside=true;return j}var m=k.elemTopBorder-i<0;var o=k.viewportHeight<k.elemBottomBorder+i;var n=k.elemLeftBorder-i<0;var c=k.viewportWidth<k.elemRightBorder+i;if(d){var f=k.elemTopBorder-i<0&&k.elemBottomBorder-i>=0;var g=k.viewportHeight<k.elemBottomBorder+i&&k.viewportHeight>k.elemTopBorder+i;var l=k.elemLeftBorder-i<0&&k.elemRightBorder-i>=0;var h=k.viewportWidth<k.elemRightBorder+i&&k.viewportWidth>k.elemLeftBorder+i}if(!m&&!o&&!n&&!c){j.inside=true;return j}if(d){if(f&&g){j.posY="exceeds"}else{if((f&&!g)||(g&&!f)){j.posY=f?"partly-above":"partly-below"}else{if(!m&&!o){j.posY="inside"}else{j.posY=m?"above":"below"}}}if(l&&h){j.posX="exceeds"}else{if((l&&!h)||(l&&!h)){j.posX=l?"partly-above":"partly-below"}else{if(!n&&!c){j.posX="inside"}else{j.posX=n?"left":"right"}}}}else{if(m&&o){j.posY="exceeds"}else{if(!m&&!o){j.posY="inside"}else{j.posY=m?"above":"below"}}if(n&&c){j.posX="exceeds"}else{if(!n&&!c){j.posX="inside"}else{j.posX=n?"left":"right"}}}return j},haveScroll:function(){return this.scrollHeight>this.offsetHeight||this.scrollWidth>this.offsetWidth},generateEUID:function(){var c="";for(var d=0;d<32;d++){c+=Math.floor(Math.random()*16).toString(16)}return c}};b.extend(b.expr[":"],{"in-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.inViewport.call(f,c)},"above-the-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.aboveTheViewport.call(f,c)},"below-the-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.belowTheViewport.call(f,c)},"left-of-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.leftOfViewport.call(f,c)},"right-of-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.rightOfViewport.call(f,c)},"partly-above-the-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.partlyAboveTheViewport.call(f,c)},"partly-below-the-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.partlyBelowTheViewport.call(f,c)},"partly-left-of-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.partlyLeftOfViewport.call(f,c)},"partly-right-of-viewport":function(f,d,e){var c=typeof e[3]=="string"?parseInt(e[3],10):0;return a.partlyRightOfViewport.call(f,c)},"have-scroll":function(c){return a.haveScroll.call(c)}});b.fn.viewportTrack=function(c){var d={threshold:0,allowPartly:false,forceViewport:false,tracker:false,checkOnInit:true};if(typeof c=="undefined"){return a.getState.apply(this,[d.threshold,d.forceViewport,d.allowPartly])}else{if(typeof c=="string"){if(c=="destroy"){return this.each(function(){var f=b(this);if(typeof f.data("viewport_euid")=="undefined"){return true}var e=b([]);if(typeof f.data("viewport")!="undefined"){f.data("viewport").forEach(function(g){e=b.extend(e,f.parents(g))})}else{e=b.extend(e,f.parents(":have-scroll"))}e.each(function(){if(b(this).get(0).tagName=="BODY"){b(window).unbind(".viewport"+f.data("viewport_euid"))}else{b(this).unbind(".viewport"+f.data("viewport_euid"))}});f.removeData("viewport_euid")})}else{b.error("Incorrect parameter value.");return this}}else{if(typeof c=="object"){b.extend(d,c);if(!d.tracker&&typeof d.tracker!="function"){return a.getState.apply(this,[d.threshold,d.forceViewport,d.allowPartly])}else{return this.each(function(){var g=b(this);var f=this;if(typeof g.data("viewport_euid")=="undefined"){g.data("viewport_euid",a.generateEUID.call())}if(d.forceViewport){if(typeof g.data("viewport")=="undefined"){g.data("viewport",[d.forceViewport])}else{g.data("viewport").push(d.forceViewport)}}if(d.checkOnInit){d.tracker.apply(f,[a.getState.apply(f,[d.threshold,d.forceViewport,d.allowPartly])])}var e=d.forceViewport?g.parents(d.forceViewport):g.parents(":have-scroll");if(!e.length){if(d.forceViewport){b.error("No such parent '"+d.forceViewport+"'")}else{d.tracker.apply(f,[{inside:true,posY:"",posX:""}]);return true}}if(e.get(0).tagName=="BODY"){b(window).bind("scroll.viewport"+g.data("viewport_euid"),function(){d.tracker.apply(f,[a.getState.apply(f,[d.threshold,d.forceViewport,d.allowPartly])])})}else{e.bind("scroll.viewport"+g.data("viewport_euid"),function(){d.tracker.apply(f,[a.getState.apply(f,[d.threshold,d.forceViewport,d.allowPartly])])})}})}}}}}})(jQuery);