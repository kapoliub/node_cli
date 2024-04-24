import fs from 'node:fs';
import cheerio from 'cheerio';
import { SearchEngines } from './types';
import { OUTPUT_FILE_PATH, enginesList, getHeaderWithRandomUserAgent } from './helpers';

const unirest = require('unirest')

// why if I remove this code line the code doesn't work
const infoFilePath = './output/info.json';

(async () => {
  const [_, __, engineToUse, prompt] = process.argv;

  const engine = enginesList[engineToUse as SearchEngines];
  const header = getHeaderWithRandomUserAgent();

  return unirest
    .get(`${engine.url}${prompt}`)
    .headers(header)
    .then((res: any) => {
        console.log('Status code:', res.statusCode);

        const parsedBody = cheerio.load(res.body);
        const info = engine.getInfo(parsedBody);

        fs.readFile(OUTPUT_FILE_PATH, 'utf8', (err, data) => {
            let existingData = [];

            if (err) {
                err.code === 'ENOENT' || existingData.length === 0 ? console.log(err.message): console.error(err.message)
            } else {
                existingData = JSON.parse(data);
            }
            
            const updatedData = [...existingData, { engine: engine.name, ...info }];
    
            fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(updatedData, null, 2));
        });
    })
    .then(() => console.log(`Info was written into '${OUTPUT_FILE_PATH}' using ${engine.name}`))
    .catch((err: Error) => console.log(err))
})();