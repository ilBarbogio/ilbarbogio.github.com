/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/components/components.js":
/*!**********************************************!*\
  !*** ./src/scripts/components/components.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _snapbutton_snap_button_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./snapbutton/snap-button.js */ \"./src/scripts/components/snapbutton/snap-button.js\");\n/* harmony import */ var _simplebutton_simple_button_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./simplebutton/simple-button.js */ \"./src/scripts/components/simplebutton/simple-button.js\");\n/* harmony import */ var _simplecaption_simple_caption_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./simplecaption/simple-caption.js */ \"./src/scripts/components/simplecaption/simple-caption.js\");\n/* harmony import */ var _devicebutton_device_buttons_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./devicebutton/device-buttons.js */ \"./src/scripts/components/devicebutton/device-buttons.js\");\n/* harmony import */ var _loadingwidget_loading_widget_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./loadingwidget/loading-widget.js */ \"./src/scripts/components/loadingwidget/loading-widget.js\");\n/* harmony import */ var _slider_simple_slider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./slider/simple-slider.js */ \"./src/scripts/components/slider/simple-slider.js\");\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/components.js?");

/***/ }),

/***/ "./src/scripts/components/devicebutton/device-buttons.js":
/*!***************************************************************!*\
  !*** ./src/scripts/components/devicebutton/device-buttons.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (customElements.define(\"device-buttons\",class extends HTMLElement{\r\n\twrapper\r\n\tbuttons\r\n\tunderText\r\n\tconstructor(){\r\n\t\tsuper()\r\n\t\tconst shadowRoot=this.attachShadow({mode:\"open\"})\r\n\r\n\t\tshadowRoot.innerHTML=`\r\n\t\t<style>\r\n\t\t\t@import \"./styles/components/device-buttons.css\";\r\n\t\t</style>\r\n\t\t<div class=\"wrapper\">\r\n\t\t</div>\r\n\t\t`\r\n\t}\r\n\tconnectedCallback(){\t\r\n\t\tthis.wrapper=this.shadowRoot.querySelector(\".wrapper\")\r\n\t\tthis.wrapper.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-in\") this.dispatch({action:\"open\"})\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"animationstart\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-out\") this.dispatch({action:\"close\"})\r\n\t\t})\r\n\t\t\r\n\t}\r\n\r\n\tcreateButtons(){\r\n\t\tthis.wrapper.innerHTML=\"\"\r\n\t\tthis.buttons=this.getAttribute(\"buttons\").split(\" \")\r\n\r\n\t\tfor(let b of this.buttons){\r\n\t\t\tconst button=document.createElement(\"div\")\r\n\t\t\tbutton.classList.add(\"button\")\r\n\t\t\tbutton.classList.add(b)\r\n\t\t\tthis.wrapper.append(button)\r\n\t\t\tbutton.addEventListener(\"click\",()=>this.dispatch({action:b}))\r\n\r\n\t\t\tconst text=document.createElement(\"div\")\r\n\t\t\ttext.classList.add(\"under-text\")\r\n\t\t\ttext.innerHTML=b\r\n\t\t\tbutton.append(text)\r\n\t\t}\r\n\t\tconst spacer=document.createElement(\"div\")\r\n\t\tspacer.classList.add(\"spacer\")\r\n\t\tthis.wrapper.append(spacer)\r\n\t}\r\n\r\n\r\n\tshow(){\r\n\t\tconsole.log(\"show\")\r\n\t\tthis.wrapper.classList.add(\"slide-in\")\r\n\t\tthis.wrapper.classList.remove(\"slide-out\")\r\n\t}\r\n\thide(){\r\n\t\tthis.wrapper.classList.add(\"slide-out\")\r\n\t\tthis.wrapper.classList.remove(\"slide-in\")\r\n\t}\r\n\tdispatch(detail){\r\n\t\tconst event=new CustomEvent(\"device-buttons\",{detail})\r\n\t\twindow.dispatchEvent(event)\r\n\t}\r\n}));\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/devicebutton/device-buttons.js?");

/***/ }),

/***/ "./src/scripts/components/loadingwidget/loading-widget.js":
/*!****************************************************************!*\
  !*** ./src/scripts/components/loadingwidget/loading-widget.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (customElements.define(\"loading-widget\",class extends HTMLElement{\r\n\twrapper\r\n\tdots\r\n\tanimationDelay\r\n\tconstructor(){\r\n\t\tsuper()\r\n\t\tconst shadowRoot=this.attachShadow({mode:\"open\"})\r\n\t\tshadowRoot.innerHTML=`\r\n\t\t<style>\r\n\t\t\t@import \"./styles/components/loading-widget.css\";\r\n\t\t</style>\r\n\t\t<div class=\"wrapper\">\r\n\t\t\t<div class=\"dot\"></div>\r\n\t\t\t<div class=\"dot\"></div>\r\n\t\t\t<div class=\"dot\"></div>\r\n\t\t\t<div class=\"dot\"></div>\r\n\t\t\t<div class=\"dot\"></div>\r\n\t\t</div>\r\n\t\t`\r\n\t}\r\n\tconnectedCallback(){\r\n\t\tthis.animationDelay=this.hasAttribute(\"time\")?parseFloat(this.getAttribute(\"time\")):.1\r\n\t\t\r\n\t\tthis.wrapper=this.shadowRoot.querySelector(\".wrapper\")\r\n\r\n\t\tthis.wrapper.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-in\"){\r\n\t\t\t\tthis.animateDots(true)\r\n\t\t\t\tthis.dispatch({action:\"open\"})\r\n\t\t\t}\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"animationstart\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-out\"){\r\n\t\t\t\tthis.animateDots(false)\r\n\t\t\t\tthis.dispatch({action:\"close\"})\r\n\t\t\t}\r\n\t\t})\r\n\t\t\r\n\t\tthis.dots=this.wrapper.querySelectorAll(\"div\")\r\n\t\tfor(let [i,d] of this.dots.entries()){\r\n\t\t\td.style.animationDuration=`${2*this.dots.length*this.animationDelay}s`\r\n\t\t\td.style.animationDelay=`${i*this.animationDelay}s`\r\n\t\t}\r\n\t}\r\n\tanimateDots(animate){\r\n\t\tfor(let d of this.dots){\r\n\t\t\tif(animate) d.style.animationName=\"hop\"\r\n\t\t\telse d.style.animationName=\"none\"\r\n\t\t}\r\n\t}\r\n\tshow(){\r\n\t\tthis.wrapper.classList.add(\"slide-in\")\r\n\t\tthis.wrapper.classList.remove(\"slide-out\")\r\n\t}\r\n\thide(){\r\n\t\tthis.wrapper.classList.add(\"slide-out\")\r\n\t\tthis.wrapper.classList.remove(\"slide-in\")\r\n\t}\r\n\tdispatch(detail){\r\n\t\tconst event=new CustomEvent(\"loading-widget\",{detail})\r\n\t\twindow.dispatchEvent(event)\r\n\t}\r\n}));\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/loadingwidget/loading-widget.js?");

/***/ }),

/***/ "./src/scripts/components/simplebutton/simple-button.js":
/*!**************************************************************!*\
  !*** ./src/scripts/components/simplebutton/simple-button.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (customElements.define(\"simple-button\",class extends HTMLElement{\r\n\twrapper\r\n\tside\r\n\tconstructor(){\r\n\t\tsuper()\r\n\t\tconst shadowRoot=this.attachShadow({mode:\"open\"})\r\n\t\tshadowRoot.innerHTML=`\r\n\t\t<style>\r\n\t\t\t@import \"./styles/components/simple-button.css\";\r\n\t\t</style>\r\n\t\t<button class=\"wrapper\">\r\n\t\t</button>\r\n\t\t`\r\n\t}\r\n\tconnectedCallback(){\r\n\t\tthis.wrapper=this.shadowRoot.querySelector(\".wrapper\")\r\n\t\tthis.side=this.getAttribute(\"side\")\r\n\t\tthis.wrapper.classList.add(this.side)\r\n\r\n\t\tthis.type=this.getAttribute(\"type\")\r\n\t\tthis.wrapper.classList.add(this.type)\r\n\r\n\t\tthis.wrapper.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-in\") this.dispatch({action:\"open\",type:this.type})\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"animationstart\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-out\") this.dispatch({action:\"close\",type:this.type})\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"click\",(ev)=>{\r\n\t\t\tthis.dispatch({action:\"click\",type:this.type})\r\n\t\t})\r\n\r\n\t\t\r\n\t\t\r\n\t}\r\n\r\n\tshow(){\r\n\t\tthis.wrapper.classList.add(\"slide-in\")\r\n\t\tthis.wrapper.classList.remove(\"slide-out\")\r\n\t}\r\n\thide(){\r\n\t\tthis.wrapper.classList.add(\"slide-out\")\r\n\t\tthis.wrapper.classList.remove(\"slide-in\")\r\n\t}\r\n\tdispatch(detail){\r\n\t\tconst event=new CustomEvent(\"simple-button\",{detail})\r\n\t\twindow.dispatchEvent(event)\r\n\t}\r\n}));\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/simplebutton/simple-button.js?");

/***/ }),

/***/ "./src/scripts/components/simplecaption/simple-caption.js":
/*!****************************************************************!*\
  !*** ./src/scripts/components/simplecaption/simple-caption.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (customElements.define(\"simple-caption\",class extends HTMLElement{\r\n\twrapper\r\n\ttext\r\n\tconstructor(){\r\n\t\tsuper()\r\n\t\tconst shadowRoot=this.attachShadow({mode:\"open\"})\r\n\r\n\t\tshadowRoot.innerHTML=`\r\n\t\t<style>\r\n\t\t\t@import \"./styles/components/simple-caption.css\";\r\n\t\t</style>\r\n\t\t<div class=\"wrapper\">\r\n\t\t\t<div class=\"text\"></div>\r\n\t\t</div>\r\n\t\t`\r\n\t}\r\n\tconnectedCallback(){\t\r\n\t\tthis.wrapper=this.shadowRoot.querySelector(\".wrapper\")\r\n\t\tthis.text=this.shadowRoot.querySelector(\".text\")\r\n\r\n\t\tthis.wrapper.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-in\") this.dispatch({action:\"open\"})\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"animationstart\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-out\") this.dispatch({action:\"close\"})\r\n\t\t})\r\n\t\t\r\n\t}\r\n\r\n\tsetText(string){\r\n\t\tthis.text.innerHTML=string\r\n\r\n\t}\r\n\r\n\tshow(){\r\n\t\tthis.wrapper.classList.add(\"slide-in\")\r\n\t\tthis.wrapper.classList.remove(\"slide-out\")\r\n\t}\r\n\thide(){\r\n\t\tthis.wrapper.classList.add(\"slide-out\")\r\n\t\tthis.wrapper.classList.remove(\"slide-in\")\r\n\t}\r\n\tdispatch(detail){\r\n\t\tconst event=new CustomEvent(\"simple-caption\",{detail})\r\n\t\twindow.dispatchEvent(event)\r\n\t}\r\n}));\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/simplecaption/simple-caption.js?");

/***/ }),

/***/ "./src/scripts/components/slider/simple-slider.js":
/*!********************************************************!*\
  !*** ./src/scripts/components/slider/simple-slider.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (customElements.define(\"simple-slider\",class extends HTMLElement{\r\n\twrapper\r\n\ttext\r\n\tconstructor(){\r\n\t\tsuper()\r\n\t\tconst shadowRoot=this.attachShadow({mode:\"open\"})\r\n\r\n\t\tshadowRoot.innerHTML=`\r\n\t\t<style>\r\n\t\t\t@import \"./styles/components/simple-slider.css\";\r\n\t\t</style>\r\n\t\t<div class=\"wrapper\">\r\n\t\t\t<div class=\"cursor\"></div>\r\n\t\t</div>\r\n\t\t`\r\n\t}\r\n\tconnectedCallback(){\t\r\n\t\tthis.wrapper=this.shadowRoot.querySelector(\".wrapper\")\r\n\t\tthis.cursor=this.shadowRoot.querySelector(\".cursor\")\r\n\r\n\t\tthis.wrapper.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-in\") this.dispatch({action:\"open\"})\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"animationstart\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-out\") this.dispatch({action:\"close\"})\r\n\t\t})\r\n\t\t\r\n\t}\r\n\r\n\tplaceCursor(ratio){\r\n\t\tthis.cursor.style.left=Math.floor(ratio*100)+\"%\"\r\n\r\n\t}\r\n\r\n\tshow(){\r\n\t\tthis.wrapper.classList.add(\"slide-in\")\r\n\t\tthis.wrapper.classList.remove(\"slide-out\")\r\n\t}\r\n\thide(){\r\n\t\tthis.wrapper.classList.add(\"slide-out\")\r\n\t\tthis.wrapper.classList.remove(\"slide-in\")\r\n\t}\r\n\tdispatch(detail){\r\n\t\tconst event=new CustomEvent(\"simple-slider\",{detail})\r\n\t\twindow.dispatchEvent(event)\r\n\t}\r\n}));\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/slider/simple-slider.js?");

/***/ }),

/***/ "./src/scripts/components/snapbutton/snap-button.js":
/*!**********************************************************!*\
  !*** ./src/scripts/components/snapbutton/snap-button.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (customElements.define(\"snap-button\",class extends HTMLElement{\r\n\twrapper\r\n\tbackdrop\r\n\tbutton\r\n\tconstructor(){\r\n\t\tsuper()\r\n\t\tconst shadowRoot=this.attachShadow({mode:\"open\"})\r\n\t\tshadowRoot.innerHTML=`\r\n\t\t<style>\r\n\t\t\t@import \"./styles/components/snap-button.css\";\r\n\t\t</style>\r\n\t\t<div class=\"wrapper\">\r\n\t\t\t<div class=\"backdrop\"></div>\r\n\t\t\t<div class=\"button\"></div>\r\n\t\t</div>\r\n\t\t`\r\n\t}\r\n\tconnectedCallback(){\r\n\t\tthis.wrapper=this.shadowRoot.querySelector(\".wrapper\")\r\n\t\tthis.wrapper.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-in\") this.dispatch({action:\"open\"})\r\n\t\t})\r\n\t\tthis.wrapper.addEventListener(\"animationstart\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"slide-out\") this.dispatch({action:\"close\"})\r\n\t\t})\r\n\r\n\t\tthis.backdrop=this.wrapper.querySelector(\".backdrop\")\r\n\t\tthis.button=this.wrapper.querySelector(\".button\")\r\n\t\t\r\n\t\tthis.button.addEventListener(\"click\",()=>{\r\n\t\t\tthis.backdrop.classList.add(\"rotate\")\r\n\t\t})\r\n\t\tthis.backdrop.addEventListener(\"animationend\",(ev)=>{\r\n\t\t\tif(ev.animationName==\"rotate\"){\r\n\t\t\t\tthis.backdrop.classList.remove(\"rotate\")\r\n\t\t\t\tthis.hide()\r\n\t\t\t}\r\n\t\t})\r\n\t}\r\n\r\n\tshow(){\r\n\t\tthis.wrapper.classList.add(\"slide-in\")\r\n\t\tthis.wrapper.classList.remove(\"slide-out\")\r\n\t}\r\n\thide(){\r\n\t\tthis.wrapper.classList.add(\"slide-out\")\r\n\t\tthis.wrapper.classList.remove(\"slide-in\")\r\n\t}\r\n\tdispatch(detail){\r\n\t\tconst event=new CustomEvent(\"snap-button\",{detail})\r\n\t\tconsole.log(event)\r\n\t\twindow.dispatchEvent(event)\r\n\t}\r\n}));\n\n//# sourceURL=webpack://squareapp/./src/scripts/components/snapbutton/snap-button.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/components/components.js");
/******/ 	
/******/ })()
;