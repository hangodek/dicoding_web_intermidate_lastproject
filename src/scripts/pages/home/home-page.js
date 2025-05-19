import { saveStoriesToIDB, getStoriesFromIDB } from '../../utils/idb';

export default class HomePage {
  async render() {
    return `
      <a href="#main-content" class="skip-link" tabindex="0">Skip to Content</a>
      <section class="container">
        <div class="top-section">
          <h1>Home Page</h1>
          <div class="new-story-btn"><a href="#/form">Add new story</a></div>
        </div>
        <div id="story-list" tabindex="-1"></div>
      </section>
    `;
  }

  async afterRender() {
    async function login(email, password) {
      const response = await fetch("https://story-api.dicoding.dev/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.message);
      }
      return data.loginResult.token;
    }

    const skipLink = document.querySelector(".skip-link");
    const storyList = document.getElementById("story-list");

    if (skipLink) {
      document.addEventListener("keydown", (event) => {
        if (event.key === "Tab" && !event.shiftKey) {
          const activeElement = document.activeElement;
          if (activeElement === document.body) {
            event.preventDefault();
            skipLink.focus();
          }
        }
      });

      skipLink.addEventListener("click", (event) => {
        event.preventDefault();
        storyList.focus();
      });
    }

     async function getStories(token) {
      try {
        // Coba fetch data dari API
        const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        // Simpan ke IndexedDB
        await saveStoriesToIDB(data.listStory);
        return data.listStory;

      } catch (error) {
        console.error("Gagal fetch dari API, fallback ke IndexedDB:", error);
        return await getStoriesFromIDB(); // Ambil data cached
      }
    }

    function renderStories(stories) {
      const storyList = document.getElementById("story-list");

      if (!stories || stories.length === 0) {
        document.getElementById('story-list').innerHTML = `
          <p class="empty-message">Tidak ada data. Coba nyalakan internet untuk sync.</p>
        `;
        return;
      }

      storyList.innerHTML = stories
        .map(
          (story) => `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="${story.description}">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <p>${story.lat}</p>
          <p>${story.lon}</p>
          <div class="story-map" id="map-${story.id}" style="height: 200px;"></div>
        </article>
      `,
        )
        .join("");

      const firstStory = storyList.querySelector(".story-card");
      if (firstStory) {
        firstStory.setAttribute("tabindex", "-1");
        firstStory.focus();
      }

      stories.forEach((story) => {
        const mapElement = document.getElementById(`map-${story.id}`);
        if (mapElement && story.lat && story.lon) {
          const map = L.map(mapElement).setView([story.lat, story.lon], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          const marker = L.marker([story.lat, story.lon]).addTo(map);

          marker.bindPopup(`
        <b>${story.name}</b><br>
        ${story.description}
      `);
        }
      });
    }

    async function main() {
      try {
        const email = "farhangodek123@gmail.com";
        const password = "12345678";
        const token = await login(email, password);
        localStorage.setItem("token", token);

        const stories = await getStories(token);
        renderStories(stories);

      } catch (error) {
        console.error("Error:", error);
        // Coba tampilkan data dari IndexedDB saat login gagal
        const cachedStories = await getStoriesFromIDB();
        renderStories(cachedStories);
      }
    }

    main();
  }
}