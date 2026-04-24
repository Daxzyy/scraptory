'use strict';

const https  = require('https');
const crypto = require('crypto');

const BASE_HOST   = 'chat.chatex.ai';
const BASE_ORIGIN = 'https://chat.chatex.ai';
const RELEASE     = '9a4a53f75b15b69a537a88aa2a105e61aeaf6ef1';

const MODELS = {
    'gpt5':     'openai/gpt-5.4',
    'gpt4o':    'openai/gpt-4o',
    'gpt4':     'openai/gpt-4',
    'claude':   'anthropic/claude-sonnet-4-5',
    'gemini':   'google/gemini-2.5-flash-preview-05-20',
    'mistral':  'mistralai/mistral-medium-3',
    'llama':    'meta-llama/llama-4-maverick',
    'default':  'openai/gpt-5.4',
};

class CookieJar {
    constructor() { this._s = new Map(); }
    ingest(raw) {
        const arr = Array.isArray(raw) ? raw : [raw];
        for (const r of arr) {
            if (!r) continue;
            const [nv, ...attrs] = r.split(';').map(s => s.trim());
            const eq = nv.indexOf('=');
            if (eq === -1) continue;
            const name = nv.slice(0, eq).trim(), value = nv.slice(eq + 1).trim();
            const meta = { value, path: '/', domain: BASE_HOST };
            for (const a of attrs) {
                const l = a.toLowerCase();
                if (l.startsWith('expires=')) meta.expires = new Date(a.slice(8));
                if (l.startsWith('max-age='))  meta.maxAge  = parseInt(a.slice(8), 10);
            }
            this._s.set(name, meta);
        }
    }
    serialize() {
        const now = new Date();
        return [...this._s.entries()]
            .filter(([, m]) => !m.expires || m.expires > now)
            .map(([n, m]) => \`\${n}=\${m.value}\`)
            .join('; ');
    }
}

function sentryHeaders(traceId) {
    return {
        'sentry-trace': \`\${traceId}-\${crypto.randomBytes(8).toString('hex')}-0\