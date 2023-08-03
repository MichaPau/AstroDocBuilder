export function make_page_title(path:string, trailingSlash:string, buildFormat:string):string {

    let return_title;
    if(buildFormat === 'directory') {
       return_title = path.split('/').at(-2);
    } else {
        return_title = path.substring(path.lastIndexOf('/'), path.lastIndexOf('.'));
    }

    if(return_title)
        return return_title;
    else return path;
}