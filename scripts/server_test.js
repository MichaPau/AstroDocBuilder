import puppeteer from 'puppeteer';
import * as fs from 'node:fs/promises';
import * as http from 'http';

const config_file = './public/data/page_config.json';
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const data = await fs.readFile(config_file, 'utf8', (err, data) => {
    if(err) {
        console.log(err);
        return;
    }
    
    
});

const json_obj = JSON.parse(data);

const server = http.createServer((req, res) => res.end('Hi'))
    .listen(1337, async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto('http://localhost:1337/'+json_obj[2].pathname);
        

        await sleep(5000);

        console.log('Done');
        browser.close();
        server.close();
    });