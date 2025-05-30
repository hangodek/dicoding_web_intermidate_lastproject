var $=r=>{throw TypeError(r)};var I=(r,o,e)=>o.has(r)||$("Cannot "+e);var p=(r,o,e)=>(I(r,o,"read from private field"),e?e.call(r):o.get(r)),w=(r,o,e)=>o.has(r)?$("Cannot add the same private member more than once"):o instanceof WeakSet?o.add(r):o.set(r,e),b=(r,o,e,n)=>(I(r,o,"write to private field"),n?n.call(r,e):o.set(r,e),e),F=(r,o,e)=>(I(r,o,"access private method"),e);(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function e(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(t){if(t.ep)return;t.ep=!0;const a=e(t);fetch(t.href,a)}})();const C="modulepreload",V=function(r){return"/dicoding_web_intermidate_lastproject/"+r},D={},W=function(o,e,n){let t=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),m=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));t=Promise.allSettled(e.map(d=>{if(d=V(d),d in D)return;D[d]=!0;const f=d.endsWith(".css"),c=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${c}`))return;const l=document.createElement("link");if(l.rel=f?"stylesheet":C,f||(l.as="script"),l.crossOrigin="",l.href=d,m&&l.setAttribute("nonce",m),document.head.appendChild(l),f)return new Promise((u,i)=>{l.addEventListener("load",u),l.addEventListener("error",()=>i(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(s){const m=new Event("vite:preloadError",{cancelable:!0});if(m.payload=s,window.dispatchEvent(m),!m.defaultPrevented)throw s}return t.then(s=>{for(const m of s||[])m.status==="rejected"&&a(m.reason);return o().catch(a)})},z="StoryAppDB",H=1,E="stories",O=()=>new Promise((r,o)=>{const e=indexedDB.open(z,H);e.onupgradeneeded=n=>{const t=n.target.result;t.objectStoreNames.contains(E)||t.createObjectStore(E,{keyPath:"id"})},e.onsuccess=()=>r(e.result),e.onerror=()=>o(e.error)}),U=async r=>{const e=(await O()).transaction(E,"readwrite"),n=e.objectStore(E);return r.forEach(t=>n.put(t)),new Promise(t=>e.oncomplete=t)},j=async()=>{const e=(await O()).transaction(E,"readonly").objectStore(E);return new Promise(n=>{e.getAll().onsuccess=t=>n(t.target.result)})},G="StoryAppFavoritesDB",K=1,h="favoriteStories",B=()=>new Promise((r,o)=>{const e=indexedDB.open(G,K);e.onupgradeneeded=n=>{const t=n.target.result;t.objectStoreNames.contains(h)||t.createObjectStore(h,{keyPath:"id"})},e.onsuccess=()=>r(e.result),e.onerror=()=>o(e.error)}),M=async r=>{const e=(await B()).transaction(h,"readwrite"),n=e.objectStore(h),t={...r,favoriteTimestamp:new Date().getTime()};return n.put(t),new Promise(a=>{e.oncomplete=()=>a(!0),e.onerror=()=>a(!1)})},_=async()=>{const e=(await B()).transaction(h,"readonly").objectStore(h);return new Promise(n=>{e.getAll().onsuccess=t=>n(t.target.result)})},N=async r=>{const n=(await B()).transaction(h,"readonly").objectStore(h);return new Promise(t=>{n.get(r).onsuccess=a=>t(!!a.target.result)})},A=async r=>{const e=(await B()).transaction(h,"readwrite");return e.objectStore(h).delete(r),new Promise(t=>{e.oncomplete=()=>t(!0),e.onerror=()=>t(!1)})},J=Object.freeze(Object.defineProperty({__proto__:null,getFavoriteStories:_,isStoryFavorite:N,openFavoriteDB:B,removeStoryFromFavorites:A,saveStoryToFavorites:M},Symbol.toStringTag,{value:"Module"}));class Y{async render(){return`
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
    `}async afterRender(){async function o(c,l){const i=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:c,password:l})})).json();if(i.error)throw new Error(i.message);return i.loginResult.token}const e=document.querySelector(".skip-link"),n=document.getElementById("story-list"),t=document.getElementById("view-all-stories"),a=document.getElementById("view-favorite-stories");let s="all";e&&(e.addEventListener("click",c=>{c.preventDefault(),n.setAttribute("tabindex","0"),n.focus(),setTimeout(()=>n.setAttribute("tabindex","-1"),1e3)}),document.addEventListener("keydown",c=>{c.key==="Tab"&&!c.shiftKey&&document.activeElement===document.body&&(c.preventDefault(),e.focus())})),t.addEventListener("click",async()=>{t.classList.add("active"),a.classList.remove("active"),s="all";const c=localStorage.getItem("token"),l=await m(c);d(l)}),a.addEventListener("click",async()=>{t.classList.remove("active"),a.classList.add("active"),s="favorites";const{getFavoriteStories:c}=await W(async()=>{const{getFavoriteStories:u}=await Promise.resolve().then(()=>J);return{getFavoriteStories:u}},void 0),l=await c();d(l)});async function m(c){try{const u=await(await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${c}`}})).json();return await U(u.listStory),u.listStory}catch(l){return console.error("Gagal fetch dari API, fallback ke IndexedDB:",l),await j()}}async function d(c){if(!c||c.length===0){n.innerHTML=`
          <p class="empty-message">${s==="all"?"Tidak ada data. Coba nyalakan internet untuk sync.":"Belum ada cerita favorit yang disimpan."}</p>
        `;return}const l=await Promise.all(c.map(async i=>{const v=await N(i.id);return`
          <article class="story-card" tabindex="-1" data-id="${i.id}">
            <div class="favorite-btn-container">
              <button class="favorite-btn ${v?"favorited":""}" data-id="${i.id}">
                ${v?"❤️":"🤍"}
              </button>
            </div>
            <img src="${i.photoUrl}" alt="${i.description}">
            <h3>${i.name}</h3>
            <p>${i.description}</p>
            ${i.lat&&i.lon?`
              <div class="story-map" id="map-${i.id}" style="height: 200px;"></div>
            `:""}
          </article>
        `}));if(n.innerHTML=l.join(""),document.querySelectorAll(".favorite-btn").forEach(i=>{i.addEventListener("click",async function(){const v=this.dataset.id,P=document.querySelector(`.story-card[data-id="${v}"]`),x=c.find(q=>q.id===v);x&&(this.classList.contains("favorited")?(await A(v),this.classList.remove("favorited"),this.textContent="🤍",s==="favorites"&&(P.classList.add("removing"),setTimeout(()=>{P.remove(),document.querySelectorAll(".story-card").length===0&&(n.innerHTML='<p class="empty-message">Belum ada cerita favorit yang disimpan.</p>')},300))):(await M(x),this.classList.add("favorited"),this.textContent="❤️"))})}),c.forEach(i=>{if(i.lat&&i.lon){const v=document.getElementById(`map-${i.id}`);if(v){const P=L.map(v).setView([i.lat,i.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(P),L.marker([i.lat,i.lon]).addTo(P).bindPopup(`<b>${i.name}</b><br>${i.description}`)}}}),document.activeElement===e){const i=n.querySelector(".story-card");i&&(i.setAttribute("tabindex","0"),i.focus(),i.addEventListener("blur",()=>{i.setAttribute("tabindex","-1")},{once:!0}))}}async function f(){try{const u=await o("farhangodek123@gmail.com","12345678");localStorage.setItem("token",u);const i=await m(u);d(i)}catch(c){console.error("Error:",c);const l=await j();d(l)}}f()}}class Q{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class X{async render(){return`
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
    `}async afterRender(){this.initCamera(),this.initMap();const o=document.getElementById("story-form"),e=document.getElementById("photo");e.addEventListener("change",()=>{const n=e.files[0];n&&n.size>1e6&&(alert("Ukuran foto melebihi 1MB. Silakan pilih foto yang lebih kecil."),e.value="")}),o.addEventListener("submit",async n=>{n.preventDefault();const t=localStorage.getItem("token");if(!t){alert("Anda harus login terlebih dahulu.");return}const a=new FormData(o),s=a.get("photo");if(s&&s.size>1e6){alert("Ukuran foto melebihi batas 1MB. Silakan kompres terlebih dahulu.");return}try{const d=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${t}`},body:a})).json();if(d.error)throw new Error(d.message);alert("Story berhasil ditambahkan!");try{if("serviceWorker"in navigator&&"PushManager"in window&&await Notification.requestPermission()==="granted"){const c=await navigator.serviceWorker.ready;await this.triggerNotification(c,a.get("description"))}}catch(f){console.error("Error sending notification:",f)}window.location.hash="#/"}catch(m){console.error("Gagal menambahkan story:",m.message),alert("Gagal menambahkan story. Silakan coba lagi.")}})}async triggerNotification(o,e){const n="Story Added Successfully",t={body:e.length>50?e.substring(0,50)+"...":e,icon:"/favicon.png",badge:"/favicon-16x16.png",vibrate:[100,50,100],data:{url:"/#/"}};await o.showNotification(n,t)}cleanup(){if(this.stream){this.stream.getTracks().forEach(n=>n.stop()),this.stream=null;const o=document.getElementById("camera-preview"),e=document.getElementById("open-camera-btn");o&&(o.style.display="none"),e&&(e.style.display="block")}}initCamera(){const o=document.getElementById("open-camera-btn"),e=document.getElementById("camera-preview"),n=document.getElementById("camera-stream"),t=document.getElementById("capture-btn"),a=document.getElementById("photo-canvas"),s=document.getElementById("photo");o.addEventListener("click",async()=>{try{this.stream=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720,facingMode:"environment"}}),n.srcObject=this.stream,e.style.display="block",o.style.display="none"}catch(m){console.error("Gagal mengakses kamera:",m);try{this.stream=await navigator.mediaDevices.getUserMedia({video:!0}),n.srcObject=this.stream,e.style.display="block",o.style.display="none"}catch(d){console.error("Fallback kamera gagal:",d),alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.")}}}),t.addEventListener("click",()=>{const d=800/n.videoWidth;a.width=800,a.height=n.videoHeight*d,a.getContext("2d").drawImage(n,0,0,a.width,a.height);const c=l=>{a.toBlob(u=>{u.size<=1e6||l<=.3?this.createImageFile(u,s):c(l-.1)},"image/jpeg",l)};c(.7),this.stream&&(this.stream.getTracks().forEach(l=>l.stop()),this.stream=null),e.style.display="none",o.style.display="block"})}createImageFile(o,e){const n=new File([o],"photo.jpg",{type:"image/jpeg",lastModified:Date.now()}),t=new DataTransfer;t.items.add(n),e.files=t.files,console.log("Ukuran file akhir:",(o.size/1024).toFixed(2),"KB")}initMap(){const o=L.map("map").setView([-6.1754,106.8272],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(o);let e=null;o.on("click",n=>{const{lat:t,lng:a}=n.latlng;e&&o.removeLayer(e),e=L.marker([t,a]).addTo(o),document.getElementById("lat").value=t,document.getElementById("lon").value=a})}}class Z{async render(){return`
      <section class="container">
        <h1>Favorite Stories</h1>
        <div class="favorites-container">
          <div id="favorites-list"></div>
        </div>
      </section>
    `}async afterRender(){const o=document.getElementById("favorites-list"),e=async()=>{const n=await _();if(!n||n.length===0){o.innerHTML=`
          <div class="empty-favorites">
            <p>You don't have any favorite stories yet.</p>
            <a href="#/" class="btn-primary">Browse Stories</a>
          </div>
        `;return}n.sort((t,a)=>a.favoriteTimestamp-t.favoriteTimestamp),o.innerHTML=n.map(t=>`
        <article class="favorite-story-card" data-id="${t.id}">
          <div class="favorite-story-content">
            <img src="${t.photoUrl}" alt="${t.description}" class="favorite-story-image">
            <div class="favorite-story-details">
              <h3>${t.name}</h3>
              <p>${t.description}</p>
              <div class="favorite-actions">
                <button class="remove-favorite" data-id="${t.id}">Remove from Favorites</button>
              </div>
            </div>
          </div>
          ${t.lat&&t.lon?`
            <div class="story-map" id="favorite-map-${t.id}" style="height: 200px;"></div>
          `:""}
        </article>
      `).join(""),document.querySelectorAll(".remove-favorite").forEach(t=>{t.addEventListener("click",async()=>{const a=t.dataset.id,s=document.querySelector(`.favorite-story-card[data-id="${a}"]`);s.classList.add("removing"),setTimeout(async()=>{await A(a),s.remove(),document.querySelectorAll(".favorite-story-card").length===0&&e()},300)})}),n.forEach(t=>{if(t.lat&&t.lon){const a=document.getElementById(`favorite-map-${t.id}`);if(a){const s=L.map(a).setView([t.lat,t.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(s),L.marker([t.lat,t.lon]).addTo(s).bindPopup(`<b>${t.name}</b><br>${t.description}`)}}})};e()}}const ee={"/":new Y,"/about":new Q,"/form":new X,"/favorites":new Z};function te(r){const o=r.split("/");return{resource:o[1]||null,id:o[2]||null}}function oe(r){let o="";return r.resource&&(o=o.concat(`/${r.resource}`)),r.id&&(o=o.concat("/:id")),o||"/"}function re(){return location.hash.replace("#","")||"/"}function ne(){const r=re(),o=te(r);return oe(o)}var S,k,g,y,T,R;class ae{constructor({navigationDrawer:o,drawerButton:e,content:n}){w(this,T);w(this,S,null);w(this,k,null);w(this,g,null);w(this,y,null);b(this,S,n),b(this,k,e),b(this,g,o),F(this,T,R).call(this)}async renderPage(){const o=ne(),e=ee[o];p(this,y)&&p(this,y).cleanup&&p(this,y).cleanup(),document.startViewTransition?await document.startViewTransition(async()=>{p(this,S).innerHTML=await e.render(),await e.afterRender(),b(this,y,e)}).ready:(p(this,S).innerHTML=await e.render(),await e.afterRender(),b(this,y,e))}}S=new WeakMap,k=new WeakMap,g=new WeakMap,y=new WeakMap,T=new WeakSet,R=function(){p(this,k).addEventListener("click",()=>{p(this,g).classList.toggle("open")}),document.body.addEventListener("click",o=>{!p(this,g).contains(o.target)&&!p(this,k).contains(o.target)&&p(this,g).classList.remove("open"),p(this,g).querySelectorAll("a").forEach(e=>{e.contains(o.target)&&p(this,g).classList.remove("open")})})};document.addEventListener("DOMContentLoaded",async()=>{const r=new ae({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await r.renderPage(),window.addEventListener("hashchange",async()=>{await r.renderPage()})});const ie=()=>{if(!("serviceWorker"in navigator))throw new Error("No Service Worker support!");if(!("PushManager"in window))throw new Error("No Push API Support!")},se=async()=>{try{const r=location.pathname.includes("github.io")?"/dicoding_web_intermidate_lastproject":"";return await navigator.serviceWorker.register(`${r}/sw.js`)}catch(r){throw console.error("Service worker registration failed:",r),r}},ce=async()=>{try{const r=await window.Notification.requestPermission();return console.log(r!=="granted"?"Notification permission not granted":"Notification permission granted"),r}catch(r){throw console.error("Error requesting notification permission:",r),r}},le=async()=>{try{ie();const r=await se();console.log("Service Worker registered successfully");const o=await ce();return{swRegistration:r,permission:o}}catch(r){return console.error("Push Notification setup error:",r),{error:r.message}}};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{le().then(r=>{console.log("Push notification setup complete:",r)}).catch(r=>console.error("Push Notification Error:",r))},1e3)});
