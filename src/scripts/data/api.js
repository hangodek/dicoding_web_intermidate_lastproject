import CONFIG from "../config";

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/stories`,
};

export async function getData() {
  try {
    // Coba fetch data dari API
    const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
    const apiData = await fetchResponse.json();

    // Simpan ke IndexedDB
    await saveDataToIDB(apiData.listStories); // Sesuaikan dengan struktur respons API
    return apiData;

  } catch (error) {
    console.error('Failed to fetch from API, fallback to IndexedDB:', error);
    
    // Fallback: Ambil data dari IndexedDB
    const cachedData = await getDataFromIDB();
    return { listStories: cachedData || [] }; // Kembalikan format yang konsisten
  }
}

