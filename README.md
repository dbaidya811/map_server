# 🗺️ Map Data & Image Manager (Pandal Dashboard)

A lightweight, local Node.js dashboard designed to easily manage, store, and edit Google Maps location data. This tool allows you to extract coordinates from Google Maps links, upload multiple images, and save everything into perfectly structured JSON files.

Once pushed to GitHub, this repository acts as a **Free API and CDN**, allowing your frontend application to fetch live data and images without needing a separate backend database!

---

## ✨ Features
* **Auto-Extract Coordinates:** Paste any Google Maps link, and the system automatically extracts the exact Latitude and Longitude.
* **Multiple Image Uploads:** Supports drag-and-drop for uploading up to 15 images at once.
* **Unique IDs:** Automatically generates a unique ID for every location entry.
* **Full CRUD Operations:** Add, view, edit, and delete data directly from the UI.
* **Free GitHub API:** Serve your JSON data and images directly to any frontend application.

---

## 🚀 Local Installation & Setup

1. **Clone or Download** this repository to your local machine.
2. **Open Terminal** inside the project folder (`map_server`).
3. **Install Dependencies:**
   ```bash
   npm install express multer

```

4. **Start the Server:**
```bash
npm start

```


*(Note: If `npm start` doesn't work, you can also run `node server.js`)*
5. **Open Dashboard:** Open your browser and go to `http://localhost:3000`

---

## 🌐 Using GitHub as a Free API & CDN

Once you add data via the local dashboard and push this project to GitHub, you can fetch the JSON data and images directly into your live frontend website using GitHub's Raw URLs.

### API Endpoints

* **JSON Data URL:** `https://raw.githubusercontent.com/dbaidya811/map_server/refs/heads/main/Must-visit.json` *(Replace Must-visit.json with your actual file name if different)*
* **Image Base URL:** `https://raw.githubusercontent.com/dbaidya811/map_server/refs/heads/main/`

### Example Fetch Code (JavaScript)

Use this code in your frontend HTML/JS to fetch the data and display the images dynamically. It automatically combines the base URL with the image paths saved in your JSON.

```javascript
// 1. Define the API URLs
const githubJsonUrl = 'https://raw.githubusercontent.com/dbaidya811/map_server/refs/heads/main/Must-visit.json';
const githubBaseUrl = 'https://raw.githubusercontent.com/dbaidya811/map_server/refs/heads/main/';

async function displayDataFromGitHub() {
    try {
        // 2. Fetch the JSON file from GitHub
        const response = await fetch(githubJsonUrl);
        if (!response.ok) throw new Error("Failed to fetch data!");
        
        const data = await response.json();
        console.log(`Loaded ${data.length} locations from database.`);

        // 3. Loop through the data
        data.forEach(pandal => {
            console.log("Name:", pandal.name);
            console.log("ID:", pandal.id);
            console.log("Latitude:", pandal.latitude);
            console.log("Longitude:", pandal.longitude);
            
            // 4. Check if this entry has any attached images
            if (pandal.local_images && pandal.local_images.length > 0) {
                pandal.local_images.forEach(imagePath => {
                    
                    // 5. Combine Base URL + image path to get the live image link
                    const liveImageUrl = githubBaseUrl + imagePath;
                    console.log("Live Image URL:", liveImageUrl);
                    
                    /* =========================================
                       Example: How to render it in your HTML UI
                       =========================================
                       const img = document.createElement('img');
                       img.src = liveImageUrl;
                       img.style.width = '200px';
                       document.body.appendChild(img);
                    */
                });
            }
            console.log("-----------------------------------");
        });
    } catch (error) {
        console.error("Error loading data from GitHub API:", error);
    }
}

// Run the function
displayDataFromGitHub();

```

---

## ⚠️ Important Notes

* Always use the **Dashboard UI** to delete entries. If you manually delete an image file from the `images` folder without removing it from the JSON file, your frontend might show a broken image link.
* Remember to push your changes to GitHub after adding new locations so your live API updates!
```bash
git add .
git commit -m "Added new map data"
git push

```
