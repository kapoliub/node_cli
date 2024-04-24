import { Cheerio, Element } from "cheerio";
import { EngineType, SearchEngines } from "./types";

export function getHeaderWithRandomUserAgent() {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",     
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",     
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",     
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",     
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",     
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",     
   ];
   const randomNumber = Math.floor(Math.random() * userAgents.length);     

   return { "User-Agent": userAgents[randomNumber] };     
}

export const enginesList: EngineType = {
    [SearchEngines.Google]: {
        url: 'https://www.google.com/search?q=',
        name: 'Google.com',
        getInfo: (parsedBody) => {
            const selector = '#search .MjjYud';
            const $ = parsedBody;
            let node = $(selector).first();

            if(!!$(node).find('#tw-main')){
                node = $(selector)[1] as unknown as Cheerio<Element>
            }

            const text = $(node).find('em').parent().text();
            const link = $(node).find('a').attr()?.href || '';
            const title = $(node).find('h3').text();

            return { title, text, link }
        }

    },
    [SearchEngines.Bing]: {
        url: 'https://www.bing.com/search?q=',
        name: 'Bing.com',
        getInfo: (parsedBody) => {
            const selector = '#b_results .b_algo';
            const $ = parsedBody;
            let node = $(selector).first();

            const text = $(node).find('.b_caption p').text();
            const link = $(node).find('a').attr()?.href || '';
            const title = $(node).find('h2').text();

            return { title, text, link }
        }
        
    },
    [SearchEngines.Yahoo]: {
        url: 'https://search.yahoo.com/search?p=',
        name: 'Yahoo.com',
        getInfo: (parsedBody) => {
            const selector = '#web .reg li';
            const $ = parsedBody;
            let node = $(selector).first();

            const text = $(node).find('.compText p').text();
            const link = $(node).find('a').attr()?.href || '';
            const title = $(node).find('h3 a').contents().last().text()

            return { title, text, link }
        }
    },
}

export const OUTPUT_FILE_PATH = './output/info.json';

