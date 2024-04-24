
import fs from 'node:fs';
import prompts, { PromptObject } from 'prompts';
import { SearchEngines } from './types';
import { OUTPUT_FILE_PATH, enginesList } from './helpers';
import { spawn } from 'child_process';

const questions: PromptObject[] = [
    {
        type: 'text',
        name: 'prompt',
        message: 'What you want to search?',
        validate: (value: string) => value.trim().length > 0
    },
    {
        type: 'multiselect',
        name: 'engine',
        message: 'Choose an engine:',
        choices: [
            { title: 'Google', value: SearchEngines.Google },
            { title: 'Bing', value: SearchEngines.Bing },
            { title: 'Yahoo', value: SearchEngines.Yahoo },
        ],
        min: 1
    },
];


(async () => {
    const cliResponse = await prompts(questions);

    if (Object.keys(cliResponse).length < 2 || cliResponse.engine.length === 0) return;
    
    fs.writeFile(OUTPUT_FILE_PATH, '[]', () => console.log('The old results were erased'))

    cliResponse.engine.forEach((engine: SearchEngines) => {
        const { name } = enginesList[engine];

        const searchProcess = spawn('ts-node', ['search.ts', engine, cliResponse.prompt]);
        searchProcess.stdout.on('data', (data: Buffer) => {
            console.log(`${name} Search Result:`, data.toString());
        });
        searchProcess.stderr.on('data', (data: Buffer) => {
            console.error(`Error (${name}):`, data.toString());
        });
        searchProcess.on('close', (code: number) => {
            console.log(`${name} Search Process exited with code ${code}`);
        });
    });
})();