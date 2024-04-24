import { CheerioAPI } from "cheerio";

export enum SearchEngines {
    Google = 'google',
    Bing = 'bing',
    Yahoo = 'yahoo',
  }

export type GetInfoReturnType = {
    text: string,
    link: string,
    title: string,
}

export type EngineType = {
    [key in SearchEngines]: {
        url: string;
        name: string;
        getInfo: (body: CheerioAPI) => GetInfoReturnType
    }
}
