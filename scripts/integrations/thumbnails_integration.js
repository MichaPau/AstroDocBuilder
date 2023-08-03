import { writeFile, readFile, mkdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import puppeteer from 'puppeteer';

let astroConfig;
let astroPages = [];
export default function createPageThumbnails(
    page_config_path, thumb_dir, 
    excludeRoutes = [], 
    puppeteer_selector = "",
    puppeteer_config = {
        page: {
            width: 310,
            height: 438,
            deviceScaleFactor: 0.5,
        },
        screenshot: {
            type: "png",
        }
    }, 
    preview_config = {preview: {port: 8080, open: false}}) {

    return {
        name: "RoutesDataIntegration",
        hooks: {
            'astro:config:done': async ({config}) => {
				astroConfig = config;
            },
            'astro:build:setup': async ({vite, pages, target}) => {
                for(const item of pages.values()) {
                    if(!excludeRoutes.includes(item.route.route)) {
                        astroPages.push(item.route.route);
                    }
                }
            },
            'astro:build:done': async () => {
                const previewServer = await preview(preview_config);
                

                const browser = await puppeteer.launch({headless: false});
                const page = await browser.newPage();

                await page.setViewport(puppeteer_config.page);
                
                let new_json = [];
                for (var item of astroPages) {
                
                    let url = 'http://127.0.0.1:'+preview_config.preview.port+item;
                    const title = item.split('/').at(-1);
                
                    let path_name = fileURLToPath(astroConfig.publicDir) + thumb_dir + title + ".png";

                    console.log(url);
                    console.log(path_name);

                    
                    // await page.setViewport({
                    //     width: 310, // default: 800
                    //     height: 438, // default: 600 
                    //     deviceScaleFactor: 0.5 // default: 1
                    // });
                    
                    await page.goto(url);

                    let page_element;

                    if(puppeteer_selector !== "") {
                        page_element = (await page.$(puppeteer_selector));
                    } else {
                        page_element = page;
                    }

                    if(page_element) {
                        const screenShot = await page_element.screenshot({
                            path: path_name,
                            type: puppeteer_config.screenshot.type,
                            
                        })
                        .catch(err => console.log(err))
                        .then(() => {
                            console.log("Created thumbnail: ", path_name);
                        });
                    } else {
                        console.log("Page selector %s not found, skip thumbnail creation.", puppeteer_selector);
                    }
                }

                const distThumbDir = fileURLToPath(astroConfig.outDir + thumb_dir);
                const srcThumbDir = fileURLToPath(astroConfig.publicDir + thumb_dir);
                await mkdir(distThumbDir, { recursive: true }, (err) => {
                    if (err) console.log(err);
                });
                await cp(srcThumbDir, distThumbDir, {recursive: true}, (err) => {
                    if(err) {
                        console.log(err);
                    }
                });

                previewServer.httpServer.close();
            }
        }
    }
}