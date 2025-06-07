var F=i=>{throw TypeError(i)};var P=(i,t,e)=>t.has(i)||F("Cannot "+e);var d=(i,t,e)=>(P(i,t,"read from private field"),e?e.call(i):t.get(i)),h=(i,t,e)=>t.has(i)?F("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(i):t.set(i,e),v=(i,t,e,r)=>(P(i,t,"write to private field"),r?r.call(i,e):t.set(i,e),e),I=(i,t,e)=>(P(i,t,"access private method"),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();const U="modulepreload",z=function(i){return"/dicoding_web_intermidate_lastproject/"+i},T={},V=function(t,e,r){let o=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),a=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));o=Promise.allSettled(e.map(c=>{if(c=z(c),c in T)return;T[c]=!0;const f=c.endsWith(".css"),m=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const l=document.createElement("link");if(l.rel=f?"stylesheet":U,f||(l.as="script"),l.crossOrigin="",l.href=c,a&&l.setAttribute("nonce",a),document.head.appendChild(l),f)return new Promise((E,q)=>{l.addEventListener("load",E),l.addEventListener("error",()=>q(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(n){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=n,window.dispatchEvent(a),!a.defaultPrevented)throw n}return o.then(n=>{for(const a of n||[])a.status==="rejected"&&s(a.reason);return t().catch(s)})},W="StoryAppDB",H=1,b="stories",D=()=>new Promise((i,t)=>{const e=indexedDB.open(W,H);e.onupgradeneeded=r=>{const o=r.target.result;o.objectStoreNames.contains(b)||o.createObjectStore(b,{keyPath:"id"})},e.onsuccess=()=>i(e.result),e.onerror=()=>t(e.error)}),K=async i=>{const e=(await D()).transaction(b,"readwrite"),r=e.objectStore(b);return i.forEach(o=>r.put(o)),new Promise(o=>e.oncomplete=o)},A=async()=>{const e=(await D()).transaction(b,"readonly").objectStore(b);return new Promise(r=>{e.getAll().onsuccess=o=>r(o.target.result)})};class ${constructor(){this._baseUrl="https://story-api.dicoding.dev/v1"}async getStories(){try{const t=localStorage.getItem("token"),r=await(await fetch(`${this._baseUrl}/stories`,{headers:{Authorization:`Bearer ${t}`}})).json();return await K(r.listStory),r.listStory}catch(t){return console.error("Failed to fetch from API, fallback to IndexedDB:",t),await A()}}async getStoryById(t){try{const e=localStorage.getItem("token");return(await(await fetch(`${this._baseUrl}/stories/${t}`,{headers:{Authorization:`Bearer ${e}`}})).json()).story}catch(e){return console.error("Failed to fetch story details:",e),(await A()).find(o=>o.id===t)}}async addStory(t){const e=localStorage.getItem("token");if(!e)throw new Error("You must be logged in to submit a story");const r=await fetch(`${this._baseUrl}/stories`,{method:"POST",headers:{Authorization:`Bearer ${e}`},body:t}),o=await r.json();if(!r.ok)throw new Error(o.message||"Failed to submit story");return o.story}}const J="StoryAppFavoritesDB",Y=1,u="favoriteStories",k=()=>new Promise((i,t)=>{const e=indexedDB.open(J,Y);e.onupgradeneeded=r=>{const o=r.target.result;o.objectStoreNames.contains(u)||o.createObjectStore(u,{keyPath:"id"})},e.onsuccess=()=>i(e.result),e.onerror=()=>t(e.error)}),G=async i=>{const e=(await k()).transaction(u,"readwrite"),r=e.objectStore(u),o={...i,favoriteTimestamp:new Date().getTime()};return r.put(o),new Promise(s=>{e.oncomplete=()=>s(!0),e.onerror=()=>s(!1)})},_=async()=>{const e=(await k()).transaction(u,"readonly").objectStore(u);return new Promise(r=>{e.getAll().onsuccess=o=>r(o.target.result)})},N=async i=>{const r=(await k()).transaction(u,"readonly").objectStore(u);return new Promise(o=>{r.get(i).onsuccess=s=>o(!!s.target.result)})},j=async i=>{const e=(await k()).transaction(u,"readwrite");return e.objectStore(u).delete(i),new Promise(o=>{e.oncomplete=()=>o(!0),e.onerror=()=>o(!1)})};function Q(i){try{const t="=".repeat((4-i.length%4)%4),e=(i+t).replace(/\-/g,"+").replace(/_/g,"/"),r=window.atob(e),o=new Uint8Array(r.length);for(let s=0;s<r.length;++s)o[s]=r.charCodeAt(s);return o}catch(t){throw console.error("Error converting base64 to Uint8Array:",t),t}}function R(){return"serviceWorker"in navigator&&"PushManager"in window}async function X(){if(!R())return console.warn("Push notifications not supported in this browser"),null;try{return await navigator.serviceWorker.ready}catch(i){return console.error("Error getting service worker registration:",i),null}}async function B(){try{const i=await X();if(!i)return console.error("No service worker registration found"),!1;if(await Notification.requestPermission()!=="granted")return console.log("Notification permission denied"),!1;let e=await i.pushManager.getSubscription();return e?(console.log("User is already subscribed to push notifications"),await x(e),e):(e=await i.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Q("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk")}),console.log("User successfully subscribed to push notifications"),await x(e)?e:!1)}catch(i){return console.error("Error subscribing to push notifications:",i),!1}}async function x(i){if(!i)return console.error("No subscription provided"),!1;const t=localStorage.getItem("token");if(!t)return console.error("User token not found"),!1;try{console.log("Sending subscription to server");let e,r;try{e=btoa(String.fromCharCode.apply(null,new Uint8Array(i.getKey("p256dh")))),r=btoa(String.fromCharCode.apply(null,new Uint8Array(i.getKey("auth"))))}catch(a){throw console.error("Error encoding subscription keys:",a),new Error("Failed to encode subscription keys")}if(!i.endpoint||!e||!r)throw new Error("Subscription data is incomplete");const o={endpoint:i.endpoint,keys:{p256dh:e,auth:r}};console.log("Formatted subscription data ready to send");const s=await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(o)}),n=await s.json();if(!s.ok)throw new Error(n.message||"Failed to send subscription to server");return console.log("Subscription sent to server successfully:",n),!0}catch(e){return console.error("Error sending subscription to server:",e),!1}}async function C(i){if(!i)return console.error("No story data provided for notification"),!1;const t=localStorage.getItem("token");if(!t)return console.error("User token not found"),!1;try{console.log("Sending notification for new story with data:",i);const e=i.description||"New story added",r={title:"Story berhasil dibuat",options:{body:`Anda telah membuat story baru dengan deskripsi: ${e.substring(0,50)+(e.length>50?"...":"")}`}};console.log("Sending notification with data:",r);const o=await fetch("https://story-api.dicoding.dev/v1/notifications/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(r)});if(o.ok){const s=await o.json();console.log("Push notification API response:",s)}else{const s=await o.json();throw new Error(s.message||"Failed to send push notification")}return console.log("Push notification sent successfully"),!0}catch(e){return console.error("Error sending push notification:",e),!1}}const Z=Object.freeze(Object.defineProperty({__proto__:null,isPushNotificationSupported:R,notifyNewStory:C,subscribeToPushNotification:B},Symbol.toStringTag,{value:"Module"}));class ee{constructor({view:t,model:e}){this._view=t,this._model=e||new $,this._currentView="all"}async init(){await this._loadStories(),this._initializeViewToggle(),this._setupPushNotification()}async _loadStories(){try{if(localStorage.getItem("token"))try{const e=await this._model.getStories();this._view.showStories(e)}catch(e){console.error("Error fetching stories with token:",e),localStorage.removeItem("token"),window.location.hash="#/login"}else window.location.hash="#/login"}catch(t){console.error("Error:",t);const e=await this._model.getStories();this._view.showStories(e)}}_initializeViewToggle(){const t=document.getElementById("view-all-stories"),e=document.getElementById("view-favorite-stories");!t||!e||(t.addEventListener("click",async()=>{t.classList.add("active"),e.classList.remove("active"),this._currentView="all";const r=await this._model.getStories();this._view.showStories(r)}),e.addEventListener("click",async()=>{t.classList.remove("active"),e.classList.add("active"),this._currentView="favorites";const r=await _();this._view.showStories(r)}))}async _setupPushNotification(){if("serviceWorker"in navigator&&"PushManager"in window)try{console.log("Setting up push notification subscription"),await B()?console.log("Successfully set up push notification"):console.warn("Failed to set up push notification or permission denied")}catch(t){console.error("Error setting up push notification:",t)}}async toggleFavorite(t,e){const o=(this._currentView==="all"?await this._model.getStories():await _()).find(n=>n.id===t);if(!o)return;await N(t)?(await j(t),e.classList.remove("favorited"),e.textContent="🤍",this._currentView==="favorites"&&this._view.removeStoryFromDisplay(t)):(await G(o),e.classList.add("favorited"),e.textContent="❤️")}}function M(i,t="en-US",e={}){return new Date(i).toLocaleDateString(t,{year:"numeric",month:"long",day:"numeric",...e})}class te{constructor(){this._presenter=new ee({view:this})}async render(){return`
      <a href="#main-content" class="skip-link" tabindex="0">Skip to Content</a>
      <section class="container">
        <div class="top-section">
          <h1>Home Page</h1>
          <div class="story-view-toggles">
            <button id="view-all-stories" class="view-toggle active">All Stories</button>
            <button id="view-favorite-stories" class="view-toggle">Favorite Stories</button>
          </div>
          <div class="new-story-btn"><a href="#/form">Add new story</a></div>
        </div>
        <div id="story-list" tabindex="-1"></div>
      </section>
    `}async afterRender(){const t=document.querySelector(".skip-link"),e=document.getElementById("story-list");t&&(t.addEventListener("click",r=>{r.preventDefault(),e.setAttribute("tabindex","0"),e.focus(),setTimeout(()=>e.setAttribute("tabindex","-1"),1e3)}),document.addEventListener("keydown",r=>{r.key==="Tab"&&!r.shiftKey&&document.activeElement===document.body&&(r.preventDefault(),t.focus())})),await this._presenter.init()}async showStories(t){const e=document.getElementById("story-list");if(!t||t.length===0){e.innerHTML=`
        <p class="empty-message">${this._presenter._currentView==="all"?"No stories available. Try turning on your internet connection to sync.":"You don't have any favorite stories yet."}</p>
      `;return}const r=await Promise.all(t.map(async o=>{const s=await N(o.id),n=M(o.createdAt);return`
        <article class="story-card" tabindex="-1" data-id="${o.id}">
          <div class="favorite-btn-container">
            <button class="favorite-btn ${s?"favorited":""}" data-id="${o.id}">
              ${s?"❤️":"🤍"}
            </button>
          </div>
          <img src="${o.photoUrl}" alt="${o.description}">
          <h3>${o.name}</h3>
          <p class="story-description">${o.description}</p>
          <p class="story-date"><small>Posted on: ${n}</small></p>
          ${o.lat&&o.lon?`
            <div class="story-map" id="map-${o.id}" style="height: 200px;"></div>
          `:""}
        </article>
      `}));if(e.innerHTML=r.join(""),document.querySelectorAll(".favorite-btn").forEach(o=>{o.addEventListener("click",async()=>{const s=o.dataset.id;await this._presenter.toggleFavorite(s,o)})}),t.forEach(o=>{if(o.lat&&o.lon){const s=document.getElementById(`map-${o.id}`);if(s){const n=L.map(s).setView([o.lat,o.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(n),L.marker([o.lat,o.lon]).addTo(n).bindPopup(`<b>${o.name}</b><br>${o.description}`)}}}),document.activeElement===document.querySelector(".skip-link")){const o=e.querySelector(".story-card");o&&(o.setAttribute("tabindex","0"),o.focus(),o.addEventListener("blur",()=>{o.setAttribute("tabindex","-1")},{once:!0}))}}removeStoryFromDisplay(t){const e=document.querySelector(`.story-card[data-id="${t}"]`);e&&(e.classList.add("removing"),setTimeout(()=>{e.remove(),document.querySelectorAll(".story-card").length===0&&(document.getElementById("story-list").innerHTML=`<p class="empty-message">You don't have any favorite stories yet.</p>`)},300))}}class oe{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class re{constructor({view:t,model:e}){this._view=t,this._model=e||new $}async init(){this._view.initCamera(),this._view.initMap(),this._initFormSubmission(),"serviceWorker"in navigator&&"PushManager"in window&&await this._setupPushNotification()}async _setupPushNotification(){try{console.log("Setting up push notification in form page"),await B()&&console.log("Push notification subscription successful")}catch(t){console.error("Error setting up push notification:",t)}}_initFormSubmission(){const t=document.getElementById("story-form"),e=document.getElementById("photo");!t||!e||(e.addEventListener("change",()=>{const r=e.files[0];r&&r.size>1e6&&(this._view.showError("Photo size exceeds 1MB. Please choose a smaller photo."),e.value="")}),t.addEventListener("submit",async r=>{if(r.preventDefault(),!localStorage.getItem("token")){this._view.showError("You must be logged in first.");return}const s=new FormData(t),n=s.get("photo");if(n&&n.size>1e6){this._view.showError("Photo size exceeds 1MB limit. Please compress it first.");return}try{const a=t.querySelector('button[type="submit"]');a&&(a.textContent="Submitting...",a.disabled=!0);const c=await this._model.addStory(s);this._view.showSuccess("Story added successfully!");const f=s.get("description")||"New story added";try{if(c&&c.id){console.log("Preparing to send notification for story:",c.id);const m={id:c.id,description:f};console.log("Notification data:",m),await C(m),console.log("Notification sent to server successfully")}else console.warn("Story object is incomplete, skipping notification")}catch(m){console.error("Error sending notification:",m)}setTimeout(()=>{window.location.hash="#/"},1e3)}catch(a){console.error("Failed to add story:",a),this._view.showError(a.message||"Failed to add story. Please try again."),submitButton&&(submitButton.textContent="Submit",submitButton.disabled=!1)}}))}}class ie{constructor(){this._presenter=new re({view:this}),this.stream=null}async render(){return`
      <section class="container">
        <h1>Tambah Story Baru</h1>
        <div id="form-alert" class="alert" style="display: none;"></div>
        <form id="story-form">
          <div class="form-group">
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label for="photo">Foto:</label>
            <div id="camera-preview" style="display: none;">
              <video id="camera-stream" autoplay></video>
              <button type="button" id="capture-btn">Ambil Foto</button>
            </div>
            <canvas id="photo-canvas" style="display: none;"></canvas>
            <input type="file" id="photo" name="photo" accept="image/*" required>
            <button type="button" id="open-camera-btn">Buka Kamera</button>
            <small>Maksimal ukuran file: 1MB</small>
          </div>

          <div class="form-group">
            <label for="location">Lokasi:</label>
            <div id="map" style="height: 200px; margin-bottom: 10px;"></div>
            <input type="hidden" id="lat" name="lat">
            <input type="hidden" id="lon" name="lon">
            <small>Klik pada peta untuk memilih lokasi (opsional).</small>
          </div>

          <button type="submit">Tambah Story</button>
        </form>
      </section>
    `}async afterRender(){await this._presenter.init()}showError(t){const e=document.getElementById("form-alert");e.innerHTML=t,e.style.display="block",e.classList.add("error"),e.classList.remove("success")}showSuccess(t){const e=document.getElementById("form-alert");e.innerHTML=t,e.style.display="block",e.classList.add("success"),e.classList.remove("error")}async triggerNotification(t,e){const r="Story Added Successfully",o={body:e.length>50?e.substring(0,50)+"...":e,icon:"/favicon.png",badge:"/favicon-16x16.png",vibrate:[100,50,100],data:{url:"/#/"}};await t.showNotification(r,o)}cleanup(){if(this.stream){this.stream.getTracks().forEach(r=>r.stop()),this.stream=null;const t=document.getElementById("camera-preview"),e=document.getElementById("open-camera-btn");t&&(t.style.display="none"),e&&(e.style.display="block")}}initCamera(){const t=document.getElementById("open-camera-btn"),e=document.getElementById("camera-preview"),r=document.getElementById("camera-stream"),o=document.getElementById("capture-btn"),s=document.getElementById("photo-canvas"),n=document.getElementById("photo");t.addEventListener("click",async()=>{try{this.stream=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720,facingMode:"environment"}}),r.srcObject=this.stream,e.style.display="block",t.style.display="none"}catch(a){console.error("Gagal mengakses kamera:",a);try{this.stream=await navigator.mediaDevices.getUserMedia({video:!0}),r.srcObject=this.stream,e.style.display="block",t.style.display="none"}catch(c){console.error("Fallback kamera gagal:",c),alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.")}}}),o.addEventListener("click",()=>{const c=800/r.videoWidth;s.width=800,s.height=r.videoHeight*c,s.getContext("2d").drawImage(r,0,0,s.width,s.height);const m=l=>{s.toBlob(E=>{E.size<=1e6||l<=.3?this.createImageFile(E,n):m(l-.1)},"image/jpeg",l)};m(.7),this.stream&&(this.stream.getTracks().forEach(l=>l.stop()),this.stream=null),e.style.display="none",t.style.display="block"})}createImageFile(t,e){const r=new File([t],"photo.jpg",{type:"image/jpeg",lastModified:Date.now()}),o=new DataTransfer;o.items.add(r),e.files=o.files,console.log("Ukuran file akhir:",(t.size/1024).toFixed(2),"KB")}initMap(){const t=L.map("map").setView([-6.1754,106.8272],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(t);let e=null;t.on("click",r=>{const{lat:o,lng:s}=r.latlng;e&&t.removeLayer(e),e=L.marker([o,s]).addTo(t),document.getElementById("lat").value=o,document.getElementById("lon").value=s})}}class se{constructor({view:t}){this._view=t}async init(){await this._loadFavorites()}async _loadFavorites(){const t=await _();if(!t||t.length===0){this._view.showEmptyFavorites();return}t.sort((e,r)=>r.favoriteTimestamp-e.favoriteTimestamp),this._view.showFavorites(t)}async removeFavorite(t,e){e.classList.add("removing"),setTimeout(async()=>{await j(t),e.remove(),document.querySelectorAll(".favorite-story-card").length===0&&this._view.showEmptyFavorites()},300)}}class ne{constructor(){this._presenter=new se({view:this})}async render(){return`
      <section class="container">
        <h1>Favorite Stories</h1>
        <div class="favorites-container">
          <div id="favorites-list"></div>
        </div>
      </section>
    `}async afterRender(){await this._presenter.init()}showEmptyFavorites(){const t=document.getElementById("favorites-list");t.innerHTML=`
      <div class="empty-favorites">
        <p>You don't have any favorite stories yet.</p>
        <a href="#/" class="btn-primary">Browse Stories</a>
      </div>
    `}showFavorites(t){const e=document.getElementById("favorites-list");e.innerHTML=t.map(r=>{const o=M(r.createdAt);return`
        <article class="favorite-story-card" data-id="${r.id}">
          <div class="favorite-story-content">
            <img src="${r.photoUrl}" alt="${r.description}" class="favorite-story-image">
            <div class="favorite-story-details">
              <h3>${r.name}</h3>
              <p>${r.description}</p>
              <p class="story-date"><small>Posted on: ${o}</small></p>
              <div class="favorite-actions">
                <button class="remove-favorite" data-id="${r.id}">Remove from Favorites</button>
              </div>
            </div>
          </div>
          ${r.lat&&r.lon?`
            <div class="story-map" id="favorite-map-${r.id}" style="height: 200px;"></div>
          `:""}
        </article>
      `}).join(""),document.querySelectorAll(".remove-favorite").forEach(r=>{r.addEventListener("click",()=>{const o=r.dataset.id,s=document.querySelector(`.favorite-story-card[data-id="${o}"]`);this._presenter.removeFavorite(o,s)})}),t.forEach(r=>{if(r.lat&&r.lon){const o=document.getElementById(`favorite-map-${r.id}`);if(o){const s=L.map(o).setView([r.lat,r.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(s),L.marker([r.lat,r.lon]).addTo(s).bindPopup(`<b>${r.name}</b><br>${r.description}`)}}})}}async function ae(i,t){const e=await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,password:t})}),r=await e.json();if(!e.ok)throw new Error(r.message||"Login failed");return r.loginResult.token}async function ce(i,t,e){const r=await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:i,email:t,password:e})}),o=await r.json();if(!r.ok)throw new Error(o.message||"Registration failed");return o}function le(){localStorage.removeItem("token"),window.location.hash="#/login"}class de{async render(){return`
      <section class="login-container">
        <h1>Login</h1>
        <div class="form-container">
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <div class="form-actions">
              <button type="submit" id="loginButton">Login</button>
            </div>
            <div class="form-footer">
              <p>Don't have an account? <a href="#/register">Register</a></p>
            </div>
            <div id="loginError" class="error-message"></div>
          </form>
        </div>
      </section>
    `}async afterRender(){const t=document.getElementById("loginForm"),e=document.getElementById("loginError");t.addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("email").value,s=document.getElementById("password").value;try{const n=await ae(o,s);localStorage.setItem("token",n),window.location.hash="#/"}catch(n){console.error("Login failed:",n),e.textContent=n.message||"Login failed. Please try again."}})}}class ue{async render(){return`
      <section class="register-container">
        <h1>Register</h1>
        <div class="form-container">
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="8">
              <small>Password must be at least 8 characters long</small>
            </div>
            <div class="form-actions">
              <button type="submit" id="registerButton">Register</button>
            </div>
            <div class="form-footer">
              <p>Already have an account? <a href="#/login">Login</a></p>
            </div>
            <div id="registerError" class="error-message"></div>
          </form>
        </div>
      </section>
    `}async afterRender(){const t=document.getElementById("registerForm"),e=document.getElementById("registerError");t.addEventListener("submit",async r=>{r.preventDefault();const o=document.getElementById("name").value,s=document.getElementById("email").value,n=document.getElementById("password").value;try{await ce(o,s,n),alert("Registration successful! Please login."),window.location.hash="#/login"}catch(a){console.error("Registration failed:",a),e.textContent=a.message||"Registration failed. Please try again."}})}}const me={"/":new te,"/about":new oe,"/form":new ie,"/favorites":new ne,"/login":new de,"/register":new ue};function pe(i){const t=i.split("/");return{resource:t[1]||null,id:t[2]||null}}function ge(i){let t="";return i.resource&&(t=t.concat(`/${i.resource}`)),i.id&&(t=t.concat("/:id")),t||"/"}function fe(){return location.hash.replace("#","")||"/"}function he(){const i=fe(),t=pe(i);return ge(t)}var y,w,p,g,S,O,ye;class ve{constructor({navigationDrawer:t,drawerButton:e,content:r}){h(this,S);h(this,y,null);h(this,w,null);h(this,p,null);h(this,g,null);v(this,y,r),v(this,w,e),v(this,p,t),I(this,S,O).call(this)}async renderPage(){const t=he(),e=me[t];d(this,g)&&d(this,g).cleanup&&d(this,g).cleanup(),document.startViewTransition?await document.startViewTransition(async()=>{d(this,y).innerHTML=await e.render(),await e.afterRender(),v(this,g,e)}).ready:(d(this,y).innerHTML=await e.render(),await e.afterRender(),v(this,g,e))}}y=new WeakMap,w=new WeakMap,p=new WeakMap,g=new WeakMap,S=new WeakSet,O=function(){d(this,w).addEventListener("click",()=>{d(this,p).classList.toggle("open")}),document.body.addEventListener("click",t=>{!d(this,p).contains(t.target)&&!d(this,w).contains(t.target)&&d(this,p).classList.remove("open"),d(this,p).querySelectorAll("a").forEach(e=>{e.contains(t.target)&&d(this,p).classList.remove("open")})})},ye=async function(){const t=document.getElementById("logout-button");t&&t.addEventListener("click",()=>{le()})};document.addEventListener("DOMContentLoaded",async()=>{const i=new ve({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await i.renderPage(),window.addEventListener("hashchange",async()=>{await i.renderPage()})});const we=async()=>{if(!("serviceWorker"in navigator))return console.warn("No Service Worker support!"),null;try{const i="/sw.js";console.log("Registering service worker at path:",i);const t=await navigator.serviceWorker.register(i);return console.log("Service Worker registered with scope:",t.scope),t}catch(i){return console.error("Service worker registration failed:",i),null}},be=async()=>{if(!("serviceWorker"in navigator)||!("PushManager"in window)){console.warn("Push notifications not supported");return}try{if(!localStorage.getItem("token")){console.log("User not logged in, skipping push setup");return}const{subscribeToPushNotification:t}=await V(async()=>{const{subscribeToPushNotification:r}=await Promise.resolve().then(()=>Z);return{subscribeToPushNotification:r}},void 0);await t()?console.log("Successfully subscribed to push notifications"):console.warn("Failed to subscribe to push notifications")}catch(i){console.error("Error setting up push notifications:",i)}},Se=async()=>{try{await we()&&(console.log("Service Worker registered successfully"),await be())}catch(i){console.error("Error initializing PWA:",i)}};window.addEventListener("load",()=>{setTimeout(Se,1e3)});
