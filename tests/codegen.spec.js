import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.google.com/sorry/index?continue=https://www.google.com/search%3Fq%3Drahul%2Bshetty%2Bacademy%26rlz%3D1C1CHBD_enIN1151IN1151%26oq%3Drahul%2Bshetty%2Bacademy%26gs_lcrp%3DEgZjaHJvbWUyBggAEEUYOdIBCDU3OTlqMGo0qAIAsAIB%26sourceid%3Dchrome%26ie%3DUTF-8%26sei%3D4Ro9abWhO-et4-EPsa7goQQ&q=EhAkBrQAANR5emzQUtoOShiXGOK19MkGIjBlLV_CAUoWp96djxli1sYiRr_GSuxd5N5NPTDn1z9vzWKJJPSvMemoSBV3rOVLf5QyAVJaAUM');
  await page.locator('iframe[name="a-iqy49mplsdg4"]').contentFrame().getByText('reCAPTCHA', { exact: true }).click();
  await page.locator('iframe[name="c-iqy49mplsdg4"]').contentFrame().locator('[id="5"]').click();
  await page.locator('iframe[name="c-iqy49mplsdg4"]').contentFrame().locator('[id="4"]').click();
  await page.locator('iframe[name="c-iqy49mplsdg4"]').contentFrame().locator('[id="8"]').click();
  await page.locator('iframe[name="c-iqy49mplsdg4"]').contentFrame().getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('link', { name: 'Rahul Shetty Academy | Master' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('div').filter({ hasText: /^⚡Test Automation$/ }).nth(1).click();
  await page.getByText('⚡Test Automation').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'JOIN NOW', exact: true }).click();
  const page1 = await page1Promise;
});