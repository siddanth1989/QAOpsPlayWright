const { _android: android } = require('playwright');
const { exec } = require('child_process');

(async () => {
  try {
    console.log('Connecting to device...');
    const [device] = await android.devices();
    console.log(`Connected to device: ${device.model()}`);

    // Launch app using ADB command
    console.log('Launching app...');
    exec('D:\\Siddanth\\PlayWrightAutomation\\AndroidSDK\\platform-tools\\adb.exe shell monkey -p com.google.android.apps.nbu.paisa.user.qa -c android.intent.category.LAUNCHER 1', 
      (error, stdout, stderr) => {
        if (error) {
          console.log('Error launching app:', error);
        } else {
          console.log('App launched successfully!');
        }
      });

    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take screenshot using device.screenshot() directly
    console.log('Taking screenshot...');
    await device.screenshot({ path: 'app-screenshot.png' });
    console.log('Screenshot saved as app-screenshot.png!');

    // Try to get app contexts (if any web views exist)
    try {
      const contexts = device.contexts();
      console.log(`Found ${contexts.length} context(s)`);

      if (contexts.length > 0) {
        console.log('App has web contexts - can interact with web elements');
      } else {
        console.log('Native app - no web contexts found');
      }
    } catch (e) {
      console.log('No web contexts available (pure native app)');
    }

    console.log('Test completed successfully!');

  } catch (error) {
    console.error('Error:', error.message);
  }
})();