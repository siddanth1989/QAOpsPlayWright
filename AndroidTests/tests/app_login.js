const { exec } = require('child_process');
const readline = require('readline'); // Node.js module for reading user input
const fs = require('fs'); // For creating directories

// --- Configuration Variables (UPDATE AS NEEDED) ---
const adbPath = 'D:\\Siddanth\\PlayWrightAutomation\\AndroidSDK\\platform-tools\\adb.exe';
const emulatorPath = 'D:\\Siddanth\\PlayWrightAutomation\\AndroidSDK\\emulator\\emulator.exe';
const avdName = 'test_device'; // Now using 'test_device'
const packageName = 'com.google.android.apps.nbu.paisa.user.qa';
const emulatorSerial = 'emulator-5554'; // IMPORTANT: Verify this is your emulator's serial from `adb devices`

// Timeouts (adjust if needed)
const emulatorKillGracePeriod = 5000; // Time to wait after killing emulator
const emulatorLaunchGracePeriod = 10000; // Time to wait after launch command before polling ADB
const emulatorReadyTimeout = 120000; // Max time to wait for emulator to be ready (2 minutes)
const pollingInterval = 3000; // How often to check for emulator readiness
const postReadyGracePeriod = 5000; // Grace period after emulator reports ready
const appLoadTimeout = 8000; // Time to wait after app launch
const uiUpdateTimeout = 3000; // Time to wait after UI interaction
const adbCommandTimeout = 30000; // Max timeout for individual ADB shell commands (30 seconds)
const adbMaxRetries = 5; // NEW: Max retries for ADB commands
const adbRetryDelay = 2000; // NEW: Delay between ADB retries

// --- Coordinates (THESE ARE ESTIMATES FROM VIDEO - YOU MUST UPDATE WITH UIAUTOMATORVIEWER) ---
// Please use uiautomatorviewer to get precise (X, Y) coordinates for your emulator.
// Calculate center_X = (left + right) / 2; center_Y = (top + bottom) / 2

// Initial Screen / Country Dropdown (Tap the "US" flag/dropdown)
const countryDropdownX = 850; // Estimated from video
const countryDropdownY = 100; // Estimated from video

// 'India' Option in Country List (Once the country list appears)
const indiaOptionX = 540; // Estimated from video (center X)
const indiaOptionY = 400; // Estimated from video (approx 20% down from top)

// Phone Number Input Field
const phoneNumberInputX = 540; // Estimated from video (center X)
const phoneNumberInputY = 700; // Estimated from video (approx 35% down from top)

// 'Next' Button (Bottom wide button)
const nextButtonX = 540; // Estimated from video (center X)
const nextButtonY = 1750; // Estimated from video (near bottom)

// OTP Input Field
const otpInputX = 540; // Estimated from video (center X)
const otpInputY = 700; // Estimated from video (approx 35% down from top)

// 'Verify' Button (Bottom wide button)
const verifyButtonX = 540; // Estimated from video (center X)
const verifyButtonY = 1750; // Estimated from video (near bottom)

// 'Show transaction history' text/button on Home Screen (after login)
const transactionHistoryButtonX = 540; // Estimated from video
const transactionHistoryButtonY = 1400; // Estimated from video

// --- Helper Functions ---

// Helper to prompt user for input in the terminal
function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Helper to execute ADB commands with retries
async function adbExec(command, timeout = adbCommandTimeout, retries = adbMaxRetries) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await new Promise((resolve, reject) => {
                exec(`"${adbPath}" -s ${emulatorSerial} ${command}`, { timeout: timeout }, (error, stdout, stderr) => {
                    if (error) {
                        const errorMessage = error.message;
                        // Specifically check for "device offline"
                        if (errorMessage.includes('device offline')) {
                            const retryMsg = `(Retry ${i + 1}/${retries}) Device offline for command: ${command}. Retrying...`;
                            console.warn(retryMsg);
                            return reject(new Error(retryMsg)); // Reject to trigger retry loop
                        }
                        // Check if it's a timeout error from exec
                        if (error.code === 'ETIMEDOUT' || error.killed) {
                            console.error(`ADB Command timed out: ${command}`);
                            return reject(new Error(`ADB Command timed out: ${command}`));
                        }
                        // Generic command failed
                        console.error(`ADB Command failed: ${command}\nError: ${errorMessage}\nStderr: ${stderr.trim()}`);
                        return reject(new Error(`ADB Command failed: ${command}`));
                    }
                    console.log(`ADB Command success: ${command}\nStdout: ${stdout.trim()}\nStderr: ${stderr.trim()}`);
                    resolve(stdout);
                });
            });
        } catch (e) {
            if (e.message.includes('Device offline') && i < retries) {
                await new Promise(resolve => setTimeout(resolve, adbRetryDelay)); // Wait before retrying
                continue; // Retry the loop
            }
            throw e; // Re-throw if not a retryable error or out of retries
        }
    }
}

// Helper to execute ADB shell commands with retries
function adbShellExec(command, timeout = adbCommandTimeout, retries = adbMaxRetries) {
    return adbExec(`shell ${command}`, timeout, retries);
}

// Helper to check if emulator is ready using adb devices
function isEmulatorReady() {
    return new Promise(resolve => {
        exec(`"${adbPath}" devices`, { timeout: 10000 }, (error, stdout, stderr) => {
            if (error && error.code !== 'ETIMEDOUT' && !error.killed) {
                return resolve(false);
            }
            if (stdout.includes(emulatorSerial) && stdout.includes('device')) {
                return resolve(true);
            }
            resolve(false);
        });
    });
}

// Helper to wait for emulator to be ready
async function waitForEmulatorReady(timeout, interval) {
    console.log(`Waiting up to ${timeout / 1000} seconds for emulator (${emulatorSerial}) to be ready via ADB...`);
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await isEmulatorReady()) {
            console.log(`Emulator (${emulatorSerial}) is ready and detected by ADB.`);
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    console.error(`Emulator (${emulatorSerial}) not ready after ${timeout / 1000} seconds.`);
    return false;
}

// Helper function to kill existing emulator processes (to ensure a clean launch)
async function killEmulatorProcesses() {
    console.log('Attempting to kill any existing emulator processes...');
    return new Promise(resolve => {
        exec(`taskkill /F /IM emulator.exe`, { timeout: 15000 }, (error, stdout, stderr) => {
            if (error && !stderr.includes('not found')) {
                console.warn(`Warning: Error trying to kill emulator processes: ${stderr}`);
            } else {
                console.log('Taskkill command sent for emulator.exe.');
            }
            resolve();
        });
    });
}


(async () => {
  let videoRecordProcess = null;
  const videoFileName = `test_run_${Date.now()}.mp4`;
  const emulatorVideoPath = `/sdcard/${videoFileName}`;
  const localVideoDir = 'videos';
  const localVideoPath = `${localVideoDir}/${videoFileName}`;

  try {
    // --- Step 0: Ensure a Clean Emulator State ---
    await killEmulatorProcesses();
    await new Promise(resolve => setTimeout(resolve, emulatorKillGracePeriod));

    // --- Step 1: Launch the Emulator ---
    console.log(`Launching emulator: ${avdName}...`);
    exec(`"${emulatorPath}" -avd "${avdName}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error launching emulator: ${error.message}`);
        } else {
            console.log('Emulator launch command sent successfully.');
        }
    });

    // --- Step 2: Wait for Emulator to be Ready via ADB Polling ---
    await new Promise(resolve => setTimeout(resolve, emulatorLaunchGracePeriod));
    const ready = await waitForEmulatorReady(emulatorReadyTimeout, pollingInterval);
    if (!ready) {
        throw new Error('Failed to launch or connect to emulator within timeout. Please ensure AVD name is correct and emulator can boot.');
    }
    console.log(`Emulator (${emulatorSerial}) is confirmed ready for operations.`);
    await new Promise(resolve => setTimeout(resolve, postReadyGracePeriod));

    // --- Step 3: Start Screen Recording ---
    console.log('Starting screen recording...');
    videoRecordProcess = exec(`"${adbPath}" -s ${emulatorSerial} shell screenrecord ${emulatorVideoPath}`, { detached: true, stdio: 'ignore' });
    videoRecordProcess.unref(); // Allow the parent process to exit independently
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Screen recording started.');

    // --- Step 4: Force Stop App for Clean Launch (if already running) ---
    console.log(`Force stopping app ${packageName} for a clean start...`);
    try {
        await adbShellExec(`am force-stop ${packageName}`); // This command now has retries
    } catch (e) {
        console.warn(`Warning: Force-stop command failed or timed out: ${e.message}. Continuing anyway.`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

    // --- Step 5: Launch App using ADB Shell Monkey ---
    console.log(`Launching app ${packageName} using adb shell monkey...`);
    await adbShellExec(`monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`); // This command now has retries
    console.log('App launch command sent via adb monkey.');
    await new Promise(resolve => setTimeout(resolve, appLoadTimeout));
    console.log('App load wait complete. Current screen should be the "App no longer available" message.');

    // --- Step 6: Country Selection ---
    console.log(`DEBUG: Tapping country selection dropdown at X=${countryDropdownX}, Y=${countryDropdownY}`);
    await adbShellExec(`input tap ${countryDropdownX} ${countryDropdownY}`); // This command now has retries
    console.log('Country dropdown tap command sent.');
    await new Promise(resolve => setTimeout(resolve, uiUpdateTimeout));

    console.log(`DEBUG: Tapping 'India' option at X=${indiaOptionX}, Y=${indiaOptionY}`);
    await adbShellExec(`input tap ${indiaOptionX} ${indiaOptionY}`); // This command now has retries
    console.log("'India' option tap command sent.");
    await new Promise(resolve => setTimeout(resolve, uiUpdateTimeout));

    // --- Step 7: User Input - Phone Number ---
    const phoneNumber = await promptUser('Please enter the phone number: ');
    console.log(`DEBUG: Tapping phone number input at X=${phoneNumberInputX}, Y=${phoneNumberInputY}`);
    await adbShellExec(`input tap ${phoneNumberInputX} ${phoneNumberInputY}`); // This command now has retries
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Phone number input tap command sent. Entering text...');
    await adbShellExec(`input text ${phoneNumber}`); // This command now has retries
    console.log('Phone number text input command sent.');
    await new Promise(resolve => setTimeout(resolve, uiUpdateTimeout));

    console.log(`DEBUG: Tapping 'Next' button at X=${nextButtonX}, Y=${nextButtonY}`);
    await adbShellExec(`input tap ${nextButtonX} ${nextButtonY}`); // This command now has retries
    console.log("'Next' button tap command sent.");
    await new Promise(resolve => setTimeout(resolve, appLoadTimeout));

    // --- Step 8: User Input - OTP ---
    const otpCode = await promptUser('Please enter the OTP: ');
    console.log(`DEBUG: Tapping OTP input at X=${otpInputX}, Y=${otpInputY}`);
    await adbShellExec(`input tap ${otpInputX} ${otpInputY}`); // This command now has retries
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('OTP input tap command sent. Entering text...');
    await adbShellExec(`input text ${otpCode}`); // This command now has retries
    console.log('OTP text input command sent.');
    await new Promise(resolve => setTimeout(resolve, uiUpdateTimeout));

    console.log(`DEBUG: Tapping 'Verify' button at X=${verifyButtonX}, Y=${verifyButtonY}`);
    await adbShellExec(`input tap ${verifyButtonX} ${verifyButtonY}`); // This command now has retries
    console.log("'Verify' button tap command sent.");
    await new Promise(resolve => setTimeout(resolve, appLoadTimeout));

    // --- Step 9: Non-Financial Operation - Transaction History ---
    console.log(`DEBUG: Tapping 'Show transaction history' at X=${transactionHistoryButtonX}, Y=${transactionHistoryButtonY}`);
    await adbShellExec(`input tap ${transactionHistoryButtonX} ${transactionHistoryButtonY}`); // This command now has retries
    console.log('Transaction History button tap command sent.');
    await new Promise(resolve => setTimeout(resolve, appLoadTimeout));

    // --- Step 10: Take Final Screenshot ---
    if (!fs.existsSync(localVideoDir)) {
      fs.mkdirSync(localVideoDir);
    }
    const screenshotPath = `${localVideoDir}/final_screen_${Date.now()}.png`;
    console.log('Taking final screenshot...');
    await new Promise((resolve, reject) => {
        const screenshotProcess = exec(`"${adbPath}" -s ${emulatorSerial} exec-out screencap -p > "${screenshotPath}"`);
        screenshotProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`Screenshot saved to ${screenshotPath}!`);
                resolve();
            } else {
                reject(new Error(`Failed to take screenshot, exit code: ${code}`));
            }
        });
        screenshotProcess.on('error', (err) => reject(err));
    });

    console.log('Automation test completed successfully!');

  } catch (error) {
    console.error('An error occurred:', error.message);
    if (error.message.includes('Failed to launch or connect to emulator')) {
      console.error('Emulator might not have booted or ADB connection failed. Check AVD name and Android SDK setup.');
    } else if (error.message.includes('ADB Command failed')) {
        console.error('An ADB command failed. This could be due to incorrect coordinates, app not in expected state, or an ADB issue. Check previous ADB Command failed logs for details.');
    } else if (error.message.includes('Failed to launch emulator')) {
      console.error('The emulator command itself failed. Check emulatorPath and avdName in your script, or try launching manually first.');
    } else if (error.message.includes('ADB Command timed out')) {
        console.error('An ADB command timed out after retries. The emulator might be unresponsive or the timeout is too short.');
    }
  } finally {
    // --- Step 11: Cleanup ---
    if (videoRecordProcess) {
        console.log('Stopping screen recording...');
        try {
            const pidOutput = await adbShellExec(`pidof screenrecord`);
            const pid = pidOutput.trim();
            if (pid) {
                await adbShellExec(`kill -2 ${pid}`);
                console.log(`Sent kill signal to screenrecord PID: ${pid}`);
            } else {
                console.log('Screenrecord process not found or already stopped.');
            }
        } catch (e) {
            console.warn(`Warning stopping screenrecord: ${e.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Screen recording stopped.');

        console.log(`Pulling video from emulator to ${localVideoPath}...`);
        try {
            await adbExec(`pull ${emulatorVideoPath} "${localVideoPath}"`);
            console.log(`Video pulled successfully to ${localVideoPath}`);
        } catch (e) {
            console.error(`Failed to pull video: ${e.message}`);
        }
    }

    if (emulatorSerial) {
        console.log(`Attempting to close emulator (${emulatorSerial})...`);
        try {
            await adbExec(`emu kill`);
            console.log('Emulator close command sent.');
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log('Emulator should now be closed.');
        } catch (e) {
            console.error(`Failed to send emulator kill command: ${e.message}`);
        }
    } else {
        console.log('Emulator serial not set. Cannot automatically close emulator.');
    }
    console.log('Script execution finished.');
  }
})();
