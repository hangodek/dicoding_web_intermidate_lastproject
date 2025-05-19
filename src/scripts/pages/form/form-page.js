export default class FormPage {
  async render() {
    return `
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
    `;
  }

  async afterRender() {
    this.initCamera();

    this.initMap();

    const form = document.getElementById("story-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Anda harus login terlebih dahulu.");
        return;
      }

      const formData = new FormData(form);

      try {
        const response = await fetch(
          "https://story-api.dicoding.dev/v1/stories",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        );

        const data = await response.json();
        if (data.error) {
          throw new Error(data.message);
        }

        alert("Story berhasil ditambahkan!");
        window.location.hash = "#/";
      } catch (error) {
        console.error("Gagal menambahkan story:", error.message);
        alert("Gagal menambahkan story. Silakan coba lagi.");
      }
    });
  }

  initCamera() {
    const openCameraBtn = document.getElementById("open-camera-btn");
    const cameraPreview = document.getElementById("camera-preview");
    const cameraStream = document.getElementById("camera-stream");
    const captureBtn = document.getElementById("capture-btn");
    const photoCanvas = document.getElementById("photo-canvas");
    const photoInput = document.getElementById("photo");

    let stream = null;

    openCameraBtn.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream.srcObject = stream;
        cameraPreview.style.display = "block";
        openCameraBtn.style.display = "none";
      } catch (error) {
        console.error("Gagal mengakses kamera:", error);
        alert("Gagal mengakses kamera. Pastikan Anda memberikan izin.");
      }
    });

    captureBtn.addEventListener("click", () => {
      const context = photoCanvas.getContext("2d");
      photoCanvas.width = cameraStream.videoWidth;
      photoCanvas.height = cameraStream.videoHeight;
      context.drawImage(
        cameraStream,
        0,
        0,
        photoCanvas.width,
        photoCanvas.height,
      );

      photoCanvas.toBlob((blob) => {
        const file = new File([blob], "photo.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;
      }, "image/png");

      stream.getTracks().forEach((track) => track.stop());
      cameraPreview.style.display = "none";
      openCameraBtn.style.display = "block";
    });
  }

  initMap() {
    const map = L.map("map").setView([-6.1754, 106.8272], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    let marker = null;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);

      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;
    });
  }
}
