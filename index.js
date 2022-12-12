const dotenv = require("dotenv");
const puppeteer = require("puppeteer-extra");
const UserPreferencesPlugin = require("puppeteer-extra-plugin-user-preferences");

dotenv.config();

main();

async function main() {
  puppeteer.use(
    UserPreferencesPlugin({
      userPrefs: {
        download: {
          prompt_for_download: false,
          open_pdf_in_system_reader: true,
          default_directory: process.env.EXPORT_PATH,
        },
      },
    })
  );

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "./chromium/chrome.exe",
  });
  const page = await browser.newPage();

  await page.goto("https://asset.3stepit.com/AssetNG/assetNG?page=1");

  await page.type("#assetcompany", process.env.DB_TENANT);
  await page.type("#assetname", process.env.DB_USERNAME);
  await page.type("#assetpassword", process.env.DB_PASSWORD);
  await page.click("input[type='submit']");
  await page.waitForSelector("a[title='Excel']");
  await page.click("a[title='Excel']");
  setTimeout(async () => {
    await browser.close();
  }, 100000);
}
