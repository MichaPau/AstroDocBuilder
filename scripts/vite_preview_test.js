import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { exit } from 'node:process';
import * as fs from 'node:fs/promises';



  const previewServer = await preview({
    // any valid user config options, plus `mode` and `configFile`
    preview: {
      port: 8080,
      open: false,
    },
  });

  console.log("See me?");
  //const config_file = './public/data/page_config.json';
  // const data = await fs.readFile(configPath, 'utf8', (err, data) => {
  //   if(err) {
  //       console.log(err);
  //       return;
  //   }

    
    
  //   });
  //   console.log("and now");
  //   console.log(data),
    console.log(previewServer.httpServer.address());
    

    previewServer.httpServer.close();

  

  
