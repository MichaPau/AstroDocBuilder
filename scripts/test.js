import puppeteer from 'puppeteer';
import * as fs from 'node:fs/promises';
import { exit } from 'node:process';


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
// const url = 'http://127.0.0.1:3000/'+json_obj[2].pathname;
// console.log(url);
const browser = await puppeteer.launch({headless: true});
const page = await browser.newPage();


await page.setViewport({
    width: 310, // default: 800
    height: 438, // default: 600 
    deviceScaleFactor: 0.5 // default: 1
});

let new_json = [];
for (var item of json_obj) {
    let url = 'http://127.0.0.1:3000'+item.route;
    let filePath = './dist'+item.route+'.html';

    let path_name = "./dist/assets/thumbnails/" + item.title + ".png";

    console.log(url);
    console.log(path_name);

    
    await page.setViewport({
        width: 310, // default: 800
        height: 438, // default: 600 
        deviceScaleFactor: 0.5 // default: 1
    });
    
    await page.goto(url);
    //await page.goto(filePath);
    let contentHTML = '';
    await fs.readFile(filePath, { encoding: 'utf8' }).catch((err) => console.log(err)).then((res) => contentHTML = res);


    //await page.setContent(contentHTML);
    const page_element = (await page.$('#page1'));

    if(page_element) {
        const screenShot = await page_element.screenshot({
            path: path_name,
            type: "png",
            
        })
        .catch(err => console.log(err))
        .then(() => {
            console.log("Created image: ", path_name);
            item.imgurl = "./assets/thumbnails/" + item.title + ".png";
        });
    }

    new_json.push(item);
}

await fs.writeFile(config_file, JSON.stringify(new_json, null, 4))
        .catch((err) => console.err(err))
        .then(() => console.log('config file updated'));

// for (var item of json_obj) {

    
//     let url = 'http://127.0.0.1:3000/'+item.pathname;
//     let path_name = "./public/assets/thumbnails/" + item.title + ".png";

//     console.log(url);
//     console.log(path_name);

//     const page = await browser.newPage();
//     await page.setViewport({
//         width: 310, // default: 800
//         height: 438, // default: 600 
//         deviceScaleFactor: 0.5 // default: 1
//     });
//     await page.goto(url);

//     const page_element = await page.$('#page1');

//     const screenShot = await page_element.screenshot({
//         path: path_name,
//         type: "png",
        
//     })
//     .catch(err => console.log(err))
//     .then(() => console.log("Created image: ", path_name));

// };



//await sleep(60000);
await browser.close();
exit(0);
//console.log(JSON.stringify(json_obj, null, 4));

// clip: {
//     x: 0,
//     y: 0,
//     width: page.viewport().width,
//     height: page.viewport().height
// }