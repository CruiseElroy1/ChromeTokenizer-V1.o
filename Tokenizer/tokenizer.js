import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';

const tokenize = (text) => {
    // Simple regex to split into words, subwords, or characters
    const tokens = text.match(/\w+|[^\s\w]/g) || [];
    return tokens;
};

async function main() {
    try {
        const text = await fs.readFile('input.txt', 'utf8');
        const tokensArray = tokenize(text);
        console.log(`Tokens: \x1b[32m${tokensArray.join(', ')}\x1b[0m`);  // Green color for tokens
        console.log(`Number of tokens: ${tokensArray.length}`);
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        await rl.question('Press Enter to exit...');
        rl.close();
    } catch (error) {
        console.error('Error: Could not read input.txt. Please check the file and try again.');
    }
}

main(); 