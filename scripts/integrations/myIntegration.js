let flag  = true;
export default function myIntegration() {
    return {
        name: 'MyIntegration',
        hooks: {
            'astro:build:setup': async ({vite, pages, target}) => {
                if(flag) {
                    console.log("MyIntegration astro:build:setup");
                    flag = false;
                } 
            },
            'astro:build:start': async() => {
                console.log("MyIntegration astro:build:start");
            },
            'astro:build:done': async () => {
                console.log('MyIntegration astro:build:done');
            }
        }
    }
}