import axios from 'axios';
import chalk from 'chalk';
import FormData from 'form-data';

let handler = async (m, {
    args,
    conn
}) => {
    try {
        if (!args.length) throw 'promptmu mana';
        let type = 'image';
        if (args.includes('--image')) type = 'image';
        if (args.includes('--video')) type = 'video';
        let prompt = args.filter(a => a !== '--image' && a !== '--video').join(' ').trim();
        if (!prompt) throw 'Prompt yg valid';
        let result = await aiLabs.generate({
            prompt,
            type
        });
        if (!result.success) throw result.result.error;
        if (type === 'image') {
            await conn.sendMessage(m.chat, {
                image: {
                    url: result.result.url
                },
                caption: \`\${result.result.prompt}\
