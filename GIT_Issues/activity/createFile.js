
const fs = require("fs");
const path = require("path");

function dirCreator(dirPath){
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }
}


function createFolders(dirPath, name){
    let organizeFilePath = path.join(dirPath, "Issue");
    dirCreator(organizeFilePath);
    let innerPath = path.join(organizeFilePath, name);
    dirCreator(innerPath);
}

function writeFile(text, title, folderName){
    let filePath = '\Issue\\'+folderName+"\\"+title+'.json';
    if(fs.existsSync(filePath) == false){
        fs.writeFile(filePath, text, function (err) {});
    }    
}

module.exports = {
    createFoldersFn : createFolders,
    writeFileFn : writeFile
}