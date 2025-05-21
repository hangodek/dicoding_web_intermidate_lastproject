var S=n=>{throw TypeError(n)};var k=(n,e,t)=>e.has(n)||S("Cannot "+t);var c=(n,e,t)=>(k(n,e,"read from private field"),t?t.call(n):e.get(n)),h=(n,e,t)=>e.has(n)?S("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,t),g=(n,e,t,o)=>(k(n,e,"write to private field"),o?o.call(n,t):e.set(n,t),t),B=(n,e,t)=>(k(n,e,"access private method"),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const A="StoryAppDB",T=1,w="stories",I=()=>new Promise((n,e)=>{const t=indexedDB.open(A,T);t.onupgradeneeded=o=>{const r=o.target.result;r.objectStoreNames.contains(w)||r.createObjectStore(w,{keyPath:"id"})},t.onsuccess=()=>n(t.result),t.onerror=()=>e(t.error)}),D=async n=>{const t=(await I()).transaction(w,"readwrite"),o=t.objectStore(w);return n.forEach(r=>o.put(r)),new Promise(r=>t.oncomplete=r)},P=async()=>{const t=(await I()).transaction(w,"readonly").objectStore(w);return new Promise(o=>{t.getAll().onsuccess=r=>o(r.target.result)})};class M{async render(){return`
      <a href="#main-content" class="skip-link" tabindex="0">Skip to Content</a>
      <section class="container">
        <div class="top-section">
          <h1>Home Page</h1>
          <div class="new-story-btn"><a href="#/form">Add new story</a></div>
        </div>
        <div id="story-list" tabindex="-1"></div>
      </section>
    `}async afterRender(){async function e(s,a){const d=await(await fetch("https://story-api.dicoding.dev/v1/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:s,password:a})})).json();if(d.error)throw new Error(d.message);return d.loginResult.token}const t=document.querySelector(".skip-link"),o=document.getElementById("story-list");document.getElementById("main-content"),t&&(t.addEventListener("click",s=>{s.preventDefault(),o.setAttribute("tabindex","0"),o.focus(),setTimeout(()=>o.setAttribute("tabindex","-1"),1e3)}),document.addEventListener("keydown",s=>{s.key==="Tab"&&!s.shiftKey&&document.activeElement===document.body&&(s.preventDefault(),t.focus())}));async function r(s){try{const m=await(await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${s}`}})).json();return await D(m.listStory),m.listStory}catch(a){return console.error("Gagal fetch dari API, fallback ke IndexedDB:",a),await P()}}function i(s){if(!s||s.length===0){o.innerHTML=`
          <p class="empty-message">Tidak ada data. Coba nyalakan internet untuk sync.</p>
        `;return}if(o.innerHTML=s.map(a=>`
          <article class="story-card" tabindex="-1">
            <img src="${a.photoUrl}" alt="${a.description}">
            <h3>${a.name}</h3>
            <p>${a.description}</p>
            ${a.lat&&a.lon?`
              <div class="story-map" id="map-${a.id}" style="height: 200px;"></div>
            `:""}
          </article>
        `).join(""),s.forEach(a=>{if(a.lat&&a.lon){const m=document.getElementById(`map-${a.id}`);if(m){const d=L.map(m).setView([a.lat,a.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(d),L.marker([a.lat,a.lon]).addTo(d).bindPopup(`<b>${a.name}</b><br>${a.description}`)}}}),document.activeElement===t){const a=o.querySelector(".story-card");a&&(a.setAttribute("tabindex","0"),a.focus(),a.addEventListener("blur",()=>{a.setAttribute("tabindex","-1")},{once:!0}))}}async function l(){try{const m=await e("farhangodek123@gmail.com","12345678");localStorage.setItem("token",m);const d=await r(m);i(d)}catch(s){console.error("Error:",s);const a=await P();i(a)}}l()}}class O{async render(){return`
      <section class="container">
        <h1>About Page</h1>
      </section>
    `}async afterRender(){}}class j{async render(){return`
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
    `}async afterRender(){this.initCamera(),this.initMap();const e=document.getElementById("story-form"),t=document.getElementById("photo");t.addEventListener("change",()=>{const o=t.files[0];o&&o.size>1e6&&(alert("Ukuran foto melebihi 1MB. Silakan pilih foto yang lebih kecil."),t.value="")}),e.addEventListener("submit",async o=>{o.preventDefault();const r=localStorage.getItem("token");if(!r){alert("Anda harus login terlebih dahulu.");return}const i=new FormData(e),l=i.get("photo");if(l&&l.size>1e6){alert("Ukuran foto melebihi batas 1MB. Silakan kompres terlebih dahulu.");return}try{const a=await(await fetch("https://story-api.dicoding.dev/v1/stories",{method:"POST",headers:{Authorization:`Bearer ${r}`},body:i})).json();if(a.error)throw new Error(a.message);alert("Story berhasil ditambahkan!"),window.location.hash="#/"}catch(s){console.error("Gagal menambahkan story:",s.message),alert("Gagal menambahkan story. Silakan coba lagi.")}})}cleanup(){if(this.stream){this.stream.getTracks().forEach(o=>o.stop()),this.stream=null;const e=document.getElementById("camera-preview"),t=document.getElementById("open-camera-btn");e&&(e.style.display="none"),t&&(t.style.display="block")}}initCamera(){const e=document.getElementById("open-camera-btn"),t=document.getElementById("camera-preview"),o=document.getElementById("camera-stream"),r=document.getElementById("capture-btn"),i=document.getElementById("photo-canvas"),l=document.getElementById("photo");e.addEventListener("click",async()=>{try{this.stream=await navigator.mediaDevices.getUserMedia({video:{width:1280,height:720,facingMode:"environment"}}),o.srcObject=this.stream,t.style.display="block",e.style.display="none"}catch(s){console.error("Gagal mengakses kamera:",s);try{this.stream=await navigator.mediaDevices.getUserMedia({video:!0}),o.srcObject=this.stream,t.style.display="block",e.style.display="none"}catch(a){console.error("Fallback kamera gagal:",a),alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.")}}}),r.addEventListener("click",()=>{const a=800/o.videoWidth;i.width=800,i.height=o.videoHeight*a,i.getContext("2d").drawImage(o,0,0,i.width,i.height);const d=b=>{i.toBlob(E=>{E.size<=1e6||b<=.3?this.createImageFile(E,l):d(b-.1)},"image/jpeg",b)};d(.7),this.stream&&(this.stream.getTracks().forEach(b=>b.stop()),this.stream=null),t.style.display="none",e.style.display="block"})}createImageFile(e,t){const o=new File([e],"photo.jpg",{type:"image/jpeg",lastModified:Date.now()}),r=new DataTransfer;r.items.add(o),t.files=r.files,console.log("Ukuran file akhir:",(e.size/1024).toFixed(2),"KB")}initMap(){const e=L.map("map").setView([-6.1754,106.8272],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(e);let t=null;e.on("click",o=>{const{lat:r,lng:i}=o.latlng;t&&e.removeLayer(t),t=L.marker([r,i]).addTo(e),document.getElementById("lat").value=r,document.getElementById("lon").value=i})}}const N={"/":new M,"/about":new O,"/form":new j};function F(n){const e=n.split("/");return{resource:e[1]||null,id:e[2]||null}}function R(n){let e="";return n.resource&&(e=e.concat(`/${n.resource}`)),n.id&&(e=e.concat("/:id")),e||"/"}function $(){return location.hash.replace("#","")||"/"}function C(){const n=$(),e=F(n);return R(e)}var f,y,u,p,v,x;class q{constructor({navigationDrawer:e,drawerButton:t,content:o}){h(this,v);h(this,f,null);h(this,y,null);h(this,u,null);h(this,p,null);g(this,f,o),g(this,y,t),g(this,u,e),B(this,v,x).call(this)}async renderPage(){const e=C(),t=N[e];c(this,p)&&c(this,p).cleanup&&c(this,p).cleanup(),document.startViewTransition?await document.startViewTransition(async()=>{c(this,f).innerHTML=await t.render(),await t.afterRender(),g(this,p,t)}).ready:(c(this,f).innerHTML=await t.render(),await t.afterRender(),g(this,p,t))}}f=new WeakMap,y=new WeakMap,u=new WeakMap,p=new WeakMap,v=new WeakSet,x=function(){c(this,y).addEventListener("click",()=>{c(this,u).classList.toggle("open")}),document.body.addEventListener("click",e=>{!c(this,u).contains(e.target)&&!c(this,y).contains(e.target)&&c(this,u).classList.remove("open"),c(this,u).querySelectorAll("a").forEach(t=>{t.contains(e.target)&&c(this,u).classList.remove("open")})})};document.addEventListener("DOMContentLoaded",async()=>{const n=new q({content:document.querySelector("#main-content"),drawerButton:document.querySelector("#drawer-button"),navigationDrawer:document.querySelector("#navigation-drawer")});await n.renderPage(),window.addEventListener("hashchange",async()=>{await n.renderPage()})});const z=()=>{if(!("serviceWorker"in navigator))throw new Error("No Service Worker support!");if(!("PushManager"in window))throw new Error("No Push API Support!")},W=async()=>await navigator.serviceWorker.register("/dicoding_web_intermidate_lastproject/sw.js"),H=async()=>{if(await window.Notification.requestPermission()!=="granted")throw new Error("Permission not granted for Notification")},U=async()=>{z(),await H(),await W()};document.addEventListener("DOMContentLoaded",()=>{U().catch(n=>console.error("Push Notification Error:",n))});
