var $=r=>{throw TypeError(r)};var x=(r,t,e)=>t.has(r)||$("Cannot "+e);var f=(r,t,e)=>(x(r,t,"read from private field"),e?e.call(r):t.get(r)),E=(r,t,e)=>t.has(r)?$("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),S=(r,t,e,n)=>(x(r,t,"write to private field"),n?n.call(r,e):t.set(r,e),e),N=(r,t,e)=>(x(r,t,"access private method"),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}})();const W="modulepreload",V=function(r){return"/dicoding_web_intermidate_lastproject/"+r},O={},H=function(t,e,n){let o=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));o=Promise.allSettled(e.map(u=>{if(u=V(u),u in O)return;O[u]=!0;const g=u.endsWith(".css"),w=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${w}`))return;const m=document.createElement("link");if(m.rel=g?"stylesheet":W,g||(m.as="script"),m.crossOrigin="",m.href=u,l&&m.setAttribute("nonce",l),document.head.appendChild(m),g)return new Promise((s,d)=>{m.addEventListener("load",s),m.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return o.then(a=>{for(const l of a||[])l.status==="rejected"&&i(l.reason);return t().catch(i)})},K="StoryAppDB",G=1,B="stories",_=()=>new Promise((r,t)=>{const e=indexedDB.open(K,G);e.onupgradeneeded=n=>{const o=n.target.result;o.objectStoreNames.contains(B)||o.createObjectStore(B,{keyPath:"id"})},e.onsuccess=()=>r(e.result),e.onerror=()=>t(e.error)}),J=async r=>{const e=(await _()).transaction(B,"readwrite"),n=e.objectStore(B);return r.forEach(o=>n.put(o)),new Promise(o=>e.oncomplete=o)},j=async()=>{const e=(await _()).transaction(B,"readonly").objectStore(B);return new Promise(n=>{e.getAll().onsuccess=o=>n(o.target.result)})},Y="StoryAppFavoritesDB",Q=1,v="favoriteStories",A=()=>new Promise((r,t)=>{const e=indexedDB.open(Y,Q);e.onupgradeneeded=n=>{const o=n.target.result;o.objectStoreNames.contains(v)||o.createObjectStore(v,{keyPath:"id"})},e.onsuccess=()=>r(e.result),e.onerror=()=>t(e.error)}),M=async r=>{const e=(await A()).transaction(v,"readwrite"),n=e.objectStore(v),o={...r,favoriteTimestamp:new Date().getTime()};return n.put(o),new Promise(i=>{e.oncomplete=()=>i(!0),e.onerror=()=>i(!1)})},C=async()=>{const e=(await A()).transaction(v,"readonly").objectStore(v);return new Promise(n=>{e.getAll().onsuccess=o=>n(o.target.result)})},q=async r=>{const n=(await A()).transaction(v,"readonly").objectStore(v);return new Promise(o=>{n.get(r).onsuccess=i=>o(!!i.target.result)})},F=async r=>{const e=(await A()).transaction(v,"readwrite");return e.objectStore(v).delete(r),new Promise(o=>{e.oncomplete=()=>o(!0),e.onerror=()=>o(!1)})},X=Object.freeze(Object.defineProperty({__proto__:null,getFavoriteStories:C,isStoryFavorite:q,openFavoriteDB:A,removeStoryFromFavorites:F,saveStoryToFavorites:M},Symbol.toStringTag,{value:"Module"}));function Z(r){const t="=".repeat((4-r.length%4)%4),e=(r+t).replace(/\-/g,"+").replace(/_/g,"/"),n=window.atob(e),o=new Uint8Array(n.length);for(let i=0;i<n.length;++i)o[i]=n.charCodeAt(i);return o}function ee(){return"serviceWorker"in navigator&&"PushManager"in window}async function R(){try{const r=await navigator.serviceWorker.getRegistration();if(!r)return console.error("No service worker registration found"),!1;if(await Notification.requestPermission()!=="granted")return console.log("Notification permission denied"),!1;const e=await r.pushManager.getSubscription();if(e)return console.log("User is already subscribed"),e;const o=await r.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Z("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk")});return console.log("User is now subscribed to push notifications"),await te(o),o}catch(r){return console.error("Error subscribing to push notifications:",r),!1}}async function te(r){const t=localStorage.getItem("token");if(!t)return console.error("User token not found"),!1;try{const e=await fetch("https://story-api.dicoding.dev/v1/push-notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(r)}),n=await e.json();if(!e.ok)throw new Error(n.message||"Failed to send subscription to server");return!0}catch(e){return console.error("Error sending subscription to server:",e),!1}}async function oe(r){const t=localStorage.getItem("token");if(!t)return!1;try{const e=await fetch("https://story-api.dicoding.dev/v1/push-notifications/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({title:"New Story Added",body:r.description||"Someone has shared a new story!",storyId:r.id})}),n=await e.json();return e.ok}catch(e){return console.error("Error sending push notification:",e),!1}}class re{async render(){return`
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
    `}async afterRender(){const t=document.querySelector(".skip-link"),e=document.getElementById("story-list"),n=document.getElementById("view-all-stories"),o=document.getElementById("view-favorite-stories");let i="all";t&&(t.addEventListener("click",s=>{s.preventDefault(),e.setAttribute("tabindex","0"),e.focus(),setTimeout(()=>e.setAttribute("tabindex","-1"),1e3)}),document.addEventListener("keydown",s=>{s.key==="Tab"&&!s.shiftKey&&document.activeElement===document.body&&(s.preventDefault(),t.focus())})),n.addEventListener("click",async()=>{n.classList.add("active"),o.classList.remove("active"),i="all";const s=localStorage.getItem("token"),d=await a(s);l(d)}),o.addEventListener("click",async()=>{n.classList.remove("active"),o.classList.add("active"),i="favorites";const{getFavoriteStories:s}=await H(async()=>{const{getFavoriteStories:p}=await Promise.resolve().then(()=>X);return{getFavoriteStories:p}},void 0),d=await s();l(d)});async function a(s){try{const p=await(await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${s}`}})).json();return await J(p.listStory),p.listStory}catch(d){return console.error("Gagal fetch dari API, fallback ke IndexedDB:",d),await j()}}async function l(s){if(!s||s.length===0){e.innerHTML=`
          <p class="empty-message">${i==="all"?"Tidak ada data. Coba nyalakan internet untuk sync.":"Belum ada cerita favorit yang disimpan."}</p>
        `;return}const d=await Promise.all(s.map(async c=>{const h=await q(c.id);return`
          <article class="story-card" tabindex="-1" data-id="${c.id}">
            <div class="favorite-btn-container">
              <button class="favorite-btn ${h?"favorited":""}" data-id="${c.id}">
                ${h?"❤️":"🤍"}
              </button>
            </div>
            <img src="${c.photoUrl}" alt="${c.description}">
            <h3>${c.name}</h3>
            <p>${c.description}</p>
            ${c.lat&&c.lon?`
              <div class="story-map" id="map-${c.id}" style="height: 200px;"></div>
            `:""}
          </article>
        `}));if(e.innerHTML=d.join(""),document.querySelectorAll(".favorite-btn").forEach(c=>{c.addEventListener("click",async function(){const h=this.dataset.id,I=document.querySelector(`.story-card[data-id="${h}"]`),D=s.find(z=>z.id===h);D&&(this.classList.contains("favorited")?(await F(h),this.classList.remove("favorited"),this.textContent="🤍",i==="favorites"&&(I.classList.add("removing"),setTimeout(()=>{I.remove(),document.querySelectorAll(".story-card").length===0&&(e.innerHTML='<p class="empty-message">Belum ada cerita favorit yang disimpan.</p>')},300))):(await M(D),this.classList.add("favorited"),this.textContent="❤️"))})}),s.forEach(c=>{if(c.lat&&c.lon){const h=document.getElementById(`map-${c.id}`);if(h){const I=L.map(h).setView([c.lat,c.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(I),L.marker([c.lat,c.lon]).addTo(I).bindPopup(`<b>${c.name}</b><br>${c.description}`)}}}),document.activeElement===t){const c=e.querySelector(".story-card");c&&(c.setAttribute("tabindex","0"),c.focus(),c.addEventListener("blur",()=>{c.setAttribute("tabindex","-1")},{once:!0}))}}async function u(){try{const s=localStorage.getItem("token");if(s)try{const d=await a(s);l(d)}catch(d){console.error("Error fetching stories with existing token:",d),localStorage.removeItem("token"),window.location.hash="#/login"}else window.location.hash="#/login"}catch(s){console.error("Error:",s);const d=await j();l(d)}}ee()&&await w();const g=document.getElementById("story-form");g&&g.addEventListener("submit",async s=>{s.preventDefault();const d=new FormData(g);try{const p=await m(d);if(p.ok){alert("Your story was added successfully!"),await oe(p.data),g.reset();const c=localStorage.getItem("token"),h=await a(c);l(h)}}catch(p){console.error("Error submitting story:",p),alert("Failed to submit story. Please try again.")}});async function w(){await R();const s=document.getElementById("notification-button");s&&s.addEventListener("click",async()=>{const d=await R();alert(d?"You are now subscribed to notifications!":"Could not subscribe to notifications.")})}async function m(s){const d=localStorage.getItem("token");if(!d)throw new Error("You must be logged in to submit a story");const p=await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${d}`},body:s}),c=await p.json();if(!p.ok)throw new Error(c.message||"Failed to submit story");return{ok:!0,data:c.story}}u()}}class ne{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class ie{async render(){return`
      <section class="container">
        <h1>Tambah Story Baru</h1>
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
    `}async afterRender(){this.initCamera(),this.initMap();const t=document.getElementById("story-form"),e=document.getElementById("photo");e.addEventListener("change",()=>{const n=e.files[0];n&&n.size>1e6&&(alert("Ukuran foto melebihi 1MB. Silakan pilih foto yang lebih kecil."),e.value="")}),t.addEventListener("submit",async n=>{n.preventDefault();const o=localStorage.getItem("token");if(!o){alert("Anda harus login terlebih dahulu.");return}const i=new FormData(t),a=i.get("photo");if(a&&a.size>1e6){alert("Ukuran foto melebihi batas 1MB. Silakan kompres terlebih dahulu.");return}try{const u=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${o}`},body:i})).json();if(u.error)throw new Error(u.message);alert("Story berhasil ditambahkan!");try{if("serviceWorker"in navigator&&"PushManager"in window&&await Notification.requestPermission()==="granted"){const w=await navigator.serviceWorker.ready;await this.triggerNotification(w,i.get("description"))}}catch(g){console.error("Error sending notification:",g)}window.location.hash="#/"}catch(l){console.error("Gagal menambahkan story:",l.message),alert("Gagal menambahkan story. Silakan coba lagi.")}})}async triggerNotification(t,e){const n="Story Added Successfully",o={body:e.length>50?e.substring(0,50)+"...":e,icon:"/favicon.png",badge:"/favicon-16x16.png",vibrate:[100,50,100],data:{url:"/#/"}};await t.showNotification(n,o)}cleanup(){if(this.stream){this.stream.getTracks().forEach(n=>n.stop()),this.stream=null;const t=document.getElementById("camera-preview"),e=document.getElementById("open-camera-btn");t&&(t.style.display="none"),e&&(e.style.display="block")}}initCamera(){const t=document.getElementById("open-camera-btn"),e=document.getElementById("camera-preview"),n=document.getElementById("camera-stream"),o=document.getElementById("capture-btn"),i=document.getElementById("photo-canvas"),a=document.getElementById("photo");t.addEventListener("click",async()=>{try{this.stream=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720,facingMode:"environment"}}),n.srcObject=this.stream,e.style.display="block",t.style.display="none"}catch(l){console.error("Gagal mengakses kamera:",l);try{this.stream=await navigator.mediaDevices.getUserMedia({video:!0}),n.srcObject=this.stream,e.style.display="block",t.style.display="none"}catch(u){console.error("Fallback kamera gagal:",u),alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.")}}}),o.addEventListener("click",()=>{const u=800/n.videoWidth;i.width=800,i.height=n.videoHeight*u,i.getContext("2d").drawImage(n,0,0,i.width,i.height);const w=m=>{i.toBlob(s=>{s.size<=1e6||m<=.3?this.createImageFile(s,a):w(m-.1)},"image/jpeg",m)};w(.7),this.stream&&(this.stream.getTracks().forEach(m=>m.stop()),this.stream=null),e.style.display="none",t.style.display="block"})}createImageFile(t,e){const n=new File([t],"photo.jpg",{type:"image/jpeg",lastModified:Date.now()}),o=new DataTransfer;o.items.add(n),e.files=o.files,console.log("Ukuran file akhir:",(t.size/1024).toFixed(2),"KB")}initMap(){const t=L.map("map").setView([-6.1754,106.8272],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(t);let e=null;t.on("click",n=>{const{lat:o,lng:i}=n.latlng;e&&t.removeLayer(e),e=L.marker([o,i]).addTo(t),document.getElementById("lat").value=o,document.getElementById("lon").value=i})}}class ae{async render(){return`
      <section class="container">
        <h1>Favorite Stories</h1>
        <div class="favorites-container">
          <div id="favorites-list"></div>
        </div>
      </section>
    `}async afterRender(){const t=document.getElementById("favorites-list"),e=async()=>{const n=await C();if(!n||n.length===0){t.innerHTML=`
          <div class="empty-favorites">
            <p>You don't have any favorite stories yet.</p>
            <a href="#/" class="btn-primary">Browse Stories</a>
          </div>
        `;return}n.sort((o,i)=>i.favoriteTimestamp-o.favoriteTimestamp),t.innerHTML=n.map(o=>`
        <article class="favorite-story-card" data-id="${o.id}">
          <div class="favorite-story-content">
            <img src="${o.photoUrl}" alt="${o.description}" class="favorite-story-image">
            <div class="favorite-story-details">
              <h3>${o.name}</h3>
              <p>${o.description}</p>
              <div class="favorite-actions">
                <button class="remove-favorite" data-id="${o.id}">Remove from Favorites</button>
              </div>
            </div>
          </div>
          ${o.lat&&o.lon?`
            <div class="story-map" id="favorite-map-${o.id}" style="height: 200px;"></div>
          `:""}
        </article>
      `).join(""),document.querySelectorAll(".remove-favorite").forEach(o=>{o.addEventListener("click",async()=>{const i=o.dataset.id,a=document.querySelector(`.favorite-story-card[data-id="${i}"]`);a.classList.add("removing"),setTimeout(async()=>{await F(i),a.remove(),document.querySelectorAll(".favorite-story-card").length===0&&e()},300)})}),n.forEach(o=>{if(o.lat&&o.lon){const i=document.getElementById(`favorite-map-${o.id}`);if(i){const a=L.map(i).setView([o.lat,o.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(a),L.marker([o.lat,o.lon]).addTo(a).bindPopup(`<b>${o.name}</b><br>${o.description}`)}}})};e()}}async function se(r,t){const e=await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r,password:t})}),n=await e.json();if(!e.ok)throw new Error(n.message||"Login failed");return n.loginResult.token}async function ce(r,t,e){const n=await fetch("https://story-api.dicoding.dev/v1/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:r,email:t,password:e})}),o=await n.json();if(!n.ok)throw new Error(o.message||"Registration failed");return o}function le(){localStorage.removeItem("token"),window.location.hash="#/login"}class de{async render(){return`
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
    `}async afterRender(){const t=document.getElementById("loginForm"),e=document.getElementById("loginError");t.addEventListener("submit",async n=>{n.preventDefault();const o=document.getElementById("email").value,i=document.getElementById("password").value;try{const a=await se(o,i);localStorage.setItem("token",a),window.location.hash="#/"}catch(a){console.error("Login failed:",a),e.textContent=a.message||"Login failed. Please try again."}})}}class ue{async render(){return`
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
    `}async afterRender(){const t=document.getElementById("registerForm"),e=document.getElementById("registerError");t.addEventListener("submit",async n=>{n.preventDefault();const o=document.getElementById("name").value,i=document.getElementById("email").value,a=document.getElementById("password").value;try{await ce(o,i,a),alert("Registration successful! Please login."),window.location.hash="#/login"}catch(l){console.error("Registration failed:",l),e.textContent=l.message||"Registration failed. Please try again."}})}}const me={"/":new re,"/about":new ne,"/form":new ie,"/favorites":new ae,"/login":new de,"/register":new ue};function ge(r){const t=r.split("/");return{resource:t[1]||null,id:t[2]||null}}function pe(r){let t="";return r.resource&&(t=t.concat(`/${r.resource}`)),r.id&&(t=t.concat("/:id")),t||"/"}function fe(){return location.hash.replace("#","")||"/"}function he(){const r=fe(),t=ge(r);return pe(t)}var k,P,y,b,T,U,ye;class ve{constructor({navigationDrawer:t,drawerButton:e,content:n}){E(this,T);E(this,k,null);E(this,P,null);E(this,y,null);E(this,b,null);S(this,k,n),S(this,P,e),S(this,y,t),N(this,T,U).call(this)}async renderPage(){const t=he(),e=me[t];f(this,b)&&f(this,b).cleanup&&f(this,b).cleanup(),document.startViewTransition?await document.startViewTransition(async()=>{f(this,k).innerHTML=await e.render(),await e.afterRender(),S(this,b,e)}).ready:(f(this,k).innerHTML=await e.render(),await e.afterRender(),S(this,b,e))}}k=new WeakMap,P=new WeakMap,y=new WeakMap,b=new WeakMap,T=new WeakSet,U=function(){f(this,P).addEventListener("click",()=>{f(this,y).classList.toggle("open")}),document.body.addEventListener("click",t=>{!f(this,y).contains(t.target)&&!f(this,P).contains(t.target)&&f(this,y).classList.remove("open"),f(this,y).querySelectorAll("a").forEach(e=>{e.contains(t.target)&&f(this,y).classList.remove("open")})})},ye=async function(){const t=document.getElementById("logout-button");t&&t.addEventListener("click",()=>{le()})};document.addEventListener("DOMContentLoaded",async()=>{const r=new ve({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await r.renderPage(),window.addEventListener("hashchange",async()=>{await r.renderPage()})});const we=()=>{if(!("serviceWorker"in navigator))throw new Error("No Service Worker support!");if(!("PushManager"in window))throw new Error("No Push API Support!")},be=async()=>{try{const r=location.pathname.includes("github.io")?"/dicoding_web_intermidate_lastproject":"";return await navigator.serviceWorker.register(`${r}/sw.js`)}catch(r){throw console.error("Service worker registration failed:",r),r}},Ee=async()=>{try{const r=await window.Notification.requestPermission();return console.log(r!=="granted"?"Notification permission not granted":"Notification permission granted"),r}catch(r){throw console.error("Error requesting notification permission:",r),r}},Se=async()=>{try{we();const r=await be();console.log("Service Worker registered successfully");const t=await Ee();return{swRegistration:r,permission:t}}catch(r){return console.error("Push Notification setup error:",r),{error:r.message}}};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{Se().then(r=>{console.log("Push notification setup complete:",r)}).catch(r=>console.error("Push Notification Error:",r))},1e3)});
