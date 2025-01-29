import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import multer from 'multer';

const app = express();
const PORT = 5000;

const IMG_PATH = "server/images/prizes-images/";
const ANNOUNCEMENT_IMG_PATH = "server/images/announcement/";

const IP = "localhost";

const prizeImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMG_PATH);
    },
    filename: (req, file, cb) => {
        const data = JSON.parse(req.body.data);
        const ext = path.extname(file.originalname);

        const index = data.imagesPaths.findIndex((img) => img.path === null) === 0
            ? req.files.length - 1
            : data.imagesPaths.findIndex((img) => img.path === null) + req.files.length - 1;
        cb(null, data.name.split(" ").join("") + "-" + data.imagesPaths[index].id + ext);
    },
});
const announcmentImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ANNOUNCEMENT_IMG_PATH);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = "announcement" + ext;
        cb(null, filename)
    }
});
const uploadPrizeImages = multer({ storage: prizeImagesStorage });
const uploadAnnouncementImage = multer({ storage: announcmentImageStorage });

// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin: `http://${IP}:5173`,
}));

// Get the path to siteData.json
const dataFilePath = path.resolve('server/data/siteData.json');
// Get the path to printsRequests.json
const printsRequestFilePath = path.resolve('server/data/printsRequests.json');

// Password verification for admin mode access
app.post('/api/verify-password', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        res.status(400).json({ message: "No password received!!" });
    }

    try {
        if (password === "@2633Ninjas") {
            console.log("I'm in");
            res.json({ success: true });
        } else {
            console.error("BOOOOO");
            res.status(400).json({ success: false, message: "Invalid password!!" });
        }
    } catch (error) {
        console.error("Error during password verification");
        res.status(500).json({ message: "An error occured during password verification" });
    }
});

// Route to fetch earn coins page data
app.get('/api/earnLoseCoins', async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData)
        res.json(jsonData.earnCoinsPageData);
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: 'Error reading data file' });
    }
});
// Route to update earn coins
app.put('/api/earnCoins', async (req, res) => {
    const newEarnCoins = req.body;

    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.earnCoinsPageData.earnCoins = newEarnCoins;

        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 4));

        res.json({ message: "Earn coins updated successfully.", earnCoins: newEarnCoins });
    } catch (error) {
        console.error('Error writing to file: ', error);
        res.status(500).json({ message: 'Error updating data file' })
    }
});
// Route to update lose coins
app.put('/api/loseCoins', async (req, res) => {
    const newLoseCoins = req.body;

    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.earnCoinsPageData.loseCoins = newLoseCoins;

        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 4));

        res.json({ message: "Lose coins updated successfully.", earnCoins: newLoseCoins });
    } catch (error) {
        console.error('Error writing to file: ', error);
        res.status(500).json({ message: 'Error updating data file' })
    }
});
// Announcement
app.post('/api/newAnnouncement', uploadAnnouncementImage.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No image file uploaded");
        }
        const jsonData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));
        jsonData.earnCoinsPageData.announcement.imagePath = req.file.filename;

        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

        res.status(200).json({ message: "Announcement image uploaded successfully" });
    } catch (error) {
        console.error("Error uploading announcement image:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.patch('/api/announcementVisibility', async (req, res) => {
    try {
        const jsonData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));
        console.log(req.body);
        jsonData.earnCoinsPageData.announcement.visible = req.body.visible;

        // Write to file
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

        // Respond with a success
        res.status(200).send("Updated announcement visibility successfully");
    } catch (error) {
        console.error("Error updating announcement visibility:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Game of the Month data
app.get('/api/gameOfTheMonth', async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        let leaderBoard = jsonData.gameOfTheMonthPageData.current.leaderBoard;

        // Sort leaderboard by score in descending order
        leaderBoard.sort((a, b) => b.score - a.score);

        if (leaderBoard.length > 10) {
            leaderBoard = leaderBoard.slice(0, 10);
        } else if (leaderBoard.length < 10) {
            const placeholders = Array(10 - leaderBoard.length).fill({
                firstName: null,
                lastInitial: null,
                score: 0,
            });
            leaderBoard = leaderBoard.concat(placeholders);
        }

        jsonData.gameOfTheMonthPageData.current.leaderBoard = leaderBoard;
        res.json(jsonData.gameOfTheMonthPageData);
    } catch (error) {
        console.error("Error reading file: ", error);
        res.status(500).json({ messasge: "Error reading data file" });
    }
});
app.post('/api/setNewGame', async(req, res) => {
    const {gameName, gameLink} = req.body;

    try {
        const jsonData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));
        
        // Keep only the top 10 on the leaderboard for the old game and add to the past list
        let oldGame = jsonData.gameOfTheMonthPageData.current;
        oldGame.leaderBoard = oldGame.leaderBoard.sort((a, b) => b.score - a.score).slice(0, 10);
        jsonData.gameOfTheMonthPageData.past.unshift(oldGame);

        // Add new current game and reset the leader board
        jsonData.gameOfTheMonthPageData.current = {
            gameName: gameName,
            gameLink: gameLink,
            leaderBoard: []
        }

        // Write to file
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

        // Response with a success
        res.status(200).send("Prize updated successfully");
    } catch (error) {
        console.error("Error reading file: ", error);
        res.status(500).json({message: "Error reading data file"});
    }
});
// Update leaderboard
app.post('/api/newScore', async (req, res) => {
    const {firstName, lastInitial, score} = req.body;

    try {
        const jsonData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));
        let leaderBoard = jsonData.gameOfTheMonthPageData.current.leaderBoard;
        const index = leaderBoard.findIndex((item) => item.firstName.toLowerCase() === firstName.toLowerCase() && item.lastInitial.toLowerCase() === lastInitial.toLowerCase());

        // Reformatting the first name and last name
        let formattedFirstName = firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
        let formattedLastInitial = lastInitial[0].toUpperCase() + lastInitial.slice(1).toLowerCase();

        if (index === -1) { // Adding a new person to the leaderboard
            leaderBoard.push({firstName: formattedFirstName, lastInitial: formattedLastInitial, score});
        } else { // Updating the score on the leaderboard
            leaderBoard[index].score = score;
        }

        // Update the leaderboard
        jsonData.gameOfTheMonthPageData.current.leaderBoard = leaderBoard;

        // Write to file
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

        // Response with a success
        res.status(200).send("Prize updated successfully");
    } catch (error) {
        console.error("Error reading file: ", error);
        res.status(500).json({message: "Error reading data file"});
    }
});

// Route to fetch prizes page data
app.get('/api/prizesList', async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData);

        res.json(jsonData.prizesPageData.prizesList);
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: 'Error reading data file' });
    }
});
app.get('/api/premiumPrizesList', async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData);
        
        res.json(jsonData.prizesPageData.premiumPrizesList);
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: 'Error reading data file' });
    }
});
app.get('/api/premiumPrizesNames', async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        const premiumPrizesNames = jsonData.prizesPageData.premiumPrizesList
            .filter(prize => prize.visible)
            .map(prize => ({ name: prize.name }));

        // console.log(premiumPrizesNames)

        res.json(premiumPrizesNames);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve premium prizes" });
    }
});

// Updating prizes or premium prizes
app.put('/api/prizesList', uploadPrizeImages.array("file"), async (req, res) => {
    const updatedPrizeData = JSON.parse(req.body.data);
    const imagesToDelete = JSON.parse(req.body.imagesToDelete);
    const premium = req.body.premium;

    // console.log("PREMIUM: ", premium);

    // console.log(req.body);
    // Adding new images
    let index = updatedPrizeData.imagesPaths.findIndex((img) => img.path === null);
    req.files.forEach(file => {
        updatedPrizeData.imagesPaths[index].path = file.filename;
        index++;
    });

    try {
        const jsonData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));

        if (premium === true || premium === "true") {
            // Find the premium prize's index
            let itemIndex = jsonData.prizesPageData.premiumPrizesList.findIndex(prize => prize.id === updatedPrizeData.id);
                
            // Validating the itemIndex
            if (itemIndex === -1) {
                throw new Error("Premium prize not found");
            }

            // Delete images
            imagesToDelete.forEach((id) => {
                fs.unlink(IMG_PATH + jsonData.prizesPageData.premiumPrizesList[itemIndex].imagesPaths.find((img) => img.id === id).path, (error) => {
                    if (error) {
                        console.error("Error removing image: ", error);
                        return;
                    }
                });
            });

            // Update the premium prizes list
            jsonData.prizesPageData.premiumPrizesList[itemIndex] = updatedPrizeData;


            // updatePremiumPrize(jsonData, updatedPrizeData, imagesToDelete);            
        } else {
            // Find the prize's index
            let itemIndex = jsonData.prizesPageData.prizesList.findIndex(prize => prize.id === updatedPrizeData.id);
                
            // Validating the itemIndex
            if (itemIndex === -1) {
                res.status(400).send("Prize not found");
            }

            // Delete images
            imagesToDelete.forEach((id) => {
                fs.unlink(IMG_PATH + jsonData.prizesPageData.prizesList[itemIndex].imagesPaths.find((img) => img.id === id).path, (error) => {
                    if (error) {
                        console.error("Error removing image: ", error);
                        return;
                    }
                });
            });

        // Update the prizes list
        jsonData.prizesPageData.prizesList[itemIndex] = updatedPrizeData;

            // console.log("yeet")
            // updatePrize(jsonData, updatedPrizeData, imagesToDelete);            
        }

        // Writing to file
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
        
        // Respond with a sucess
        res.status(200).send("Prize updated successfully");
    } catch (error) {
        console.error("Error updating prize:", error);
        res.status(500).send("Internal Server Error");
    }
});
// Adding new prizes or new premium prizes
app.post('/api/prizesList', uploadPrizeImages.array("file"), async (req, res) => {
    const newPrizeData = JSON.parse(req.body.data);
    const premium = JSON.parse(req.body.premium);

    // Adding images
    let index = 0;
    req.files.forEach(file => {
        newPrizeData.imagesPaths[index].path = file.filename;
        index++;
    });

    try {
        const jsonData = JSON.parse(await fs.readFile(dataFilePath, 'utf-8'));

        if (premium === true || premium === "true") {
            jsonData.prizesPageData.premiumPrizesList.push(newPrizeData);
        } else {
            jsonData.prizesPageData.prizesList.push(newPrizeData);
        }

        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));
    
        res.status(200).send("Prize added successfully");
    } catch (error) {
        console.error("Error adding prize:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.patch('/api/prizesList', async (req, res) => {
    const {premium, id, field, value} = req.body;
    if (premium === true || premium === "true") {
        try {
            const data = await fs.readFile(dataFilePath, 'utf-8');
            const jsonData = JSON.parse(data);
            const item = jsonData.prizesPageData.premiumPrizesList.find((prize) => prize.id === id);
            item[field] = value;

            // Write to file
            await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

            // Respond with a success
            res.status(200).send("Prize updated successfully");
        } catch (error) {
            console.error("Error patching prize:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        try {
            const data = await fs.readFile(dataFilePath, 'utf-8');
            const jsonData = JSON.parse(data);
            const item = jsonData.prizesPageData.prizesList.find((prize) => prize.id === id);
            item[field] = value;

            // Write to file
            await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

            // Respond with a success
            res.status(200).send("Prize updated successfully");
        } catch (error) {
            console.error("Error patching prize:", error);
            res.status(500).send("Internal Server Error");
        }
    }
});
app.delete('/api/prizesList', async (req, res) => {
    const {premium, id} = req.body;
    if (id === null) {
        return res.status(400).send("ID is required");
    }
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        const prizesList = premium === true || premium === "true" 
            ? jsonData.prizesPageData.premiumPrizesList
            : jsonData.prizesPageData.prizesList;
        const index = prizesList.findIndex((prize) => prize.id === id);

        // Deleting the photos
        prizesList[index].imagesPaths.forEach(img => {
            // console.log("WHY THO", IMG_PATH + img.path);
            fs.unlink(IMG_PATH + img.path, (error) => {
                if (error) {
                    console.log("Error removing image: ", error);
                    return;
                }
            });
            console.log("SUCCESSFULLY DELETED ALL IMAGES!!");
        });

        // Cannot find prize
        if (index === -1) {
            return res.status(404).send("Prize not found");
        }

        // Delete prize
        prizesList.splice(index, 1);

        // Write to file
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2));

        // Respond with a success
        res.status(200).send("Prize deleted successfully");
    } catch (error) {
        console.error("Error deleting prize:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to fetch available colors
app.get('/api/availableColors', async (req, res) => {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData)
        res.json(jsonData.prizesPageData.availableColors);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ message: 'Error reading data file' });
    }
});
// Route to update available colors
app.post('/api/availableColors', async (req, res) => {
    const { availableColors } = req.body;
    if (!Array.isArray(availableColors)) {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.prizesPageData.availableColors = availableColors;

        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ message: 'Error updating data file' });
    }
});
app.put('/api/availableColors', async (req, res) => {
    const newAvailableColors = req.body;

    // console.log(newAvailableColors)

    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        jsonData.prizesPageData.availableColors = newAvailableColors;

        await fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 4));

        res.json({ message: "Available colors updated successfully.", availableColors: newAvailableColors });
    } catch (error) {
        console.error('Error writing to file: ', error);
        res.status(500).json({ message: 'Error updating data file' })
    }
});

app.get('/api/printsQueue', async (req, res) => {
    try {
        const data = await fs.readFile(printsRequestFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData)
        res.json(jsonData.activeRequests);
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: 'Error reading data file' });
    }
});
app.get('/api/queueLength', async (req, res) => {
    try {
        const data = await fs.readFile(printsRequestFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // console.log(jsonData.activeRequests.filter((item) => typeof item.status === "number").length)
        res.json(jsonData.activeRequests.filter((item) => typeof item.status === "number").length + 1);
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: "Error reading data file" });
    }
});
app.patch('/api/updateStatus', async (req, res) => {
    try {
        const data = await fs.readFile(printsRequestFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        req.body.forEach((request) => {
            const item = jsonData.activeRequests.find((queueItem) => queueItem.id === request.id);
            item[request.field] = request.value;
        });

        await fs.writeFile(printsRequestFilePath, JSON.stringify(jsonData, null, 2));

        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: "Error reading data file" });
    }
});
app.post('/api/updateStatus', async (req, res) => {
    try {
        const data = await fs.readFile(printsRequestFilePath, 'utf-8');
        const jsonData = JSON.parse(data);

        // Find and remove from activeRequests
        const fulfilledRequest = jsonData.activeRequests.find((item) => item.id === req.body[0].id);
        const index = jsonData.activeRequests.findIndex((item) => item.id === fulfilledRequest.id);
        jsonData.activeRequests.splice(index, 1);

        // Update information and add to inactive list
        const time = new Date();
        fulfilledRequest.fulfilledDate = time.toLocaleString();
        fulfilledRequest.status = req.body[0].value;
        jsonData.inactiveRequests.push(fulfilledRequest);

        await fs.writeFile(printsRequestFilePath, JSON.stringify(jsonData, null, 3));

        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error("BOOO", error);
    }
});
app.post('/api/printsQueue', async (req, res) => {
    const newRequest = req.body;
    let idDatabase, data;

    // console.log("New Request Details: ", newRequest);

    try {
        data = JSON.parse(await fs.readFile(printsRequestFilePath, 'utf-8'));
        idDatabase = data.idTaken;
    } catch (error) {
        console.error("Error retreiving file: ", error);
    }

    // Generate a new, unique ID for the request
    let newId;
    do {
        newId = generateId();
    } while (idDatabase.some(record => record.id === newId));

    newRequest.id = newId;

    try {
        // Update the request status
        newRequest.status = "Received";

        // Update the date and time received
        const time = new Date();
        newRequest.receivedDate = time.toLocaleString();
        // console.log("After Processed: ", newRequest)

        data.activeRequests.push(newRequest);
        data.idTaken.push(newId);
        
        await fs.writeFile(printsRequestFilePath, JSON.stringify(data, null, 3));
    } catch (error) {
        console.error("BOOOO")
    }

    res.json({ id: newId });
});
function generateId() {
    const letters = String.fromCharCode(
        Math.floor(Math.random() * 26) + 65,
        Math.floor(Math.random() * 26) + 65
    );
    const numbers = Math.floor(Math.random() * 900) + 100; // Random 3-digit number
    return letters + numbers;
}
app.get("/api/pastOrders", async (req, res) => {
    const increment = req.query.increment;
    const chunkSize = 5;

    console.log(increment);

    try {
        const data = await fs.readFile(printsRequestFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        res.json({
            dataChunk: jsonData.inactiveRequests.slice((increment - 1) * chunkSize, increment * chunkSize),
            endOfList: increment * chunkSize >= jsonData.inactiveRequests.length
        });
    } catch (error) {
        console.error('Error reading file: ', error);
        res.status(500).json({ message: "Error reading data file" });
    }
});
app.post("/api/reopenOrder", async (req, res) => {
    try {
        const data = await fs.readFile(printsRequestFilePath, 'utf-8');
        const jsonData = JSON.parse(data);

        // Find and remove from inactiveRequests
        const reopenRequest = jsonData.inactiveRequests.find((item) => item.id === req.body.id);
        const index = jsonData.inactiveRequests.findIndex((item) => item.id === reopenRequest.id);
        jsonData.inactiveRequests.splice(index, 1);

        // Remove the fulfilled date
        delete reopenRequest["fulfilledDate"];
        // Change status to reopened
        reopenRequest.status = "Reopened";

        // Add to active list
        jsonData.activeRequests.push(reopenRequest);
        // console.log(reopenRequest);

        // // Update information and add to inactive list
        // const time = new Date();
        // fulfilledRequest.fulfilledDate = time.toLocaleString();
        // fulfilledRequest.status = req.body[0].value;
        // jsonData.inactiveRequests.push(fulfilledRequest);

        await fs.writeFile(printsRequestFilePath, JSON.stringify(jsonData, null, 3));
    } catch (error) {
        console.error("BOOO", error);
    }
})

app.use("/server/prizes-images/", express.static("server/images/prizes-images"));
app.use("/server/announcement/", express.static("server/images/announcement"));


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
});
