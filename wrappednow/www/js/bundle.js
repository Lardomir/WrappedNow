var on=()=>{};var cn=function(t){let e=[],n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},Er=function(t){let e=[],n=0,r=0;for(;n<t.length;){let i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){let s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){let s=t[n++],f=t[n++],m=t[n++],p=((i&7)<<18|(s&63)<<12|(f&63)<<6|m&63)-65536;e[r++]=String.fromCharCode(55296+(p>>10)),e[r++]=String.fromCharCode(56320+(p&1023))}else{let s=t[n++],f=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|f&63)}}return e.join("")},ln={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){let s=t[i],f=i+1<t.length,m=f?t[i+1]:0,p=i+2<t.length,g=p?t[i+2]:0,b=s>>2,w=(s&3)<<4|m>>4,_=(m&15)<<2|g>>6,P=g&63;p||(P=64,f||(_=64)),r.push(n[b],n[w],n[_],n[P])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(cn(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):Er(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();let n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){let s=n[t.charAt(i++)],m=i<t.length?n[t.charAt(i)]:0;++i;let g=i<t.length?n[t.charAt(i)]:64;++i;let w=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||m==null||g==null||w==null)throw new Xe;let _=s<<2|m>>4;if(r.push(_),g!==64){let P=m<<4&240|g>>2;if(r.push(P),w!==64){let A=g<<6&192|w;r.push(A)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},Xe=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Tr=function(t){let e=cn(t);return ln.encodeByteArray(e,!0)},_e=function(t){return Tr(t).replace(/\./g,"")},hn=function(t){try{return ln.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function Ar(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var Ir=()=>Ar().__FIREBASE_DEFAULTS__,Sr=()=>{if(typeof process>"u"||typeof process.env>"u")return;let t=process.env.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},Vr=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=t&&hn(t[1]);return e&&JSON.parse(e)},fn=()=>{try{return on()||Ir()||Sr()||Vr()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Pr=t=>fn()?.emulatorHosts?.[t],dn=t=>{let e=Pr(t);if(!e)return;let n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},Ze=()=>fn()?.config;var De=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}};function Ce(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function pn(t){return(await fetch(t,{credentials:"include"})).ok}function mn(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let f={iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...t};return[_e(JSON.stringify(n)),_e(JSON.stringify(f)),""].join(".")}var ge={};function Rr(){let t={prod:[],emulator:[]};for(let e of Object.keys(ge))ge[e]?t.emulator.push(e):t.prod.push(e);return t}function Dr(t){let e=document.getElementById(t),n=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),n=!0),{created:n,element:e}}var an=!1;function gn(t,e){if(typeof window>"u"||typeof document>"u"||!Ce(window.location.host)||ge[t]===e||ge[t]||an)return;ge[t]=e;function n(_){return`__firebase__banner__${_}`}let r="__firebase__banner",s=Rr().prod.length>0;function f(){let _=document.getElementById(r);_&&_.remove()}function m(_){_.style.display="flex",_.style.background="#7faaf0",_.style.position="fixed",_.style.bottom="5px",_.style.left="5px",_.style.padding=".5em",_.style.borderRadius="5px",_.style.alignItems="center"}function p(_,P){_.setAttribute("width","24"),_.setAttribute("id",P),_.setAttribute("height","24"),_.setAttribute("viewBox","0 0 24 24"),_.setAttribute("fill","none"),_.style.marginLeft="-6px"}function g(){let _=document.createElement("span");return _.style.cursor="pointer",_.style.marginLeft="16px",_.style.fontSize="24px",_.innerHTML=" &times;",_.onclick=()=>{an=!0,f()},_}function b(_,P){_.setAttribute("id",P),_.innerText="Learn more",_.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",_.setAttribute("target","__blank"),_.style.paddingLeft="5px",_.style.textDecoration="underline"}function w(){let _=Dr(r),P=n("text"),A=document.getElementById(P)||document.createElement("span"),C=n("learnmore"),I=document.getElementById(C)||document.createElement("a"),Y=n("preprendIcon"),$=document.getElementById(Y)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(_.created){let q=_.element;m(q),b(I,C);let re=g();p($,Y),q.append($,A,I,re),document.body.appendChild(q)}s?(A.innerText="Preview backend disconnected.",$.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):($.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,A.innerText="Preview backend running in this workspace."),A.setAttribute("id",P)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",w):w()}function _n(){try{return typeof indexedDB=="object"}catch{return!1}}function yn(){return new Promise((t,e)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(n){e(n)}})}var Cr="FirebaseError",j=class t extends Error{constructor(e,n,r){super(n),this.code=e,this.customData=r,this.name=Cr,Object.setPrototypeOf(this,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ye.prototype.create)}},ye=class{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){let r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],f=s?kr(s,r):"Error",m=`${this.serviceName}: ${f} (${i}).`;return new j(i,m,r)}};function kr(t,e){return t.replace(xr,(n,r)=>{let i=e[r];return i!=null?String(i):`<${r}?>`})}var xr=/\{\$([^}]+)}/g;function se(t,e){if(t===e)return!0;let n=Object.keys(t),r=Object.keys(e);for(let i of n){if(!r.includes(i))return!1;let s=t[i],f=e[i];if(un(s)&&un(f)){if(!se(s,f))return!1}else if(s!==f)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function un(t){return t!==null&&typeof t=="object"}var Cs=14400*1e3;function wn(t){return t&&t._delegate?t._delegate:t}var U=class{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var Z="[DEFAULT]";var et=class{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){let r=new De;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){let n=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Nr(e))try{this.getOrInitializeService({instanceIdentifier:Z})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Z){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Z){return this.instances.has(e)}getOptions(e=Z){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[s,f]of this.instancesDeferred.entries()){let m=this.normalizeInstanceIdentifier(s);r===m&&f.resolve(i)}return i}onInit(e,n){let r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);let s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Or(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Z){return this.component?this.component.multipleInstances?e:Z:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Or(t){return t===Z?void 0:t}function Nr(t){return t.instantiationMode==="EAGER"}var ke=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let n=new et(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}};var Fr=[],T;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(T||(T={}));var Mr={debug:T.DEBUG,verbose:T.VERBOSE,info:T.INFO,warn:T.WARN,error:T.ERROR,silent:T.SILENT},Lr=T.INFO,Br={[T.DEBUG]:"log",[T.VERBOSE]:"log",[T.INFO]:"info",[T.WARN]:"warn",[T.ERROR]:"error"},$r=(t,e,...n)=>{if(e<t.logLevel)return;let r=new Date().toISOString(),i=Br[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},oe=class{constructor(e){this.name=e,this._logLevel=Lr,this._logHandler=$r,this._userLogHandler=null,Fr.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in T))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Mr[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,T.DEBUG,...e),this._logHandler(this,T.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,T.VERBOSE,...e),this._logHandler(this,T.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,T.INFO,...e),this._logHandler(this,T.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,T.WARN,...e),this._logHandler(this,T.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,T.ERROR,...e),this._logHandler(this,T.ERROR,...e)}};var qr=(t,e)=>e.some(n=>t instanceof n),bn,vn;function jr(){return bn||(bn=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ur(){return vn||(vn=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var En=new WeakMap,nt=new WeakMap,Tn=new WeakMap,tt=new WeakMap,it=new WeakMap;function zr(t){let e=new Promise((n,r)=>{let i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",f)},s=()=>{n(N(t.result)),i()},f=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",f)});return e.then(n=>{n instanceof IDBCursor&&En.set(n,t)}).catch(()=>{}),it.set(e,t),e}function Hr(t){if(nt.has(t))return;let e=new Promise((n,r)=>{let i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",f),t.removeEventListener("abort",f)},s=()=>{n(),i()},f=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",f),t.addEventListener("abort",f)});nt.set(t,e)}var rt={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return nt.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Tn.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return N(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function An(t){rt=t(rt)}function Wr(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){let r=t.call(xe(this),e,...n);return Tn.set(r,e.sort?e.sort():[e]),N(r)}:Ur().includes(t)?function(...e){return t.apply(xe(this),e),N(En.get(this))}:function(...e){return N(t.apply(xe(this),e))}}function Gr(t){return typeof t=="function"?Wr(t):(t instanceof IDBTransaction&&Hr(t),qr(t,jr())?new Proxy(t,rt):t)}function N(t){if(t instanceof IDBRequest)return zr(t);if(tt.has(t))return tt.get(t);let e=Gr(t);return e!==t&&(tt.set(t,e),it.set(e,t)),e}var xe=t=>it.get(t);function Sn(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){let f=indexedDB.open(t,e),m=N(f);return r&&f.addEventListener("upgradeneeded",p=>{r(N(f.result),p.oldVersion,p.newVersion,N(f.transaction),p)}),n&&f.addEventListener("blocked",p=>n(p.oldVersion,p.newVersion,p)),m.then(p=>{s&&p.addEventListener("close",()=>s()),i&&p.addEventListener("versionchange",g=>i(g.oldVersion,g.newVersion,g))}).catch(()=>{}),m}var Kr=["get","getKey","getAll","getAllKeys","count"],Jr=["put","add","delete","clear"],st=new Map;function In(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(st.get(e))return st.get(e);let n=e.replace(/FromIndex$/,""),r=e!==n,i=Jr.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Kr.includes(n)))return;let s=async function(f,...m){let p=this.transaction(f,i?"readwrite":"readonly"),g=p.store;return r&&(g=g.index(m.shift())),(await Promise.all([g[n](...m),i&&p.done]))[0]};return st.set(e,s),s}An(t=>({...t,get:(e,n,r)=>In(e,n)||t.get(e,n,r),has:(e,n)=>!!In(e,n)||t.has(e,n)}));var at=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Qr(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function Qr(t){return t.getComponent()?.type==="VERSION"}var ut="@firebase/app",Vn="0.14.1";var z=new oe("@firebase/app"),Yr="@firebase/app-compat",Xr="@firebase/analytics-compat",Zr="@firebase/analytics",ei="@firebase/app-check-compat",ti="@firebase/app-check",ni="@firebase/auth",ri="@firebase/auth-compat",ii="@firebase/database",si="@firebase/data-connect",oi="@firebase/database-compat",ai="@firebase/functions",ui="@firebase/functions-compat",ci="@firebase/installations",li="@firebase/installations-compat",hi="@firebase/messaging",fi="@firebase/messaging-compat",di="@firebase/performance",pi="@firebase/performance-compat",mi="@firebase/remote-config",gi="@firebase/remote-config-compat",_i="@firebase/storage",yi="@firebase/storage-compat",wi="@firebase/firestore",bi="@firebase/ai",vi="@firebase/firestore-compat",Ei="firebase",Ti="12.1.0";var ct="[DEFAULT]",Ai={[ut]:"fire-core",[Yr]:"fire-core-compat",[Zr]:"fire-analytics",[Xr]:"fire-analytics-compat",[ti]:"fire-app-check",[ei]:"fire-app-check-compat",[ni]:"fire-auth",[ri]:"fire-auth-compat",[ii]:"fire-rtdb",[si]:"fire-data-connect",[oi]:"fire-rtdb-compat",[ai]:"fire-fn",[ui]:"fire-fn-compat",[ci]:"fire-iid",[li]:"fire-iid-compat",[hi]:"fire-fcm",[fi]:"fire-fcm-compat",[di]:"fire-perf",[pi]:"fire-perf-compat",[mi]:"fire-rc",[gi]:"fire-rc-compat",[_i]:"fire-gcs",[yi]:"fire-gcs-compat",[wi]:"fire-fst",[vi]:"fire-fst-compat",[bi]:"fire-vertex","fire-js":"fire-js",[Ei]:"fire-js-all"};var Oe=new Map,Ii=new Map,lt=new Map;function Pn(t,e){try{t.container.addComponent(e)}catch(n){z.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function we(t){let e=t.name;if(lt.has(e))return z.debug(`There were multiple attempts to register component ${e}.`),!1;lt.set(e,t);for(let n of Oe.values())Pn(n,t);for(let n of Ii.values())Pn(n,t);return!0}function kn(t,e){let n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function xn(t){return t==null?!1:t.settings!==void 0}var Si={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},W=new ye("app","Firebase",Si);var ht=class{constructor(e,n,r){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new U("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw W.create("app-deleted",{appName:this._name})}};var On=Ti;function pt(t,e={}){let n=t;typeof e!="object"&&(e={name:e});let r={name:ct,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw W.create("bad-app-name",{appName:String(i)});if(n||(n=Ze()),!n)throw W.create("no-options");let s=Oe.get(i);if(s){if(se(n,s.options)&&se(r,s.config))return s;throw W.create("duplicate-app",{appName:i})}let f=new ke(i);for(let p of lt.values())f.addComponent(p);let m=new ht(n,r,f);return Oe.set(i,m),m}function Nn(t=ct){let e=Oe.get(t);if(!e&&t===ct&&Ze())return pt();if(!e)throw W.create("no-app",{appName:t});return e}function G(t,e,n){let r=Ai[t]??t;n&&(r+=`-${n}`);let i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){let f=[`Unable to register library "${r}" with version "${e}":`];i&&f.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&f.push("and"),s&&f.push(`version name "${e}" contains illegal characters (whitespace or "/")`),z.warn(f.join(" "));return}we(new U(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}var Vi="firebase-heartbeat-database",Pi=1,be="firebase-heartbeat-store",ot=null;function Fn(){return ot||(ot=Sn(Vi,Pi,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(be)}catch(n){console.warn(n)}}}}).catch(t=>{throw W.create("idb-open",{originalErrorMessage:t.message})})),ot}async function Ri(t){try{let n=(await Fn()).transaction(be),r=await n.objectStore(be).get(Mn(t));return await n.done,r}catch(e){if(e instanceof j)z.warn(e.message);else{let n=W.create("idb-get",{originalErrorMessage:e?.message});z.warn(n.message)}}}async function Rn(t,e){try{let r=(await Fn()).transaction(be,"readwrite");await r.objectStore(be).put(e,Mn(t)),await r.done}catch(n){if(n instanceof j)z.warn(n.message);else{let r=W.create("idb-set",{originalErrorMessage:n?.message});z.warn(r.message)}}}function Mn(t){return`${t.name}!${t.options.appId}`}var Di=1024,Ci=30,ft=class{constructor(e){this.container=e,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new dt(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Dn();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>Ci){let i=xi(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){z.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=Dn(),{heartbeatsToSend:n,unsentEntries:r}=ki(this._heartbeatsCache.heartbeats),i=_e(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return z.warn(e),""}}};function Dn(){return new Date().toISOString().substring(0,10)}function ki(t,e=Di){let n=[],r=t.slice();for(let i of t){let s=n.find(f=>f.agent===i.agent);if(s){if(s.dates.push(i.date),Cn(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Cn(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var dt=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return _n()?yn().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await Ri(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Rn(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Rn(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}};function Cn(t){return _e(JSON.stringify({version:2,heartbeats:t})).length}function xi(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}function Oi(t){we(new U("platform-logger",e=>new at(e),"PRIVATE")),we(new U("heartbeat",e=>new ft(e),"PRIVATE")),G(ut,Vn,t),G(ut,Vn,"esm2020"),G("fire-js","")}Oi("");var Ni="firebase",Fi="12.1.0";G(Ni,Fi,"app");var Ln=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Bn={};var mt,Mi;(function(){var t;function e(h,o){function u(){}u.prototype=o.prototype,h.D=o.prototype,h.prototype=new u,h.prototype.constructor=h,h.C=function(c,l,d){for(var a=Array(arguments.length-2),X=2;X<arguments.length;X++)a[X-2]=arguments[X];return o.prototype[l].apply(c,a)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,n),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(h,o,u){u||(u=0);var c=Array(16);if(typeof o=="string")for(var l=0;16>l;++l)c[l]=o.charCodeAt(u++)|o.charCodeAt(u++)<<8|o.charCodeAt(u++)<<16|o.charCodeAt(u++)<<24;else for(l=0;16>l;++l)c[l]=o[u++]|o[u++]<<8|o[u++]<<16|o[u++]<<24;o=h.g[0],u=h.g[1],l=h.g[2];var d=h.g[3],a=o+(d^u&(l^d))+c[0]+3614090360&4294967295;o=u+(a<<7&4294967295|a>>>25),a=d+(l^o&(u^l))+c[1]+3905402710&4294967295,d=o+(a<<12&4294967295|a>>>20),a=l+(u^d&(o^u))+c[2]+606105819&4294967295,l=d+(a<<17&4294967295|a>>>15),a=u+(o^l&(d^o))+c[3]+3250441966&4294967295,u=l+(a<<22&4294967295|a>>>10),a=o+(d^u&(l^d))+c[4]+4118548399&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(l^o&(u^l))+c[5]+1200080426&4294967295,d=o+(a<<12&4294967295|a>>>20),a=l+(u^d&(o^u))+c[6]+2821735955&4294967295,l=d+(a<<17&4294967295|a>>>15),a=u+(o^l&(d^o))+c[7]+4249261313&4294967295,u=l+(a<<22&4294967295|a>>>10),a=o+(d^u&(l^d))+c[8]+1770035416&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(l^o&(u^l))+c[9]+2336552879&4294967295,d=o+(a<<12&4294967295|a>>>20),a=l+(u^d&(o^u))+c[10]+4294925233&4294967295,l=d+(a<<17&4294967295|a>>>15),a=u+(o^l&(d^o))+c[11]+2304563134&4294967295,u=l+(a<<22&4294967295|a>>>10),a=o+(d^u&(l^d))+c[12]+1804603682&4294967295,o=u+(a<<7&4294967295|a>>>25),a=d+(l^o&(u^l))+c[13]+4254626195&4294967295,d=o+(a<<12&4294967295|a>>>20),a=l+(u^d&(o^u))+c[14]+2792965006&4294967295,l=d+(a<<17&4294967295|a>>>15),a=u+(o^l&(d^o))+c[15]+1236535329&4294967295,u=l+(a<<22&4294967295|a>>>10),a=o+(l^d&(u^l))+c[1]+4129170786&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^l&(o^u))+c[6]+3225465664&4294967295,d=o+(a<<9&4294967295|a>>>23),a=l+(o^u&(d^o))+c[11]+643717713&4294967295,l=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(l^d))+c[0]+3921069994&4294967295,u=l+(a<<20&4294967295|a>>>12),a=o+(l^d&(u^l))+c[5]+3593408605&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^l&(o^u))+c[10]+38016083&4294967295,d=o+(a<<9&4294967295|a>>>23),a=l+(o^u&(d^o))+c[15]+3634488961&4294967295,l=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(l^d))+c[4]+3889429448&4294967295,u=l+(a<<20&4294967295|a>>>12),a=o+(l^d&(u^l))+c[9]+568446438&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^l&(o^u))+c[14]+3275163606&4294967295,d=o+(a<<9&4294967295|a>>>23),a=l+(o^u&(d^o))+c[3]+4107603335&4294967295,l=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(l^d))+c[8]+1163531501&4294967295,u=l+(a<<20&4294967295|a>>>12),a=o+(l^d&(u^l))+c[13]+2850285829&4294967295,o=u+(a<<5&4294967295|a>>>27),a=d+(u^l&(o^u))+c[2]+4243563512&4294967295,d=o+(a<<9&4294967295|a>>>23),a=l+(o^u&(d^o))+c[7]+1735328473&4294967295,l=d+(a<<14&4294967295|a>>>18),a=u+(d^o&(l^d))+c[12]+2368359562&4294967295,u=l+(a<<20&4294967295|a>>>12),a=o+(u^l^d)+c[5]+4294588738&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^l)+c[8]+2272392833&4294967295,d=o+(a<<11&4294967295|a>>>21),a=l+(d^o^u)+c[11]+1839030562&4294967295,l=d+(a<<16&4294967295|a>>>16),a=u+(l^d^o)+c[14]+4259657740&4294967295,u=l+(a<<23&4294967295|a>>>9),a=o+(u^l^d)+c[1]+2763975236&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^l)+c[4]+1272893353&4294967295,d=o+(a<<11&4294967295|a>>>21),a=l+(d^o^u)+c[7]+4139469664&4294967295,l=d+(a<<16&4294967295|a>>>16),a=u+(l^d^o)+c[10]+3200236656&4294967295,u=l+(a<<23&4294967295|a>>>9),a=o+(u^l^d)+c[13]+681279174&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^l)+c[0]+3936430074&4294967295,d=o+(a<<11&4294967295|a>>>21),a=l+(d^o^u)+c[3]+3572445317&4294967295,l=d+(a<<16&4294967295|a>>>16),a=u+(l^d^o)+c[6]+76029189&4294967295,u=l+(a<<23&4294967295|a>>>9),a=o+(u^l^d)+c[9]+3654602809&4294967295,o=u+(a<<4&4294967295|a>>>28),a=d+(o^u^l)+c[12]+3873151461&4294967295,d=o+(a<<11&4294967295|a>>>21),a=l+(d^o^u)+c[15]+530742520&4294967295,l=d+(a<<16&4294967295|a>>>16),a=u+(l^d^o)+c[2]+3299628645&4294967295,u=l+(a<<23&4294967295|a>>>9),a=o+(l^(u|~d))+c[0]+4096336452&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~l))+c[7]+1126891415&4294967295,d=o+(a<<10&4294967295|a>>>22),a=l+(o^(d|~u))+c[14]+2878612391&4294967295,l=d+(a<<15&4294967295|a>>>17),a=u+(d^(l|~o))+c[5]+4237533241&4294967295,u=l+(a<<21&4294967295|a>>>11),a=o+(l^(u|~d))+c[12]+1700485571&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~l))+c[3]+2399980690&4294967295,d=o+(a<<10&4294967295|a>>>22),a=l+(o^(d|~u))+c[10]+4293915773&4294967295,l=d+(a<<15&4294967295|a>>>17),a=u+(d^(l|~o))+c[1]+2240044497&4294967295,u=l+(a<<21&4294967295|a>>>11),a=o+(l^(u|~d))+c[8]+1873313359&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~l))+c[15]+4264355552&4294967295,d=o+(a<<10&4294967295|a>>>22),a=l+(o^(d|~u))+c[6]+2734768916&4294967295,l=d+(a<<15&4294967295|a>>>17),a=u+(d^(l|~o))+c[13]+1309151649&4294967295,u=l+(a<<21&4294967295|a>>>11),a=o+(l^(u|~d))+c[4]+4149444226&4294967295,o=u+(a<<6&4294967295|a>>>26),a=d+(u^(o|~l))+c[11]+3174756917&4294967295,d=o+(a<<10&4294967295|a>>>22),a=l+(o^(d|~u))+c[2]+718787259&4294967295,l=d+(a<<15&4294967295|a>>>17),a=u+(d^(l|~o))+c[9]+3951481745&4294967295,h.g[0]=h.g[0]+o&4294967295,h.g[1]=h.g[1]+(l+(a<<21&4294967295|a>>>11))&4294967295,h.g[2]=h.g[2]+l&4294967295,h.g[3]=h.g[3]+d&4294967295}r.prototype.u=function(h,o){o===void 0&&(o=h.length);for(var u=o-this.blockSize,c=this.B,l=this.h,d=0;d<o;){if(l==0)for(;d<=u;)i(this,h,d),d+=this.blockSize;if(typeof h=="string"){for(;d<o;)if(c[l++]=h.charCodeAt(d++),l==this.blockSize){i(this,c),l=0;break}}else for(;d<o;)if(c[l++]=h[d++],l==this.blockSize){i(this,c),l=0;break}}this.h=l,this.o+=o},r.prototype.v=function(){var h=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);h[0]=128;for(var o=1;o<h.length-8;++o)h[o]=0;var u=8*this.o;for(o=h.length-8;o<h.length;++o)h[o]=u&255,u/=256;for(this.u(h),h=Array(16),o=u=0;4>o;++o)for(var c=0;32>c;c+=8)h[u++]=this.g[o]>>>c&255;return h};function s(h,o){var u=m;return Object.prototype.hasOwnProperty.call(u,h)?u[h]:u[h]=o(h)}function f(h,o){this.h=o;for(var u=[],c=!0,l=h.length-1;0<=l;l--){var d=h[l]|0;c&&d==o||(u[l]=d,c=!1)}this.g=u}var m={};function p(h){return-128<=h&&128>h?s(h,function(o){return new f([o|0],0>o?-1:0)}):new f([h|0],0>h?-1:0)}function g(h){if(isNaN(h)||!isFinite(h))return w;if(0>h)return I(g(-h));for(var o=[],u=1,c=0;h>=u;c++)o[c]=h/u|0,u*=4294967296;return new f(o,0)}function b(h,o){if(h.length==0)throw Error("number format error: empty string");if(o=o||10,2>o||36<o)throw Error("radix out of range: "+o);if(h.charAt(0)=="-")return I(b(h.substring(1),o));if(0<=h.indexOf("-"))throw Error('number format error: interior "-" character');for(var u=g(Math.pow(o,8)),c=w,l=0;l<h.length;l+=8){var d=Math.min(8,h.length-l),a=parseInt(h.substring(l,l+d),o);8>d?(d=g(Math.pow(o,d)),c=c.j(d).add(g(a))):(c=c.j(u),c=c.add(g(a)))}return c}var w=p(0),_=p(1),P=p(16777216);t=f.prototype,t.m=function(){if(C(this))return-I(this).m();for(var h=0,o=1,u=0;u<this.g.length;u++){var c=this.i(u);h+=(0<=c?c:4294967296+c)*o,o*=4294967296}return h},t.toString=function(h){if(h=h||10,2>h||36<h)throw Error("radix out of range: "+h);if(A(this))return"0";if(C(this))return"-"+I(this).toString(h);for(var o=g(Math.pow(h,6)),u=this,c="";;){var l=re(u,o).g;u=Y(u,l.j(o));var d=((0<u.g.length?u.g[0]:u.h)>>>0).toString(h);if(u=l,A(u))return d+c;for(;6>d.length;)d="0"+d;c=d+c}},t.i=function(h){return 0>h?0:h<this.g.length?this.g[h]:this.h};function A(h){if(h.h!=0)return!1;for(var o=0;o<h.g.length;o++)if(h.g[o]!=0)return!1;return!0}function C(h){return h.h==-1}t.l=function(h){return h=Y(this,h),C(h)?-1:A(h)?0:1};function I(h){for(var o=h.g.length,u=[],c=0;c<o;c++)u[c]=~h.g[c];return new f(u,~h.h).add(_)}t.abs=function(){return C(this)?I(this):this},t.add=function(h){for(var o=Math.max(this.g.length,h.g.length),u=[],c=0,l=0;l<=o;l++){var d=c+(this.i(l)&65535)+(h.i(l)&65535),a=(d>>>16)+(this.i(l)>>>16)+(h.i(l)>>>16);c=a>>>16,d&=65535,a&=65535,u[l]=a<<16|d}return new f(u,u[u.length-1]&-2147483648?-1:0)};function Y(h,o){return h.add(I(o))}t.j=function(h){if(A(this)||A(h))return w;if(C(this))return C(h)?I(this).j(I(h)):I(I(this).j(h));if(C(h))return I(this.j(I(h)));if(0>this.l(P)&&0>h.l(P))return g(this.m()*h.m());for(var o=this.g.length+h.g.length,u=[],c=0;c<2*o;c++)u[c]=0;for(c=0;c<this.g.length;c++)for(var l=0;l<h.g.length;l++){var d=this.i(c)>>>16,a=this.i(c)&65535,X=h.i(l)>>>16,sn=h.i(l)&65535;u[2*c+2*l]+=a*sn,$(u,2*c+2*l),u[2*c+2*l+1]+=d*sn,$(u,2*c+2*l+1),u[2*c+2*l+1]+=a*X,$(u,2*c+2*l+1),u[2*c+2*l+2]+=d*X,$(u,2*c+2*l+2)}for(c=0;c<o;c++)u[c]=u[2*c+1]<<16|u[2*c];for(c=o;c<2*o;c++)u[c]=0;return new f(u,0)};function $(h,o){for(;(h[o]&65535)!=h[o];)h[o+1]+=h[o]>>>16,h[o]&=65535,o++}function q(h,o){this.g=h,this.h=o}function re(h,o){if(A(o))throw Error("division by zero");if(A(h))return new q(w,w);if(C(h))return o=re(I(h),o),new q(I(o.g),I(o.h));if(C(o))return o=re(h,I(o)),new q(I(o.g),o.h);if(30<h.g.length){if(C(h)||C(o))throw Error("slowDivide_ only works with positive integers.");for(var u=_,c=o;0>=c.l(h);)u=rn(u),c=rn(c);var l=ie(u,1),d=ie(c,1);for(c=ie(c,2),u=ie(u,2);!A(c);){var a=d.add(c);0>=a.l(h)&&(l=l.add(u),d=a),c=ie(c,1),u=ie(u,1)}return o=Y(h,l.j(o)),new q(l,o)}for(l=w;0<=h.l(o);){for(u=Math.max(1,Math.floor(h.m()/o.m())),c=Math.ceil(Math.log(u)/Math.LN2),c=48>=c?1:Math.pow(2,c-48),d=g(u),a=d.j(o);C(a)||0<a.l(h);)u-=c,d=g(u),a=d.j(o);A(d)&&(d=_),l=l.add(d),h=Y(h,a)}return new q(l,h)}t.A=function(h){return re(this,h).h},t.and=function(h){for(var o=Math.max(this.g.length,h.g.length),u=[],c=0;c<o;c++)u[c]=this.i(c)&h.i(c);return new f(u,this.h&h.h)},t.or=function(h){for(var o=Math.max(this.g.length,h.g.length),u=[],c=0;c<o;c++)u[c]=this.i(c)|h.i(c);return new f(u,this.h|h.h)},t.xor=function(h){for(var o=Math.max(this.g.length,h.g.length),u=[],c=0;c<o;c++)u[c]=this.i(c)^h.i(c);return new f(u,this.h^h.h)};function rn(h){for(var o=h.g.length+1,u=[],c=0;c<o;c++)u[c]=h.i(c)<<1|h.i(c-1)>>>31;return new f(u,h.h)}function ie(h,o){var u=o>>5;o%=32;for(var c=h.g.length-u,l=[],d=0;d<c;d++)l[d]=0<o?h.i(d+u)>>>o|h.i(d+u+1)<<32-o:h.i(d+u);return new f(l,h.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Mi=Bn.Md5=r,f.prototype.add=f.prototype.add,f.prototype.multiply=f.prototype.j,f.prototype.modulo=f.prototype.A,f.prototype.compare=f.prototype.l,f.prototype.toNumber=f.prototype.m,f.prototype.toString=f.prototype.toString,f.prototype.getBits=f.prototype.i,f.fromNumber=g,f.fromString=b,mt=Bn.Integer=f}).apply(typeof Ln<"u"?Ln:typeof self<"u"?self:typeof window<"u"?window:{});var $n="4.9.0";var D=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};D.UNAUTHENTICATED=new D(null),D.GOOGLE_CREDENTIALS=new D("google-credentials-uid"),D.FIRST_PARTY=new D("first-party-uid"),D.MOCK_USER=new D("mock-user");var me="12.0.0";var de=new oe("@firebase/firestore");function Me(t,...e){if(de.logLevel<=T.DEBUG){let n=e.map(en);de.debug(`Firestore (${me}): ${t}`,...n)}}function Zt(t,...e){if(de.logLevel<=T.ERROR){let n=e.map(en);de.error(`Firestore (${me}): ${t}`,...n)}}function ir(t,...e){if(de.logLevel<=T.WARN){let n=e.map(en);de.warn(`Firestore (${me}): ${t}`,...n)}}function en(t){if(typeof t=="string")return t;try{return function(n){return JSON.stringify(n)}(t)}catch{return t}}function R(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,sr(t,r,n)}function sr(t,e,n){let r=`FIRESTORE (${me}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw Zt(r),new Error(r)}function J(t,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,t||sr(e,i,r)}function tn(t,e){return t}var qn="ok",Li="cancelled",ve="unknown",E="invalid-argument",Bi="deadline-exceeded",$i="not-found";var qi="permission-denied",wt="unauthenticated",ji="resource-exhausted",pe="failed-precondition",Ui="aborted",zi="out-of-range",or="unimplemented",Hi="internal",Wi="unavailable";var y=class extends j{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};var Le=class{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},bt=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(D.UNAUTHENTICATED))}shutdown(){}},vt=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}},Et=class{constructor(e){this.auth=null,e.onInit(n=>{this.auth=n})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(J(typeof e.accessToken=="string",42297,{t:e}),new Le(e.accessToken,new D(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}},Tt=class{constructor(e,n,r){this.i=e,this.o=n,this.u=r,this.type="FirstParty",this.user=D.FIRST_PARTY,this.l=new Map}h(){return this.u?this.u():null}get headers(){this.l.set("X-Goog-AuthUser",this.i);let e=this.h();return e&&this.l.set("Authorization",e),this.o&&this.l.set("X-Goog-Iam-Authorization-Token",this.o),this.l}},At=class{constructor(e,n,r){this.i=e,this.o=n,this.u=r}getToken(){return Promise.resolve(new Tt(this.i,this.o,this.u))}start(e,n){e.enqueueRetryable(()=>n(D.FIRST_PARTY))}shutdown(){}invalidateToken(){}},Be=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},It=class{constructor(e,n){this.m=n,this.appCheck=null,this.T=null,xn(e)&&e.settings.appCheckToken&&(this.T=e.settings.appCheckToken),n.onInit(r=>{this.appCheck=r})}getToken(){return this.T?Promise.resolve(new Be(this.T)):this.appCheck?this.appCheck.getToken().then(e=>e?(J(typeof e.token=="string",3470,{tokenResult:e}),new Be(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,n){}shutdown(){}};var St=class{constructor(e,n,r,i,s,f,m,p,g,b){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=f,this.autoDetectLongPolling=m,this.longPollingOptions=p,this.useFetchStreams=g,this.isUsingEmulator=b}},Vt="(default)",$e=class t{constructor(e,n){this.projectId=e,this.database=n||Vt}static empty(){return new t("","")}get isDefaultDatabase(){return this.database===Vt}isEqual(e){return e instanceof t&&e.projectId===this.projectId&&e.database===this.database}};function S(t,e){return t<e?-1:t>e?1:0}function Pt(t,e){let n=Math.min(t.length,e.length);for(let r=0;r<n;r++){let i=t.charAt(r),s=e.charAt(r);if(i!==s)return gt(i)===gt(s)?S(i,s):gt(i)?1:-1}return S(t.length,e.length)}var Gi=55296,Ki=57343;function gt(t){let e=t.charCodeAt(0);return e>=Gi&&e<=Ki}function Ji(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}var jn="__name__",qe=class t{constructor(e,n,r){n===void 0?n=0:n>e.length&&R(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&R(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return t.comparator(this,e)===0}child(e){let n=this.segments.slice(this.offset,this.limit());return e instanceof t?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){let r=Math.min(e.length,n.length);for(let i=0;i<r;i++){let s=t.compareSegments(e.get(i),n.get(i));if(s!==0)return s}return S(e.length,n.length)}static compareSegments(e,n){let r=t.isNumericId(e),i=t.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?t.extractNumericId(e).compare(t.extractNumericId(n)):Pt(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return mt.fromString(e.substring(4,e.length-2))}},x=class t extends qe{construct(e,n,r){return new t(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let n=[];for(let r of e){if(r.indexOf("//")>=0)throw new y(E,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new t(n)}static emptyPath(){return new t([])}},Qi=/^[_a-zA-Z][_a-zA-Z0-9]*$/,ee=class t extends qe{construct(e,n,r){return new t(e,n,r)}static isValidIdentifier(e){return Qi.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),t.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===jn}static keyField(){return new t([jn])}static fromServerFormat(e){let n=[],r="",i=0,s=()=>{if(r.length===0)throw new y(E,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""},f=!1;for(;i<e.length;){let m=e[i];if(m==="\\"){if(i+1===e.length)throw new y(E,"Path has trailing escape character: "+e);let p=e[i+1];if(p!=="\\"&&p!=="."&&p!=="`")throw new y(E,"Path has invalid escape sequence: "+e);r+=p,i+=2}else m==="`"?(f=!f,i++):m!=="."||f?(r+=m,i++):(s(),i++)}if(s(),f)throw new y(E,"Unterminated ` in path: "+e);return new t(n)}static emptyPath(){return new t([])}};var L=class t{constructor(e){this.path=e}static fromPath(e){return new t(x.fromString(e))}static fromName(e){return new t(x.fromString(e).popFirst(5))}static empty(){return new t(x.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&x.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return x.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new t(new x(e.slice()))}};function Yi(t,e,n){if(!n)throw new y(E,`Function ${t}() cannot be called with an empty ${e}.`)}function Un(t){if(L.isDocumentKey(t))throw new y(E,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function Xi(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function Zi(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{let e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":R(12329,{type:typeof t})}function ar(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new y(E,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=Zi(t);throw new y(E,`Expected type '${e.name}', but it was: ${n}`)}}return t}function ur(t){let e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}var Ne=null;function es(){return Ne===null?Ne=function(){return 268435456+Math.round(2147483648*Math.random())}():Ne++,"0x"+Ne.toString(16)}function ts(t){return t==null}function zn(t){return t===0&&1/t==-1/0}var _t="RestConnection",ns={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"},Rt=class{get P(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.A=n+"://"+e.host,this.R=`projects/${r}/databases/${i}`,this.V=this.databaseId.database===Vt?`project_id=${r}`:`project_id=${r}&database_id=${i}`}I(e,n,r,i,s){let f=es(),m=this.p(e,n.toUriEncodedString());Me(_t,`Sending RPC '${e}' ${f}:`,m,r);let p={"google-cloud-resource-prefix":this.R,"x-goog-request-params":this.V};this.F(p,i,s);let{host:g}=new URL(m),b=Ce(g);return this.v(e,m,p,r,b).then(w=>(Me(_t,`Received RPC '${e}' ${f}: `,w),w),w=>{throw ir(_t,`RPC '${e}' ${f} failed with error: `,w,"url: ",m,"request:",r),w})}D(e,n,r,i,s,f){return this.I(e,n,r,i,s)}F(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+me}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}p(e,n){let r=ns[e];return`${this.A}/v1/${n}:${r}`}terminate(){}};var Hn,v;function Wn(t){if(t===void 0)return Zt("RPC_ERROR","HTTP error has no status"),ve;switch(t){case 200:return qn;case 400:return pe;case 401:return wt;case 403:return qi;case 404:return $i;case 409:return Ui;case 416:return zi;case 429:return ji;case 499:return Li;case 500:return ve;case 501:return or;case 503:return Wi;case 504:return Bi;default:return t>=200&&t<300?qn:t>=400&&t<500?pe:t>=500&&t<600?Hi:ve}}(v=Hn||(Hn={}))[v.OK=0]="OK",v[v.CANCELLED=1]="CANCELLED",v[v.UNKNOWN=2]="UNKNOWN",v[v.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",v[v.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",v[v.NOT_FOUND=5]="NOT_FOUND",v[v.ALREADY_EXISTS=6]="ALREADY_EXISTS",v[v.PERMISSION_DENIED=7]="PERMISSION_DENIED",v[v.UNAUTHENTICATED=16]="UNAUTHENTICATED",v[v.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",v[v.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",v[v.ABORTED=10]="ABORTED",v[v.OUT_OF_RANGE=11]="OUT_OF_RANGE",v[v.UNIMPLEMENTED=12]="UNIMPLEMENTED",v[v.INTERNAL=13]="INTERNAL",v[v.UNAVAILABLE=14]="UNAVAILABLE",v[v.DATA_LOSS=15]="DATA_LOSS";var Dt=class extends Rt{S(e,n){throw new Error("Not supported by FetchConnection")}async v(e,n,r,i,s){let f=JSON.stringify(i),m;try{let p={method:"POST",headers:r,body:f};s&&(p.credentials="include"),m=await fetch(n,p)}catch(p){let g=p;throw new y(Wn(g.status),"Request failed with error: "+g.statusText)}if(!m.ok){let p=await m.json();Array.isArray(p)&&(p=p[0]);let g=p?.error?.message;throw new y(Wn(m.status),`Request failed with error: ${g??m.statusText}`)}return m.json()}};function Gn(t){let e=0;for(let n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function nn(t,e){for(let n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}var Ct=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};var Q=class t{constructor(e){this.binaryString=e}static fromBase64String(e){let n=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Ct("Invalid base64 string: "+s):s}}(e);return new t(n)}static fromUint8Array(e){let n=function(i){let s="";for(let f=0;f<i.length;++f)s+=String.fromCharCode(i[f]);return s}(e);return new t(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){let r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return S(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Q.EMPTY_BYTE_STRING=new Q("");var rs=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function te(t){if(J(!!t,39018),typeof t=="string"){let e=0,n=rs.exec(t);if(J(!!n,46558,{timestamp:t}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}let r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:V(t.seconds),nanos:V(t.nanos)}}function V(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function Ae(t){return typeof t=="string"?Q.fromBase64String(t):Q.fromUint8Array(t)}function O(t,e){let n={typeString:t};return e&&(n.value=e),n}function Re(t,e){if(!Xi(t))throw new y(E,"JSON must be an object");let n;for(let r in e)if(e[r]){let i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}let f=t[r];if(i&&typeof f!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&f!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new y(E,n);return!0}var Kn=-62135596800,Jn=1e6,F=class t{static now(){return t.fromMillis(Date.now())}static fromDate(e){return t.fromMillis(e.getTime())}static fromMillis(e){let n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*Jn);return new t(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new y(E,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new y(E,"Timestamp nanoseconds out of range: "+n);if(e<Kn)throw new y(E,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new y(E,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Jn}_compareTo(e){return this.seconds===e.seconds?S(this.nanoseconds,e.nanoseconds):S(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:t._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Re(e,t._jsonSchema))return new t(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-Kn;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};F._jsonSchemaVersion="firestore/timestamp/1.0",F._jsonSchema={type:O("string",F._jsonSchemaVersion),seconds:O("number"),nanoseconds:O("number")};function cr(t){return(t?.mapValue?.fields||{}).__type__?.stringValue==="server_timestamp"}function lr(t){let e=t.mapValue.fields.__previous_value__;return cr(e)?lr(e):e}function Ie(t){let e=te(t.mapValue.fields.__local_write_time__.timestampValue);return new F(e.seconds,e.nanos)}var is="__type__",hr="__max__",Fe={fields:{__type__:{stringValue:hr}}},ss="__vector__",kt="value";function ne(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?cr(t)?4:function(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===hr}(t)?9007199254740991:function(n){return(n?.mapValue?.fields||{})[is]?.stringValue===ss}(t)?10:11:R(28295,{value:t})}function je(t,e){if(t===e)return!0;let n=ne(t);if(n!==ne(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return Ie(t).isEqual(Ie(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;let f=te(i.timestampValue),m=te(s.timestampValue);return f.seconds===m.seconds&&f.nanos===m.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return Ae(i.bytesValue).isEqual(Ae(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return V(i.geoPointValue.latitude)===V(s.geoPointValue.latitude)&&V(i.geoPointValue.longitude)===V(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return V(i.integerValue)===V(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){let f=V(i.doubleValue),m=V(s.doubleValue);return f===m?zn(f)===zn(m):isNaN(f)&&isNaN(m)}return!1}(t,e);case 9:return Ji(t.arrayValue.values||[],e.arrayValue.values||[],je);case 10:case 11:return function(i,s){let f=i.mapValue.fields||{},m=s.mapValue.fields||{};if(Gn(f)!==Gn(m))return!1;for(let p in f)if(f.hasOwnProperty(p)&&(m[p]===void 0||!je(f[p],m[p])))return!1;return!0}(t,e);default:return R(52216,{left:t})}}function Se(t,e){return(t.values||[]).find(n=>je(n,e))!==void 0}function Ue(t,e){if(t===e)return 0;let n=ne(t),r=ne(e);if(n!==r)return S(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return S(t.booleanValue,e.booleanValue);case 2:return function(s,f){let m=V(s.integerValue||s.doubleValue),p=V(f.integerValue||f.doubleValue);return m<p?-1:m>p?1:m===p?0:isNaN(m)?isNaN(p)?0:-1:1}(t,e);case 3:return Qn(t.timestampValue,e.timestampValue);case 4:return Qn(Ie(t),Ie(e));case 5:return Pt(t.stringValue,e.stringValue);case 6:return function(s,f){let m=Ae(s),p=Ae(f);return m.compareTo(p)}(t.bytesValue,e.bytesValue);case 7:return function(s,f){let m=s.split("/"),p=f.split("/");for(let g=0;g<m.length&&g<p.length;g++){let b=S(m[g],p[g]);if(b!==0)return b}return S(m.length,p.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,f){let m=S(V(s.latitude),V(f.latitude));return m!==0?m:S(V(s.longitude),V(f.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return Yn(t.arrayValue,e.arrayValue);case 10:return function(s,f){let m=s.fields||{},p=f.fields||{},g=m[kt]?.arrayValue,b=p[kt]?.arrayValue,w=S(g?.values?.length||0,b?.values?.length||0);return w!==0?w:Yn(g,b)}(t.mapValue,e.mapValue);case 11:return function(s,f){if(s===Fe&&f===Fe)return 0;if(s===Fe)return 1;if(f===Fe)return-1;let m=s.fields||{},p=Object.keys(m),g=f.fields||{},b=Object.keys(g);p.sort(),b.sort();for(let w=0;w<p.length&&w<b.length;++w){let _=Pt(p[w],b[w]);if(_!==0)return _;let P=Ue(m[p[w]],g[b[w]]);if(P!==0)return P}return S(p.length,b.length)}(t.mapValue,e.mapValue);default:throw R(23264,{C:n})}}function Qn(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return S(t,e);let n=te(t),r=te(e),i=S(n.seconds,r.seconds);return i!==0?i:S(n.nanos,r.nanos)}function Yn(t,e){let n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){let s=Ue(n[i],r[i]);if(s)return s}return S(n.length,r.length)}function fr(t){return!!t&&"arrayValue"in t}function Xn(t){return!!t&&"nullValue"in t}function Zn(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function yt(t){return!!t&&"mapValue"in t}function Ee(t){if(t.geoPointValue)return{geoPointValue:{...t.geoPointValue}};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:{...t.timestampValue}};if(t.mapValue){let e={mapValue:{fields:{}}};return nn(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=Ee(r)),e}if(t.arrayValue){let e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=Ee(t.arrayValue.values[n]);return e}return{...t}}var ze=class{constructor(e,n){this.position=e,this.inclusive=n}};var He=class{},B=class t extends He{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new xt(e,n,r):n==="array-contains"?new Ft(e,r):n==="in"?new Mt(e,r):n==="not-in"?new Lt(e,r):n==="array-contains-any"?new Bt(e,r):new t(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new Ot(e,r):new Nt(e,r)}matches(e){let n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(Ue(n,this.value)):n!==null&&ne(this.value)===ne(n)&&this.matchesComparison(Ue(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return R(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},We=class t extends He{constructor(e,n){super(),this.filters=e,this.op=n,this.N=null}static create(e,n){return new t(e,n)}matches(e){return function(r){return r.op==="and"}(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.N!==null||(this.N=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.N}getFilters(){return Object.assign([],this.filters)}};var xt=class extends B{constructor(e,n,r){super(e,n,r),this.key=L.fromName(r.referenceValue)}matches(e){let n=L.comparator(e.key,this.key);return this.matchesComparison(n)}},Ot=class extends B{constructor(e,n){super(e,"in",n),this.keys=dr("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}},Nt=class extends B{constructor(e,n){super(e,"not-in",n),this.keys=dr("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}};function dr(t,e){return(e.arrayValue?.values||[]).map(n=>L.fromName(n.referenceValue))}var Ft=class extends B{constructor(e,n){super(e,"array-contains",n)}matches(e){let n=e.data.field(this.field);return fr(n)&&Se(n.arrayValue,this.value)}},Mt=class extends B{constructor(e,n){super(e,"in",n)}matches(e){let n=e.data.field(this.field);return n!==null&&Se(this.value.arrayValue,n)}},Lt=class extends B{constructor(e,n){super(e,"not-in",n)}matches(e){if(Se(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!Se(this.value.arrayValue,n)}},Bt=class extends B{constructor(e,n){super(e,"array-contains-any",n)}matches(e){let n=e.data.field(this.field);return!(!fr(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>Se(this.value.arrayValue,r))}};var Ve=class{constructor(e,n="asc"){this.field=e,this.dir=n}};var k=class t{static fromTimestamp(e){return new t(e)}static min(){return new t(new F(0,0))}static max(){return new t(new F(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};var $t=class t{constructor(e,n){this.comparator=e,this.root=n||M.EMPTY}insert(e,n){return new t(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,M.BLACK,null,null))}remove(e){return new t(this.comparator,this.root.remove(e,this.comparator).copy(null,null,M.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){let i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){let e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ue(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ue(this.root,e,this.comparator,!1)}getReverseIterator(){return new ue(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ue(this.root,e,this.comparator,!0)}},ue=class{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},M=class t{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r??t.RED,this.left=i??t.EMPTY,this.right=s??t.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new t(e??this.key,n??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this,s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return t.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return t.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,t.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,t.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw R(43730,{key:this.key,value:this.value});if(this.right.isRed())throw R(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw R(27949);return e+(this.isRed()?0:1)}};M.EMPTY=null,M.RED=!0,M.BLACK=!1;M.EMPTY=new class{constructor(){this.size=0}get key(){throw R(57766)}get value(){throw R(16141)}get color(){throw R(16727)}get left(){throw R(29726)}get right(){throw R(36894)}copy(e,n,r,i,s){return this}insert(e,n,r){return new M(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};var qt=class t{constructor(e){this.comparator=e,this.data=new $t(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new Ge(this.data.getIterator())}getIteratorFrom(e){return new Ge(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof t)||this.size!==e.size)return!1;let n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){let i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){let e=[];return this.forEach(n=>{e.push(n)}),e}toString(){let e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){let n=new t(this.comparator);return n.data=e,n}},Ge=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};var K=class t{constructor(e){this.value=e}static empty(){return new t({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!yt(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ee(n)}setAll(e){let n=ee.emptyPath(),r={},i=[];e.forEach((f,m)=>{if(!n.isImmediateParentOf(m)){let p=this.getFieldsMap(n);this.applyChanges(p,r,i),r={},i=[],n=m.popLast()}f?r[m.lastSegment()]=Ee(f):i.push(m.lastSegment())});let s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){let n=this.field(e.popLast());yt(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return je(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];yt(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){nn(n,(i,s)=>e[i]=s);for(let i of r)delete e[i]}clone(){return new t(Ee(this.value))}};var jt=class t{constructor(e,n,r,i,s,f,m){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=f,this.documentState=m}static newInvalidDocument(e){return new t(e,0,k.min(),k.min(),k.min(),K.empty(),0)}static newFoundDocument(e,n,r,i){return new t(e,1,n,k.min(),r,i,0)}static newNoDocument(e,n){return new t(e,2,n,k.min(),k.min(),K.empty(),0)}static newUnknownDocument(e,n){return new t(e,3,n,k.min(),k.min(),K.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(k.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=K.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=K.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=k.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof t&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new t(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};var Ut=class{constructor(e,n=null,r=[],i=[],s=null,f=null,m=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=f,this.endAt=m,this.O=null}};function er(t,e=null,n=[],r=[],i=null,s=null,f=null){return new Ut(t,e,n,r,i,s,f)}var zt=class{constructor(e,n=null,r=[],i=[],s=null,f="F",m=null,p=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=f,this.startAt=m,this.endAt=p,this.q=null,this.B=null,this.$=null,this.startAt,this.endAt}};function os(t){let e=tn(t);if(e.q===null){e.q=[];let n=new Set;for(let s of e.explicitOrderBy)e.q.push(s),n.add(s.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(f){let m=new qt(ee.comparator);return f.filters.forEach(p=>{p.getFlattenedFilters().forEach(g=>{g.isInequality()&&(m=m.add(g.field))})}),m})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.q.push(new Ve(s,r))}),n.has(ee.keyField().canonicalString())||e.q.push(new Ve(ee.keyField(),r))}return e.q}function as(t){let e=tn(t);return e.B||(e.B=us(e,os(t))),e.B}function us(t,e){if(t.limitType==="F")return er(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{let s=i.dir==="desc"?"asc":"desc";return new Ve(i.field,s)});let n=t.endAt?new ze(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new ze(t.startAt.position,t.startAt.inclusive):null;return er(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}var cs={asc:"ASCENDING",desc:"DESCENDING"},ls={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},hs={and:"AND",or:"OR"},Ht=class{constructor(e,n){this.databaseId=e,this.useProto3Json=n}};function tr(t){return J(!!t,49232),k.fromTimestamp(function(n){let r=te(n);return new F(r.seconds,r.nanos)}(t))}function fs(t,e){return Wt(t,e).canonicalString()}function Wt(t,e){let n=function(i){return new x(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function ds(t,e){let n=function(i){let s=x.fromString(i);return J(mr(s),10190,{key:s.toString()}),s}(e);if(n.get(1)!==t.databaseId.projectId)throw new y(E,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new y(E,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new L(function(i){return J(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)}(n))}function ps(t,e){let n={structuredQuery:{}},r=e.path,i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=function(g,b){return fs(g.databaseId,b)}(t,i);let s=function(g){if(g.length!==0)return pr(We.create(g,"and"))}(e.filters);s&&(n.structuredQuery.where=s);let f=function(g){if(g.length!==0)return g.map(b=>function(_){return{field:ae(_.field),direction:ms(_.dir)}}(b))}(e.orderBy);f&&(n.structuredQuery.orderBy=f);let m=function(g,b){return g.useProto3Json||ts(b)?b:{value:b}}(t,e.limit);return m!==null&&(n.structuredQuery.limit=m),e.startAt&&(n.structuredQuery.startAt=function(g){return{before:g.inclusive,values:g.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(g){return{before:!g.inclusive,values:g.position}}(e.endAt)),{M:n,parent:i}}function ms(t){return cs[t]}function gs(t){return ls[t]}function _s(t){return hs[t]}function ae(t){return{fieldPath:t.canonicalString()}}function pr(t){return t instanceof B?function(n){if(n.op==="=="){if(Zn(n.value))return{unaryFilter:{field:ae(n.field),op:"IS_NAN"}};if(Xn(n.value))return{unaryFilter:{field:ae(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(Zn(n.value))return{unaryFilter:{field:ae(n.field),op:"IS_NOT_NAN"}};if(Xn(n.value))return{unaryFilter:{field:ae(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ae(n.field),op:gs(n.op),value:n.value}}}(t):t instanceof We?function(n){let r=n.getFilters().map(i=>pr(i));return r.length===1?r[0]:{compositeFilter:{op:_s(n.op),filters:r}}}(t):R(54877,{filter:t})}function mr(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}function ys(t){return new Ht(t,!0)}var Gt=class{},Kt=class extends Gt{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.et=!1}rt(){if(this.et)throw new y(pe,"The client has already been terminated.")}I(e,n,r,i){return this.rt(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,f])=>this.connection.I(e,Wt(n,r),i,s,f)).catch(s=>{throw s.name==="FirebaseError"?(s.code===wt&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new y(ve,s.toString())})}D(e,n,r,i,s){return this.rt(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([f,m])=>this.connection.D(e,Wt(n,r),i,f,m,s)).catch(f=>{throw f.name==="FirebaseError"?(f.code===wt&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),f):new y(ve,f.toString())})}terminate(){this.et=!0,this.connection.terminate()}};async function ws(t,e){let n=tn(t),{M:r,parent:i}=ps(n.serializer,as(e));return(await n.D("RunQuery",n.serializer.databaseId,i,{structuredQuery:r.structuredQuery})).filter(s=>!!s.document).map(s=>function(m,p,g){let b=ds(m,p.name),w=tr(p.updateTime),_=p.createTime?tr(p.createTime):k.min(),P=new K({mapValue:{fields:p.fields}}),A=jt.newFoundDocument(b,w,_,P);return g&&A.setHasCommittedMutations(),g?A.setHasCommittedMutations():A}(n.serializer,s.document,void 0))}var gr="ComponentProvider",Te=new Map;function bs(t){if(t._terminated)throw new y(pe,"The client has already been terminated.");if(!Te.has(t)){Me(gr,"Initializing Datastore");let e=function(s){return new Dt(s)}(function(s,f,m,p){return new St(s,f,m,p.host,p.ssl,p.experimentalForceLongPolling,p.experimentalAutoDetectLongPolling,ur(p.experimentalLongPollingOptions),p.useFetchStreams,p.isUsingEmulator)}(t._databaseId,t.app.options.appId||"",t._persistenceKey,t._freezeSettings())),n=ys(t._databaseId),r=function(s,f,m,p){return new Kt(s,f,m,p)}(t._authCredentials,t._appCheckCredentials,e,n);Te.set(t,r)}return Te.get(t)}var vs=1048576,_r="firestore.googleapis.com",nr=!0;var Ke=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new y(E,"Can't provide ssl option if host option is not set");this.host=_r,this.ssl=nr}else this.host=e.host,this.ssl=e.ssl??nr;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<vs)throw new y(E,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(r,i,s,f){if(i===!0&&f===!0)throw new y(E,`${r} and ${s} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ur(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new y(E,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new y(E,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new y(E,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}},Pe=class{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ke({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new y(pe,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new y(pe,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ke(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new bt;switch(r.type){case"firstParty":return new At(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new y(E,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){let r=Te.get(n);r&&(Me(gr,"Removing Datastore"),Te.delete(n),r.terminate())}(this),Promise.resolve()}};function yr(t,e){let n=typeof t=="object"?t:Nn(),r=typeof t=="string"?t:e||"(default)",i=kn(n,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){let s=dn("firestore");s&&Es(i,...s)}return i}function Es(t,e,n,r={}){t=ar(t,Pe);let i=Ce(e),s=t._getSettings(),f={...s,emulatorOptions:t._getEmulatorOptions()},m=`${e}:${n}`;i&&(pn(`https://${m}`),gn("Firestore",!0)),s.host!==_r&&s.host!==m&&ir("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let p={...s,host:m,ssl:i,emulatorOptions:r};if(!se(p,f)&&(t._setSettings(p),r.mockUserToken)){let g,b;if(typeof r.mockUserToken=="string")g=r.mockUserToken,b=D.MOCK_USER;else{g=mn(r.mockUserToken,t._app?.options.projectId);let w=r.mockUserToken.sub||r.mockUserToken.user_id;if(!w)throw new y(E,"mockUserToken must contain 'sub' or 'user_id' field!");b=new D(w)}t._authCredentials=new vt(new Le(g,b))}}var Je=class t{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new t(this.firestore,e,this._query)}},H=class t{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ce(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new t(this.firestore,e,this._key)}toJSON(){return{type:t._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(Re(n,t._jsonSchema))return new t(e,r||null,new L(x.fromString(n.referencePath)))}};H._jsonSchemaVersion="firestore/documentReference/1.0",H._jsonSchema={type:O("string",H._jsonSchemaVersion),referencePath:O("string")};var ce=class t extends Je{constructor(e,n,r){super(e,n,function(s){return new zt(s)}(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new H(this.firestore,null,new L(e))}withConverter(e){return new t(this.firestore,e,this._path)}};function wr(t,e,...n){if(t=wn(t),Yi("collection","path",e),t instanceof Pe){let r=x.fromString(e,...n);return Un(r),new ce(t,null,r)}{if(!(t instanceof H||t instanceof ce))throw new y(E,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=t._path.child(x.fromString(e,...n));return Un(r),new ce(t.firestore,null,r)}}var le=class t{constructor(e){this._byteString=e}static fromBase64String(e){try{return new t(Q.fromBase64String(e))}catch(n){throw new y(E,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new t(Q.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:t._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Re(e,t._jsonSchema))return t.fromBase64String(e.bytes)}};le._jsonSchemaVersion="firestore/bytes/1.0",le._jsonSchema={type:O("string",le._jsonSchemaVersion),bytes:O("string")};var Qe=class{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new y(E,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ee(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};var he=class t{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new y(E,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new y(E,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return S(this._lat,e._lat)||S(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:t._jsonSchemaVersion}}static fromJSON(e){if(Re(e,t._jsonSchema))return new t(e.latitude,e.longitude)}};he._jsonSchemaVersion="firestore/geoPoint/1.0",he._jsonSchema={type:O("string",he._jsonSchemaVersion),latitude:O("number"),longitude:O("number")};var fe=class t{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:t._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Re(e,t._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new t(e.vectorValues);throw new y(E,"Expected 'vectorValues' field to be a number array")}}};fe._jsonSchemaVersion="firestore/vectorValue/1.0",fe._jsonSchema={type:O("string",fe._jsonSchemaVersion),vectorValues:O("object")};var Ts=new RegExp("[~\\*/\\[\\]]");function As(t,e,n){if(e.search(Ts)>=0)throw rr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Qe(...e.split("."))._internalPath}catch{throw rr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function rr(t,e,n,r,i){let s=r&&!r.isEmpty(),f=i!==void 0,m=`Function ${e}() called with invalid data`;n&&(m+=" (via `toFirestore()`)"),m+=". ";let p="";return(s||f)&&(p+=" (found",s&&(p+=` in field ${r}`),f&&(p+=` in document ${i}`),p+=")"),new y(E,m+t+p)}var Jt=class{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new H(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new Ye(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let n=this._document.data.field(Is("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}},Ye=class extends Jt{data(){return super.data()}},Qt=class{constructor(e,n){this._docs=n,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,n){this._docs.forEach(e,n)}};function Is(t,e){return typeof e=="string"?As(t,e):e instanceof Qe?e._internalPath:e._delegate._internalPath}var Yt=class{convertValue(e,n="none"){switch(ne(e)){case 0:return null;case 1:return e.booleanValue;case 2:return V(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(Ae(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw R(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){let r={};return nn(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){let n=e.fields?.[kt].arrayValue?.values?.map(r=>V(r.doubleValue));return new fe(n)}convertGeoPoint(e){return new he(V(e.latitude),V(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":let r=lr(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(Ie(e));default:return null}}convertTimestamp(e){let n=te(e);return new F(n.seconds,n.nanos)}convertDocumentKey(e,n){let r=x.fromString(e);J(mr(r),9688,{name:e});let i=new $e(r.get(1),r.get(3)),s=new L(r.popFirst(5));return i.isEqual(n)||Zt(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}};var Xt=class extends Yt{constructor(e){super(),this.firestore=e}convertBytes(e){return new le(e)}convertReference(e){let n=this.convertDocumentKey(e,this.firestore._databaseId);return new H(this.firestore,null,n)}};function br(t){(function(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new y(or,"limitToLast() queries require specifying at least one orderBy() clause")})((t=ar(t,Je))._query);let e=bs(t.firestore),n=new Xt(t.firestore);return ws(e,t._query).then(r=>{let i=r.map(s=>new Ye(t.firestore,n,s.key,s,t.converter));return t._query.limitType==="L"&&i.reverse(),new Qt(t,i)})}(function(){(function(n){me=n})(`${On}_lite`),we(new U("firestore/lite",(e,{instanceIdentifier:n,options:r})=>{let i=e.getProvider("app").getImmediate(),s=new Pe(new Et(e.getProvider("auth-internal")),new It(i,e.getProvider("app-check-internal")),function(m,p){if(!Object.prototype.hasOwnProperty.apply(m.options,["projectId"]))throw new y(E,'"projectId" not provided in firebase.initializeApp.');return new $e(m.options.projectId,p)}(i,n),i);return r&&s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),G("firestore-lite",$n,""),G("firestore-lite",$n,"esm2020")})();var Ss={},Vs=pt(Ss),vr=yr(Vs);async function Ps(){let e=(await br(wr(vr,"cities"))).docs.map(r=>r.data()),n=document.getElementById("log")||document.body.appendChild(document.createElement("pre"));n.id="log",n.textContent=JSON.stringify(e,null,2)}document.addEventListener("deviceready",Ps);
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
  * @license
  * Copyright 2017 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
*/
