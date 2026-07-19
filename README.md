# 🗺️ Map Data & Image Manager (Pandal Dashboard)

A lightweight, local Node.js dashboard designed to easily manage, store, and edit Google Maps location data. This tool allows you to extract coordinates from Google Maps links, upload multiple images via drag-and-drop, and save everything into perfectly structured JSON files.

## ✨ Features

* **Auto-Extract Coordinates:** Paste any Google Maps link, and the system automatically extracts the exact Latitude and Longitude.
* **Multiple Image Uploads:** Supports drag-and-drop for uploading up to 15 images at once (JPG, PNG, WEBP).
* **Dynamic JSON Management:** Create new JSON files directly from the dashboard or append data to existing ones.
* **Full CRUD Operations:**
  * **Create:** Add new locations with descriptions and images.
  * **Read:** View all saved locations in a clean data table.
  * **Update:** Edit existing entries and append new images.
  * **Delete:** Remove entries. (Automatically deletes the physical image files from your hard drive to save space).

## 📁 Folder Structure

Ensure your project folder looks exactly like this before running:

```text
map_server/
│
├── public/
│   └── index.html       # The frontend dashboard UI
│
├── images/              # Auto-created folder where uploaded images are saved
├── server.js            # The Node.js backend server
├── package.json         # Node.js dependencies
└── *.json               # Your generated data files (e.g., north_kolkata.json)
