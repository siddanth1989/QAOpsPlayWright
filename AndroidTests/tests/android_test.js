const { _android } = require('playwright');

(async () => {
  const [device] = await _android.devices();
  console.log('Connected to:', device.model());
  await device.close();
})();