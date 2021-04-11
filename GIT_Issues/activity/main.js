let{createFoldersFn} = require("./createFile");
let{writeFileFn} = require("./createFile");

const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");


const url = "https://github.com/topics";
request(url, cb);
function cb(error, response, html){
    if(error){
        console.log(error);
    }
    else{
        extractHTML(html);
    }
}

function extractHTML(html){
    let selectorTools = cheerio.load(html);
    let topicsNameArr = selectorTools(".no-underline.d-flex.flex-column.flex-justify-center");
    for(let i = 0; i < topicsNameArr.length; i++){
        let linkVal = selectorTools(topicsNameArr[i]).attr("href");
        let link = "https://github.com/"+linkVal;
        printLinks(link);
    }
}
function printLinks(link){
    request(link, cb);
    function cb(error, response, html){
        if(error){
            console.log(error);
        }
        else{
            extractLinks(html);
        }
    }
}

function extractLinks(html){
    let selectorTools = cheerio.load(html);
    let linksArr = selectorTools(".f3.color-text-secondary.text-normal.lh-condensed");
    let topic = selectorTools(".h1-mktg").text();
    topic = topic.trim();
    createFoldersFn("./", topic);
    for(let i = 0; i < 8; i++){
        let linkAdd = selectorTools(linksArr[i]).find("a");
        let link_raw = selectorTools(linkAdd[1]).attr("href");
        let jsonFileName = link_raw.split("/").pop();
        repoName = jsonFileName.trim();
        let topic_link = "https://github.com/"+link_raw + "/issues";
        getIssues(repoName, topic, topic_link);
        
    }
}

function getIssues(repoName, topicName, repoPageLink){
    request(repoPageLink, cb);
    function cb(err, resp, html){
        if(err){
            console.log(error);
        }
        else{
            extractIssues(html, repoName, topicName);
        }
    }
}

function extractIssues(html, repoName, topicName){
    let selectorTools = cheerio.load(html);
    let IssuesAnchArr = selectorTools(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title");
    let arr = [];
    for(let i = 0; i < IssuesAnchArr.length; i++){
        let name = selectorTools(IssuesAnchArr[i]).text();
        let link = selectorTools(IssuesAnchArr[i]).attr("href");
        arr.push({
            "Name" : name,
            "Link" : "https://github.com/" + link
        })
    }
    let folderPath = __dirname + "\\Issue";
    let filePath = path.join(folderPath, topicName, repoName + ".pdf");
    let pdfDoc = new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.text(JSON.stringify(arr));
    pdfDoc.end();
}
