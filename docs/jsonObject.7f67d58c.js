parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"iy5t":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e={name:"jsonObject",components:{jsonKeyValue:()=>require("_bundle_loader")(require.resolve("./jsonKeyValue.vue"))},props:{},data:()=>({masterValue:[],value:{},previousValueAsString:"{}"}),mounted(){for(const e in this.$attrs.initValue)this.masterValue.push({key:e,value:this.$attrs.initValue[e]});this.attemptToInformParent()},methods:{updateValue(){let e={};for(const t of this.masterValue)e[t.key]=t.value;this.value=e},attemptToInformParent(){this.updateValue();let e=this.value,t=JSON.stringify(e);this.previousValueAsString!=t&&(this.previousValueAsString=t,this.$listeners.changeValue instanceof Function&&this.$listeners.changeValue(e))},addKeyValue(){if(0==this.masterValue.length)this.masterValue.push({key:"untitled-1",value:null});else{let e=this.masterValue[this.masterValue.length-1],t=e.key.replace(/.+?(\d+)/,"$1"),a=e.key.replace(/(.+?)\d+/,"$1");a+=t-0==t-0?++t:"-1",this.masterValue.push({key:a,value:null})}this.attemptToInformParent()},updateKeyValue(e,t,a){for(const s in this.masterValue){this.masterValue[s].key==e&&(this.masterValue[s]={key:t,value:a})}this.attemptToInformParent()},deleteKey(e){for(const t in this.masterValue){this.masterValue[t].key==e&&delete this.masterValue[t]}this.masterValue=this.masterValue.filter(e=>void 0!==e),this.attemptToInformParent()}}};exports.default=e;
(function(){var e=exports.default||module.exports;"function"==typeof e&&(e=e.options),Object.assign(e,{render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{"json-object-fh3935":"","object-fh3935":""}},[e._l(this.masterValue,function(t,a){return[n("jsonKeyValue",{key:a,attrs:{initKey:t.key,initValue:t.value},on:{changeValue:e.updateKeyValue,delete:e.deleteKey}})]}),e._v(" "),n("button",{attrs:{"add-button-fh3935":"",tabindex:"1"},on:{click:e.addKeyValue}},[e._v(" + ")])],2)},staticRenderFns:[],_compiled:!0,_scopeId:null,functional:void 0});})();
},{"_bundle_loader":"z1Am","./jsonKeyValue.vue":[["jsonKeyValue.dad8e38c.js","neZM"],"neZM"]}],"Bh1I":[function(require,module,exports) {
var t=null;function e(){return t||(t=n()),t}function n(){try{throw new Error}catch(e){var t=(""+e.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);if(t)return r(t[0])}return"/"}function r(t){return(""+t).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/,"$1")+"/"}exports.getBundleURL=e,exports.getBaseURL=r;
},{}],"z1Am":[function(require,module,exports) {
var r=require("./bundle-url").getBundleURL;function e(r){Array.isArray(r)||(r=[r]);var e=r[r.length-1];try{return Promise.resolve(require(e))}catch(n){if("MODULE_NOT_FOUND"===n.code)return new s(function(n,i){t(r.slice(0,-1)).then(function(){return require(e)}).then(n,i)});throw n}}function t(r){return Promise.all(r.map(u))}var n={};function i(r,e){n[r]=e}module.exports=exports=e,exports.load=t,exports.register=i;var o={};function u(e){var t;if(Array.isArray(e)&&(t=e[1],e=e[0]),o[e])return o[e];var i=(e.substring(e.lastIndexOf(".")+1,e.length)||e).toLowerCase(),u=n[i];return u?o[e]=u(r()+e).then(function(r){return r&&module.bundle.register(t,r),r}).catch(function(r){throw delete o[e],r}):void 0}function s(r){this.executor=r,this.promise=null}s.prototype.then=function(r,e){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.then(r,e)},s.prototype.catch=function(r){return null===this.promise&&(this.promise=new Promise(this.executor)),this.promise.catch(r)};
},{"./bundle-url":"Bh1I"}],"Ijyk":[function(require,module,exports) {
module.exports=function(n){return new Promise(function(e,o){var r=document.createElement("script");r.async=!0,r.type="text/javascript",r.charset="utf-8",r.src=n,r.onerror=function(n){r.onerror=r.onload=null,o(n)},r.onload=function(){r.onerror=r.onload=null,e()},document.getElementsByTagName("head")[0].appendChild(r)})};
},{}],0:[function(require,module,exports) {
var b=require("z1Am");b.register("js",require("Ijyk"));b.load([]).then(function(){require("iy5t");});
},{}]},{},[0], null)