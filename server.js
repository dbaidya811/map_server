const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public')); 
app.use(express.json());

// IMPORTANT: Allow the frontend to view the images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

const IMAGE_DIR = path.join(__dirname, 'images');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
        cb(null, IMAGE_DIR);
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, Date.now() + '_' + cleanName);
    }
});
const upload = multer({ storage: storage }).array('images', 15); 

app.get('/get-json-files', (req, res) => {
    try {
        const files = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.json') && file !== 'package.json' && file !== 'package-lock.json');
        res.json({ success: true, files });
    } catch (err) {
        res.json({ success: false, files: [] });
    }
});

app.get('/get-file-data', (req, res) => {
    const filename = req.query.filename;
    if (!filename) return res.json({ success: false, data: [] });
    
    const filePath = path.join(__dirname, filename);
    if (fs.existsSync(filePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.json({ success: true, data });
        } catch (err) {
            res.json({ success: false, data: [] });
        }
    } else {
        res.json({ success: false, data: [] });
    }
});

// API to Delete an entry AND its physical images
app.post('/delete-data', (req, res) => {
    const { filename, index } = req.body;
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        try {
            let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // 1. Find the entry we are deleting
            const itemToDelete = data[index];
            
            // 2. Delete the physical image files from the system
            if (itemToDelete && itemToDelete.local_images) {
                itemToDelete.local_images.forEach(imgPath => {
                    const fullImagePath = path.join(__dirname, imgPath);
                    if (fs.existsSync(fullImagePath)) {
                        fs.unlinkSync(fullImagePath); // Deletes the file permanently
                    }
                });
            }

            // 3. Remove from JSON and save
            data.splice(index, 1); 
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
            
            res.json({ success: true, message: 'Entry and images deleted successfully!' });
        } catch (e) {
            res.json({ success: false, message: 'Error updating file!' });
        }
    } else {
        res.json({ success: false, message: 'File not found!' });
    }
});

app.post('/save-data', (req, res) => {
    upload(req, res, function (err) {
        if (err) return res.status(500).json({ success: false, message: 'Image upload failed!' });

        const { filename, name, link, lat, lon, description, editIndex } = req.body;
        
        if (!filename) return res.status(400).json({ success: false, message: 'Filename is missing!' });

        let jsonFileName = filename.trim().replace(/[^a-zA-Z0-9_.-]/g, '_');
        if (!jsonFileName.endsWith('.json')) jsonFileName += '.json';
        const JSON_FILE_PATH = path.join(__dirname, jsonFileName);

        let newImagePaths = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                newImagePaths.push(`images/${file.filename}`);
            });
        }

        let allData = [];
        if (fs.existsSync(JSON_FILE_PATH)) {
            try {
                const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf8');
                if (fileContent.trim()) allData = JSON.parse(fileContent);
            } catch (e) {
                console.error("Error reading JSON");
            }
        }

        const isEditing = editIndex !== undefined && editIndex !== "" && parseInt(editIndex) >= 0;

        if (isEditing) {
            const idx = parseInt(editIndex);
            if (allData[idx]) {
                allData[idx].name = name || allData[idx].name;
                allData[idx].description = description || allData[idx].description;
                allData[idx].latitude = parseFloat(lat) || allData[idx].latitude;
                allData[idx].longitude = parseFloat(lon) || allData[idx].longitude;
                allData[idx].source_url = link || allData[idx].source_url;
                
                if (newImagePaths.length > 0) {
                    allData[idx].local_images = (allData[idx].local_images || []).concat(newImagePaths);
                }
            }
        } else {
            allData.push({
                name: name || `Pandal_${Date.now()}`,
                description: description || "No description provided",
                latitude: parseFloat(lat) || null,
                longitude: parseFloat(lon) || null,
                source_url: link,
                local_images: newImagePaths,
                added_on: new Date().toISOString()
            });
        }

        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(allData, null, 4), 'utf8');
        res.json({ success: true, message: isEditing ? 'Entry updated successfully!' : `Data saved to ${jsonFileName}!` });
    });
});

app.listen(3000, () => {
    console.log('\n=============================================');
    console.log(' Dashboard Server is running!');
    console.log(' Open this link in your browser: http://localhost:3000');
    console.log('=============================================\n');
});