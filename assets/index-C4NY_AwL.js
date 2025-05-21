var S=n=>{throw TypeError(n)};var v=(n,e,t)=>e.has(n)||S("Cannot "+t);var d=(n,e,t)=>(v(n,e,"read from private field"),t?t.call(n):e.get(n)),h=(n,e,t)=>e.has(n)?S("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),g=(n,e,t,r)=>(v(n,e,"write to private field"),r?r.call(n,t):e.set(n,t),t),B=(n,e,t)=>(v(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const m of o.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&r(m)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();const D="StoryAppDB",A=1,w="stories",I=()=>new Promise((n,e)=>{const t=indexedDB.open(D,A);t.onupgradeneeded=r=>{const a=r.target.result;a.objectStoreNames.contains(w)||a.createObjectStore(w,{keyPath:"id"})},t.onsuccess=()=>n(t.result),t.onerror=()=>e(t.error)}),x=async n=>{const t=(await I()).transaction(w,"readwrite"),r=t.objectStore(w);return n.forEach(a=>r.put(a)),new Promise(a=>t.oncomplete=a)},P=async()=>{const t=(await I()).transaction(w,"readonly").objectStore(w);return new Promise(r=>{t.getAll().onsuccess=a=>r(a.target.result)})};class M{async render(){return`
      <a href="#main-content" class="skip-link" tabindex="0">Skip to Content</a>
      <section class="container">
        <div class="top-section">
          <h1>Home Page</h1>
          <div class="new-story-btn"><a href="#/form">Add new story</a></div>
        </div>
        <div id="story-list" tabindex="-1"></div>
      </section>
    `}async afterRender(){async function e(s,c){const i=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:c})})).json();if(i.error)throw new Error(i.message);return i.loginResult.token}const t=document.querySelector(".skip-link"),r=document.getElementById("story-list");t&&(document.addEventListener("keydown",s=>{s.key==="Tab"&&!s.shiftKey&&document.activeElement===document.body&&(s.preventDefault(),t.focus())}),t.addEventListener("click",s=>{s.preventDefault(),r.focus()}));async function a(s){try{const l=await(await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${s}`}})).json();return await x(l.listStory),l.listStory}catch(c){return console.error("Gagal fetch dari API, fallback ke IndexedDB:",c),await P()}}function o(s){const c=document.getElementById("story-list");if(!s||s.length===0){document.getElementById("story-list").innerHTML=`
          <p class="empty-message">Tidak ada data. Coba nyalakan internet untuk sync.</p>
        `;return}c.innerHTML=s.map(i=>`
        <article class="story-card">
          <img src="${i.photoUrl}" alt="${i.description}">
          <h3>${i.name}</h3>
          <p>${i.description}</p>
          <p>${i.lat}</p>
          <p>${i.lon}</p>
          <div class="story-map" id="map-${i.id}" style="height: 200px;"></div>
        </article>
      `).join("");const l=c.querySelector(".story-card");l&&(l.setAttribute("tabindex","-1"),l.focus()),s.forEach(i=>{const k=document.getElementById(`map-${i.id}`);if(k&&i.lat&&i.lon){const E=L.map(k).setView([i.lat,i.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(E),L.marker([i.lat,i.lon]).addTo(E).bindPopup(`
        <b>${i.name}</b><br>
        ${i.description}
      `)}})}async function m(){try{const l=await e("farhangodek123@gmail.com","12345678");localStorage.setItem("token",l);const i=await a(l);o(i)}catch(s){console.error("Error:",s);const c=await P();o(c)}}m()}}class O{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class N{async render(){return`
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
    `}async afterRender(){this.initCamera(),this.initMap();const e=document.getElementById("story-form");e.addEventListener("submit",async t=>{t.preventDefault();const r=localStorage.getItem("token");if(!r){alert("Anda harus login terlebih dahulu.");return}const a=new FormData(e);try{const m=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${r}`},body:a})).json();if(m.error)throw new Error(m.message);alert("Story berhasil ditambahkan!"),window.location.hash="#/"}catch(o){console.error("Gagal menambahkan story:",o.message),alert("Gagal menambahkan story. Silakan coba lagi.")}})}cleanup(){if(this.stream){this.stream.getTracks().forEach(r=>r.stop()),this.stream=null;const e=document.getElementById("camera-preview"),t=document.getElementById("open-camera-btn");e&&(e.style.display="none"),t&&(t.style.display="block")}}initCamera(){const e=document.getElementById("open-camera-btn"),t=document.getElementById("camera-preview"),r=document.getElementById("camera-stream"),a=document.getElementById("capture-btn"),o=document.getElementById("photo-canvas"),m=document.getElementById("photo");e.addEventListener("click",async()=>{try{this.stream=await navigator.mediaDevices.getUserMedia({video:!0}),r.srcObject=this.stream,t.style.display="block",e.style.display="none"}catch(s){console.error("Gagal mengakses kamera:",s),alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.")}}),a.addEventListener("click",()=>{const s=o.getContext("2d");o.width=r.videoWidth,o.height=r.videoHeight,s.drawImage(r,0,0,o.width,o.height),o.toBlob(c=>{const l=new File([c],"photo.png",{type:"image/png"}),i=new DataTransfer;i.items.add(l),m.files=i.files},"image/png"),this.stream&&(this.stream.getTracks().forEach(c=>c.stop()),this.stream=null),t.style.display="none",e.style.display="block"})}initMap(){const e=L.map("map").setView([-6.1754,106.8272],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(e);let t=null;e.on("click",r=>{const{lat:a,lng:o}=r.latlng;t&&e.removeLayer(t),t=L.marker([a,o]).addTo(e),document.getElementById("lat").value=a,document.getElementById("lon").value=o})}}const $={"/":new M,"/about":new O,"/form":new N};function j(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function q(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function R(){return location.hash.replace("#","")||"/"}function C(){const n=R(),e=j(n);return q(e)}var y,f,u,p,b,T;class F{constructor({navigationDrawer:e,drawerButton:t,content:r}){h(this,b);h(this,y,null);h(this,f,null);h(this,u,null);h(this,p,null);g(this,y,r),g(this,f,t),g(this,u,e),B(this,b,T).call(this)}async renderPage(){const e=C(),t=$[e];d(this,p)&&d(this,p).cleanup&&d(this,p).cleanup(),document.startViewTransition?await document.startViewTransition(async()=>{d(this,y).innerHTML=await t.render(),await t.afterRender(),g(this,p,t)}).ready:(d(this,y).innerHTML=await t.render(),await t.afterRender(),g(this,p,t))}}y=new WeakMap,f=new WeakMap,u=new WeakMap,p=new WeakMap,b=new WeakSet,T=function(){d(this,f).addEventListener("click",()=>{d(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!d(this,u).contains(e.target)&&!d(this,f).contains(e.target)&&d(this,u).classList.remove("open"),d(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&d(this,u).classList.remove("open")})})};document.addEventListener("DOMContentLoaded",async()=>{const n=new F({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()})});const H=()=>{if(!("serviceWorker"in navigator))throw new Error("No Service Worker support!");if(!("PushManager"in window))throw new Error("No Push API Support!")},_=async()=>await navigator.serviceWorker.register("/dicoding_web_intermidate_lastproject/sw.js"),z=async()=>{if(await window.Notification.requestPermission()!=="granted")throw new Error("Permission not granted for Notification")},G=async()=>{H(),await z(),await _()};document.addEventListener("DOMContentLoaded",()=>{G().catch(n=>console.error("Push Notification Error:",n))});
