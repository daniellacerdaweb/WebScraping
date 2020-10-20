import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

interface ListArray {
  href:string,
  title:string
}


const urlInfoMoney = 'https://www.infomoney.com.br/'

async function getDataSite(urlInfoMoney:string): Promise<AxiosResponse<any>>{
 return await axios.get(urlInfoMoney)
}

function getAllLinks(site:AxiosResponse<any>){
  const $ = cheerio.load(site.data)
  return $('.hl-title a');
}

function convertAllLinksToObject(cheerioLinks){
const objectKeyLinks = Object.keys(cheerioLinks);
return objectKeyLinks.reduce((previousValue:ListArray[],item)=>{
    if(parseFloat(item)){
      const newItem = {
        href:cheerioLinks[item].attribs.href,
        title:cheerioLinks[item].attribs.title
      }
      return [...previousValue, newItem]
    }else{
      return previousValue
    }
},[])
}

function saveAsFile(allObject){
   fs.writeFile('src/news.json', JSON.stringify(allObject), ((err)=>{
    if (err) throw err;
    console.log('Saved!');
    process.exit()
   }));
}

async function init(){
  const site = await getDataSite(urlInfoMoney);
  const cheerioLinks =  getAllLinks(site);
  const allObject = convertAllLinksToObject(cheerioLinks)
  saveAsFile(allObject)
}

init();

