module.exports=function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),a=r;a.version={sketch:MSApplicationMetadata.metadata().appVersion,api:"2.0.0"},e.exports=a},function(e,t,n){"use strict";function r(){return __command.pluginBundle()&&__command.pluginBundle().alertIcon()?__command.pluginBundle().alertIcon():NSImage.imageNamed("plugins")}function a(e,t){t?c.isNativeObject(t)?t.showMessage(e):t.sketchObject.showMessage(e):NSApplication.sharedApplication().orderedDocuments().firstObject().showMessage(e)}function i(e,t){var n=NSAlert.alloc().init();return n.setMessageText(e),n.setInformativeText(t),n.icon=r(),n.runModal()}function o(e,t){var n=MSModalInputSheet.alloc().init(),r=n.runPanelWithNibName_ofType_initialString_label_("MSModalInputSheet",0,String(void 0===t?"":t),e);return String(r)}function u(e,t,n){void 0===n&&(n=0);var a=NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25));a.addItemsWithObjectValues(t),a.selectItemAtIndex(n),a.editable=!1;var i=NSAlert.alloc().init();i.setMessageText(e),i.addButtonWithTitle("OK"),i.addButtonWithTitle("Cancel"),i.setAccessoryView(a),i.icon=r();var o=i.runModal();return[o,a.indexOfSelectedItem(),o===NSAlertFirstButtonReturn]}Object.defineProperty(t,"__esModule",{value:!0});var c=n(2);t.message=a,t.alert=i,t.getStringFromUser=o,t.getSelectionFromUser=u},function(e,t,n){"use strict";function r(e){var t=e;return e&&e.sketchObject&&e.sketchObject.documentData?t=e.sketchObject.documentData():e&&e.documentData&&(t=e.documentData()),t}function a(e){if(Array.isArray(e))return e;for(var t=[],n=0;n<(e||[]).length;n+=1)t.push(e.objectAtIndex(n));return t}function i(e){return e&&e.class&&"function"==typeof e.class}function o(e){return e&&e._isWrappedObject}function u(e){return"string"==typeof e?NSURL.fileURLWithPath(NSString.stringWithString(e).stringByExpandingTildeInPath()):e}function c(e){Object.defineProperty(e,"_parent",{enumerable:!1,writable:!0}),Object.defineProperty(e,"_parentKey",{enumerable:!1,writable:!0}),Object.defineProperty(e,"_inArray",{enumerable:!1,writable:!0})}function l(e,t,n,r){Object.defineProperty(e,"_"+t,{enumerable:!1,writable:!0,value:n}),r?Object.defineProperty(e,t,{enumerable:!0,get:function(){return e["_"+t]},set:function(n){e["_"+t]=r(n),e._parent&&e._parentKey&&(e._inArray?e._parent[e._parentKey][e._parent[e._parentKey].indexOf(e)]=e:e._parent[e._parentKey]=e)}}):Object.defineProperty(e,t,{enumerable:!0,get:function(){return e["_"+t]},set:function(n){e["_"+t]=n,e._parent&&e._parentKey&&(e._inArray?e._parent[e._parentKey][e._parent[e._parentKey].indexOf(e)]=e:e._parent[e._parentKey]=e)}})}Object.defineProperty(t,"__esModule",{value:!0}),t.getDocumentData=r,t.toArray=a,t.isNativeObject=i,t.isWrappedObject=o,t.getURLFromPath=u,t.initProxyProperties=c,t.proxyProperty=l}]);