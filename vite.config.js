import { cpSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger, defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

const TEST_PAGES = ['test.html', 'spooky.html', 'dissolve-test.html'];

const pages = [
    resolve(root, 'index.html'),
    ...readdirSync(resolve(root, 'src/html'), { recursive: true })
        .filter(file => file.endsWith('.html') && !TEST_PAGES.includes(file))
        .map(file => resolve(root, 'src/html', file)),
];

function copyUnbundledFiles() {
    let outDir;
    const copy = file => cpSync(file, join(outDir, relative(root, file)), { recursive: true });

    return {
        name: 'copy-unbundled-files',
        apply: 'build',
        configResolved(config) {
            outDir = resolve(config.root, config.build.outDir);
        },
        writeBundle() {
            for (const page of pages) {
                const html = readFileSync(page, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
                for (const [tag] of html.matchAll(/<script\b[^>]*>/gi)) {
                    const src = tag.match(/\ssrc\s*=\s*["']([^"']+)["']/i)?.[1];
                    const isModule = /\stype\s*=\s*["']module["']/i.test(tag);
                    if (!src || isModule || /^(https?:)?\/\//i.test(src)) continue;
                    copy(src.startsWith('/') ? join(root, src) : resolve(dirname(page), src));
                }
            }
            copy(resolve(root, 'src/assets'));
        },
    };
}

const logger = createLogger();
const warn = logger.warn;
logger.warn = (message, options) => {
    if (message.includes("can't be bundled without type=\"module\"")) return;
    warn(message, options);
};

export default defineConfig({
    customLogger: logger,
    plugins: [copyUnbundledFiles()],
    build: {
        rolldownOptions: { input: pages },
    },
});
