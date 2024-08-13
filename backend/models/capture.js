import express from 'express';
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
// Route to capture screenshot


app.get("/", async (request, response) => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  try {
    
    const [page] = await browser.pages();

  // David Lynch's Weather Report 7/22/21
  await page.goto('https://www.youtube.com/watch?v=MlyNWpf1N0s');

  await page.waitForSelector('.ytp-fullscreen-button.ytp-button');

  await page.evaluate(() => {
    document.querySelector('.ytp-fullscreen-button.ytp-button').click();
  });

  } catch (error) {
    console.log(error);
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
