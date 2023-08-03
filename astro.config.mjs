import { defineConfig } from 'astro/config';
import { writeFile, readFile, mkdir, cp, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parse } from 'node:path';
import routesDataIntegration from './scripts/integrations/routes_data_integration.js';
import createPageThumbnails from './scripts/integrations/thumbnails_integration.js';

import lit from "@astrojs/lit";
import alpine from '@astrojs/alpinejs';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let astroConfig;
const page_config_path = 'data/page_config.json';
const thumb_dir = 'assets/thumbnails/';

const runDataIntegration = true;
const runThumbIntegration = false;
const runInlineDefault = false;

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'always',

    format: 'file'
  },
  integrations: [
    runDataIntegration && routesDataIntegration(page_config_path, ['/']), 
    runThumbIntegration && createPageThumbnails(page_config_path, thumb_dir, ['/'], '#page1'), 
    runInlineDefault && {
    name: "InlineDefault",
    hooks: {
      'astro:config:setup': async ({
        config
      }) => {
        console.log('InlineDefault astro:config:setup');
        // console.log(JSON.stringify(config, null, 4));
      },

      'astro:config:done': async ({
        config
      }) => {
        console.log('InlineDefault astro:config:done');
        astroConfig = config;
        // console.log(JSON.stringify(config, null, 4));
      },

      'astro:build:setup': async ({
        vite,
        pages,
        target
      }) => {
        console.log('InlineDefault astro:build:setup');
        // let astroPages = []
        // for(const item of pages.values()) {
        // 	astroPages.push(item.route.route);
        // }
        // for (var item of astroPages) {
        // 	console.log(item);
        // }
      },

      'astro:build:done': async () => {
        console.log('InlineDefault astro:build:done');
        let pageConfig = {};
        const configPagePath = fileURLToPath(astroConfig.publicDir) + page_config_path;
        const configFile = await readFile(configPagePath).then(result => pageConfig = JSON.parse(result)).catch(err => console.log(err));
        const thumbDir = fileURLToPath(astroConfig.outDir) + thumb_dir;
        const thumbs = await readdir(thumbDir, {
          withFileTypes: true
        });
        for (const thumbnail of thumbs) {
          const thumb_path = parse(thumbnail.name);
          const thumb_id = thumb_path.name;
          if (['.png', '.jpg'].includes(thumb_path.ext)) {
            let page_obj = pageConfig.find((o, i) => {
              //console.log(o.title, thumb_id);
              if (o.title === thumb_id) {
                pageConfig[i].imgurl = './' + thumb_dir + thumb_path.base;
              }
            });
          }
        }
        await writeFile(configPagePath, JSON.stringify(pageConfig, null, 4)).catch(err => console.log(err)).then(() => console.log('config json created'));
        const configPagePathDist = fileURLToPath(astroConfig.outDir) + page_config_path;
        await writeFile(configPagePathDist, JSON.stringify(pageConfig, null, 4)).catch(err => console.log(err)).then(() => console.log('config json created in dist'));
      }
    }
  }
  
  , lit(), alpine()]
});