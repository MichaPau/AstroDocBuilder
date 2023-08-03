import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';


let setupCalledFlag = false;
let publicDir = "";

export default function routesDataIntegration(page_config_path, excludeRoutes = []) {
    return {
        name: "RoutesDataIntegration",
        hooks: {
            'astro:config:done': async ({config}) => {
				publicDir = fileURLToPath(config.publicDir);
            },
            'astro:build:setup': async ({vite, pages, target}) => {

                const configPage = publicDir + page_config_path;

                //setup is called twice in the build process - not sure why
                if(!setupCalledFlag) {

                    let configObj = [];
                    let newConfig = [];

                    const cF = await writeFile(configPage, '[]', {flag: 'wx'})
                    .then(() => console.log('No config found- new file created'))
                    .catch(async (err) => {
                        console.log('Found config file');
                        const configFile = await readFile(configPage)
                            .then((result) => configObj = JSON.parse(result))
                            .catch((err) => console.log(err))
                            
                    });
                    

                    for(const value of pages.values()) {
                        const route = value.route.route;
                        if(!excludeRoutes.includes(route)) {
                            const pathObj = configObj.find(o => o.route === route);
                            if(pathObj) {
                                newConfig.push(pathObj);
                                console.log("Object: %s already in file", pathObj.route);
                            } else {
                                let page_obj = {};
                                page_obj.id = route.split('/').at(-1);
                                page_obj.title = route.split('/').at(-1);
                                page_obj.route = route;
                                page_obj.imgurl = '';
                                page_obj.description = '';
                                page_obj.order = 0;

                                newConfig.push(page_obj);
                                console.log("New Path: %s", page_obj.route);
                                

                            }
                        }
                    }
                    await writeFile(configPage, JSON.stringify(newConfig, null, 4))
                        .catch((err) => console.log(err))
                        .then(() => console.log('config json created'));
                    //console.log("Pages:"+mapString);
                    //console.dir(vite.build);
                    setupCalledFlag = true;
                }
            },


        },
    }
}