!function(a,b){"object"==typeof exports&&"object"==typeof module?module.exports=b(require("JsFile")):"function"==typeof define&&define.amd?define(["JsFile"],b):"object"==typeof exports?exports.JsFileRtf=b(require("JsFile")):a.JsFileRtf=b(a.JsFile)}(this,function(a){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){if(!a)throw new ReferenceError("this hasn"t been initialised - super() hasn"t been called");return!b||"object"!=typeof b&&"function"!=typeof b?a:b}function g(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function, not "+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)}Object.defineProperty(b,"__esModule",{value:!0});var h=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),i=c(1),j=d(i),k=c(2),l=d(k),m=j["default"].Engine,n={extension:["rtf"],mime:["text/rtf","application/rtf"]},o=function(a){function b(){e(this,b);var a=f(this,Object.getPrototypeOf(b).apply(this,arguments));return a.createDocument=l["default"],a.files=n,a}return g(b,a),h(b,null,[{key:"test",value:function(a){return Boolean(a&&m.validateFile(a,n))}}]),b}(m);o.mimeTypes=n.mime.slice(0),b["default"]=o},function(b,c){b.exports=a},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(){var a=arguments.length<=0||void 0===arguments[0]?"":arguments[0],b=this.fileName;return new Promise(function(c){var d={meta:{name:b},content:[]};if(!a[0])return c(new r(d));a=a.replace(/\\"3[fF]/g,"?");var e=a.length,f=[],g=[],h=-1,j=r.elementPrototype,l=r.elementPrototype;l.properties.tagName="P",j.children.push(l),d.content.push(j);for(var n=0;e>n;n++){var p=a[n],s=f[h];switch(p){case"\\":if(!s)break;var t=a[n+1];if("\\"===t&&(0,i["default"])(s))(0,q["default"])(l,{textContent:t});else if("~"===t&&(0,i["default"])(s))(0,q["default"])(l,{textContent:" "});else if("_"===t&&(0,i["default"])(s))(0,q["default"])(l,{textContent:"-"});else if("*"===t)s[t]=!0;else if("""===t){n+=2;var u=a.substr(n,2);if((0,i["default"])(s)){var v=parseInt(u,16);s.mac&&77!=g[s.f]?"1251"==s.ansicpg||"1029"==s.lang?(0,q["default"])(l,{textContent:(0,k["default"])(v)}):(0,q["default"])(l,{textContent:String.fromCharCode(v)}):(0,q["default"])(l,{textContent:(0,m["default"])(v)})}}else if(t>="a"&&"z">=t||t>="A"&&"Z">=t){for(var w="",x="",y=0,z=n+1;e>z;z++,y++)if(t=a[z],t>="a"&&"z">=t||t>="A"&&"Z">=t){if(x)break;w+=t}else if(t>="0"&&"9">=t)x+=t;else{if("-"!==t)break;if(x)break;x+=t}n+=y-1,w=w.toLowerCase();var A="";if(o["default"][w]){var B=o["default"][w](),C=B.data,D=B.di;n+=D||0,(0,q["default"])(l,C)}else switch(w){case"u":A+=String.fromCharCode(Number(x));var E=null!=s.uc?Number(s.uc):1;E>0&&(n+=E);break;case"page":j.children.pop(),j=r.elementPrototype,j.children.push(l),d.content.push(j);break;case"bin":n+=Number(x);break;case"tab":(0,q["default"])(l,{textContent:"	"});break;case"fcharset":g[s.f]=x;break;case"par":l=r.elementPrototype,l.properties.tagName="P",j.children.push(l);break;default:window.wds=window.wds||{},window.wds[w]=window.wds[w]||0,window.wds[w]++,s[w]=x||!0}A&&(0,i["default"])(s)&&(0,q["default"])(l,{textContent:A})}else(0,q["default"])(l,{textContent:" "});n++;break;case"{":if(h++,f[h]={},h>0){var F=h-1;f[h]={};for(var z in f[F])f[F].hasOwnProperty(z)&&(f[h][z]=f[F][z])}break;case"}":var G=r.elementPrototype;G.properties.tagName="SPAN",l.children.push(G),f.pop(),h--;break;case"\x00":case"\r":case"\f":case"\b":case"	":break;case"\n":(0,q["default"])(l,{textContent:p});break;default:s&&(0,i["default"])(s)&&(0,q["default"])(l,{textContent:p})}}c(new r(d))})}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=e;var f=c(1),g=d(f),h=c(3),i=d(h),j=c(4),k=d(j),l=c(5),m=d(l),n=c(6),o=d(n),p=c(16),q=d(p),r=g["default"].Document},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var c=["*","fonttbl","colortbl","datastore","themedata","stylesheet","info","picw","pich"];b["default"]=function(a){if(!a)return!1;var b=c.some(function(b){return a[b]});return!b}},function(a,b){"use strict";function c(a){return a>65535?(a-=65536,String.fromCharCode(55296+(a>>10),56320+(1023&a))):String.fromCharCode(a)}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=c},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var c={131:201,132:209,135:225,142:233,146:237,150:241,151:243,156:250,231:193,234:205,238:211,242:218};b["default"]=function(a){var b=c[a];return b&&(a=String.fromCharCode(b)),a}},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(b,"__esModule",{value:!0});var e=c(7),f=d(e),g=c(8),h=d(g),i=c(9),j=d(i),k=c(10),l=d(k),m=c(11),n=d(m),o=c(12),p=d(o),q=c(13),r=d(q),s=c(14),t=d(s),u=c(15),v=d(u);b["default"]={ab:n["default"],rquote:f["default"],rdblquote:h["default"],lquote:j["default"],ldblquote:l["default"],listtext:v["default"],b:p["default"],i:r["default"],ul:t["default"]}},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=function(){return{di:1,data:{textContent:"’"}}}},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=function(){return{di:1,data:{textContent:"”"}}}},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=function(){return{di:1,data:{textContent:"‘"}}}},function(a,b){"use strict";Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=function(){return{di:1,data:{textContent:"“"}}}},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(b,"__esModule",{value:!0});var e=c(12),f=d(e);b["default"]=f["default"]},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(){var a=h.elementPrototype;return a.properties.tagName="SPAN",a.style.fontWeight="bold",{data:{children:[a]}}}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=e;var f=c(1),g=d(f),h=g["default"].Document},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(){var a=h.elementPrototype;return a.properties.tagName="SPAN",a.style.fontStyle="italic",{data:{children:[a]}}}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=e;var f=c(1),g=d(f),h=g["default"].Document},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(){var a=h.elementPrototype;return a.properties.tagName="SPAN",a.style.textDecoration="underline",{data:{children:[a]}}}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=e;var f=c(1),g=d(f),h=g["default"].Document},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(){var a=h.elementPrototype;return a.properties.tagName="LI",{data:{children:[a]}}}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=e;var f=c(1),g=d(f),h=g["default"].Document},function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}function e(a,b){var c=b.textContent,d=b.children;if(d)a.children.push.apply(a.children,d);else if(c){var e=a.children.length,f=a.children[e-1];f&&"SPAN"===f.properties.tagName||(f=h.elementPrototype,f.properties.tagName="SPAN",a.children.push(f)),f.properties.textContent+=c}return a}Object.defineProperty(b,"__esModule",{value:!0}),b["default"]=e;var f=c(1),g=d(f),h=g["default"].Document}])});