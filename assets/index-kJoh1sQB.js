var E=n=>{throw TypeError(n)};var v=(n,e,t)=>e.has(n)||E("Cannot "+t);var m=(n,e,t)=>(v(n,e,"read from private field"),t?t.call(n):e.get(n)),f=(n,e,t)=>e.has(n)?E("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),w=(n,e,t,r)=>(v(n,e,"write to private field"),r?r.call(n,t):e.set(n,t),t),S=(n,e,t)=>(v(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();const T="StoryAppDB",D=1,g="stories",P=()=>new Promise((n,e)=>{const t=indexedDB.open(T,D);t.onupgradeneeded=r=>{const a=r.target.result;a.objectStoreNames.contains(g)||a.createObjectStore(g,{keyPath:"id"})},t.onsuccess=()=>n(t.result),t.onerror=()=>e(t.error)}),A=async n=>{const t=(await P()).transaction(g,"readwrite"),r=t.objectStore(g);return n.forEach(a=>r.put(a)),new Promise(a=>t.oncomplete=a)},B=async()=>{const t=(await P()).transaction(g,"readonly").objectStore(g);return new Promise(r=>{t.getAll().onsuccess=a=>r(a.target.result)})};class x{async render(){return`
      <a href="#main-content" class="skip-link" tabindex="0">Skip to Content</a>
      <section class="container">
        <div class="top-section">
          <h1>Home Page</h1>
          <div class="new-story-btn"><a href="#/form">Add new story</a></div>
        </div>
        <div id="story-list" tabindex="-1"></div>
      </section>
    `}async afterRender(){async function e(s,c){const i=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:c})})).json();if(i.error)throw new Error(i.message);return i.loginResult.token}const t=document.querySelector(".skip-link"),r=document.getElementById("story-list");t&&(document.addEventListener("keydown",s=>{s.key==="Tab"&&!s.shiftKey&&document.activeElement===document.body&&(s.preventDefault(),t.focus())}),t.addEventListener("click",s=>{s.preventDefault(),r.focus()}));async function a(s){try{const d=await(await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${s}`}})).json();return await A(d.listStory),d.listStory}catch(c){return console.error("Gagal fetch dari API, fallback ke IndexedDB:",c),await B()}}function o(s){const c=document.getElementById("story-list");if(!s||s.length===0){document.getElementById("story-list").innerHTML=`
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
      `).join("");const d=c.querySelector(".story-card");d&&(d.setAttribute("tabindex","-1"),d.focus()),s.forEach(i=>{const y=document.getElementById(`map-${i.id}`);if(y&&i.lat&&i.lon){const k=L.map(y).setView([i.lat,i.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(k),L.marker([i.lat,i.lon]).addTo(k).bindPopup(`
        <b>${i.name}</b><br>
        ${i.description}
      `)}})}async function l(){try{const d=await e("farhangodek123@gmail.com","12345678");localStorage.setItem("token",d);const i=await a(d);o(i)}catch(s){console.error("Error:",s);const c=await B();o(c)}}l()}}class M{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class O{async render(){return`
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
    `}async afterRender(){this.initCamera(),this.initMap();const e=document.getElementById("story-form");e.addEventListener("submit",async t=>{t.preventDefault();const r=localStorage.getItem("token");if(!r){alert("Anda harus login terlebih dahulu.");return}const a=new FormData(e);try{const l=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${r}`},body:a})).json();if(l.error)throw new Error(l.message);alert("Story berhasil ditambahkan!"),window.location.hash="#/"}catch(o){console.error("Gagal menambahkan story:",o.message),alert("Gagal menambahkan story. Silakan coba lagi.")}})}initCamera(){const e=document.getElementById("open-camera-btn"),t=document.getElementById("camera-preview"),r=document.getElementById("camera-stream"),a=document.getElementById("capture-btn"),o=document.getElementById("photo-canvas"),l=document.getElementById("photo");let s=null;e.addEventListener("click",async()=>{try{s=await navigator.mediaDevices.getUserMedia({video:!0}),r.srcObject=s,t.style.display="block",e.style.display="none"}catch(c){console.error("Gagal mengakses kamera:",c),alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.")}}),a.addEventListener("click",()=>{const c=o.getContext("2d");o.width=r.videoWidth,o.height=r.videoHeight,c.drawImage(r,0,0,o.width,o.height),o.toBlob(d=>{const i=new File([d],"photo.png",{type:"image/png"}),y=new DataTransfer;y.items.add(i),l.files=y.files},"image/png"),s.getTracks().forEach(d=>d.stop()),t.style.display="none",e.style.display="block"})}initMap(){const e=L.map("map").setView([-6.1754,106.8272],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(e);let t=null;e.on("click",r=>{const{lat:a,lng:o}=r.latlng;t&&e.removeLayer(t),t=L.marker([a,o]).addTo(e),document.getElementById("lat").value=a,document.getElementById("lon").value=o})}}const N={"/":new x,"/about":new M,"/form":new O};function $(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function q(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function R(){return location.hash.replace("#","")||"/"}function j(){const n=R(),e=$(n);return q(e)}var p,h,u,b,I;class C{constructor({navigationDrawer:e,drawerButton:t,content:r}){f(this,b);f(this,p,null);f(this,h,null);f(this,u,null);w(this,p,r),w(this,h,t),w(this,u,e),S(this,b,I).call(this)}async renderPage(){const e=j(),t=N[e];document.startViewTransition?await document.startViewTransition(async()=>{m(this,p).innerHTML=await t.render(),await t.afterRender()}).ready:(m(this,p).innerHTML=await t.render(),await t.afterRender())}}p=new WeakMap,h=new WeakMap,u=new WeakMap,b=new WeakSet,I=function(){m(this,h).addEventListener("click",()=>{m(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!m(this,u).contains(e.target)&&!m(this,h).contains(e.target)&&m(this,u).classList.remove("open"),m(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&m(this,u).classList.remove("open")})})};document.addEventListener("DOMContentLoaded",async()=>{const n=new C({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()})});const F=()=>{if(!("serviceWorker"in navigator))throw new Error("No Service Worker support!");if(!("PushManager"in window))throw new Error("No Push API Support!")},H=async()=>await navigator.serviceWorker.register("/sw.js"),z=async()=>{if(await window.Notification.requestPermission()!=="granted")throw new Error("Permission not granted for Notification")},G=async()=>{F(),await z(),await H()};document.addEventListener("DOMContentLoaded",()=>{G().catch(n=>console.error("Push Notification Error:",n))});
