const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const app = express();
const port = process.env.PORT || 3000;

const baseURL = 'https://trends.google.com';
const countryCode = 'US';

async function fillTrendsDataFromPage(page) {
  while (true) {
    const isNextPage = await page.$('.feed-load-more-button');
    if (!isNextPage) break;
    await page.click('.feed-load-more-button');
    await page.waitForTimeout(2000);
  }
  const dataFromPage = await page.evaluate((baseURL) => {
    return Array.from(document.querySelectorAll('.feed-list-wrapper')).map((el) => ({
      [el.querySelector('.content-header-title').textContent.trim()]: Array.from(el.querySelectorAll('feed-item')).map((el) => ({
        index: el.querySelector('.index')?.textContent.trim(),
        title: el.querySelector('.title a')?.textContent.trim(),
        titleLink: `${baseURL}${el.querySelector('.title a')?.getAttribute('href')}`,
        subtitle: el.querySelector('.summary-text a')?.textContent.trim(),
        subtitleLink: el.querySelector('.summary-text a')?.getAttribute('href'),
        source: el.querySelector('.source-and-time span:first-child')?.textContent.trim(),
        published: el.querySelector('.source-and-time span:last-child')?.textContent.trim(),
        searches: el.querySelector('.search-count-title')?.textContent.trim(),
        thumbnail: el.getAttribute('image-url'),
      })),
    }));
  }, baseURL);
  return dataFromPage;
}

async function getGoogleTrendsDailyResults(keyword) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,700'],
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1200, height: 700 });

  const URL = `${baseURL}/trends/trendingsearches/daily?geo=${countryCode}&hl=en&q=${encodeURIComponent(keyword)}`;

  await page.setDefaultNavigationTimeout(60000);
  await page.goto(URL);

  await page.waitForSelector('.feed-item');

  const dailyResults = await fillTrendsDataFromPage(page);

  await browser.close();

  return dailyResults;
}

app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword parameter is required' });
  }

  try {
    const results = await getGoogleTrendsDailyResults(keyword);
    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching Google Trends daily results' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});