const previewCache = new Map();
const MAX_CACHE = 50;

// Block fetches to private/loopback ranges to prevent SSRF.
// Note: DNS rebinding cannot be fully prevented in browser extensions;
// this mitigates the straightforward case of literal private IPs and
// well-known internal hostnames.
const PRIVATE_IP_RE = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|169\.254\.|0\.|::1$|fc[0-9a-f]{2}:|fd[0-9a-f]{2}:)/i;
const BLOCKED_HOSTNAMES = new Set(['localhost', 'broadcasthost', 'ip6-localhost', 'ip6-loopback']);

function isPrivateHost(hostname) {
    const normalizedHost = hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (BLOCKED_HOSTNAMES.has(normalizedHost)) return true;
    if (PRIVATE_IP_RE.test(normalizedHost)) return true;
    return false;
}

async function fetchPreview(url) {
    if (previewCache.has(url)) {
        return previewCache.get(url);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
            signal: controller.signal,
            redirect: 'manual',
            headers: {
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        clearTimeout(timeoutId);

        // Follow redirects manually so we can validate each hop
        if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) {
            const location = response.headers.get('location');
            if (!location) throw new Error('Redirect with no location');
            let redirectUrl;
            try { redirectUrl = new URL(location, url); } catch (_) { throw new Error('Invalid redirect URL'); }
            if (redirectUrl.protocol !== 'http:' && redirectUrl.protocol !== 'https:') throw new Error('Redirect to non-HTTP');
            if (isPrivateHost(redirectUrl.hostname)) throw new Error('Redirect to private address blocked');
            // One level of redirect only — avoid redirect chains
            const r2 = await fetch(redirectUrl.href, { signal: controller.signal, redirect: 'error',
                headers: { 'Accept': 'text/html,application/xhtml+xml', 'Accept-Language': 'en-US,en;q=0.9' } });
            if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
            const html = await r2.text();
            const preview = parsePreview(html, redirectUrl.href);
            if (previewCache.size >= MAX_CACHE) { previewCache.delete(previewCache.keys().next().value); }
            previewCache.set(url, preview);
            return preview;
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const preview = parsePreview(html, url);

        if (previewCache.size >= MAX_CACHE) {
            const firstKey = previewCache.keys().next().value;
            previewCache.delete(firstKey);
        }
        previewCache.set(url, preview);
        return preview;
    } catch (e) {
        const err = { error: e.name === 'AbortError' ? 'Request timed out' : 'Could not load preview', url };
        return err;
    }
}

function parsePreview(html, url) {
    let hostname = '';
    try { hostname = new URL(url).hostname.replace(/^www\./, ''); } catch (_) {}

    const title = extractMeta(html, 'og:title')
        || extractMeta(html, 'twitter:title')
        || extractTitle(html)
        || hostname;

    const description = extractMeta(html, 'og:description')
        || extractMeta(html, 'twitter:description')
        || extractMeta(html, 'description');

    const siteName = extractMeta(html, 'og:site_name') || hostname;
    const byline = extractMeta(html, 'author') || extractMeta(html, 'article:author');

    const content = extractArticleText(html);

    return { title, description, siteName, byline, content, url };
}

function extractMeta(html, property) {
    const patterns = [
        new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']{1,500})["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']${property}["']`, 'i'),
        new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']{1,500})["']`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']{1,500})["'][^>]+name=["']${property}["']`, 'i'),
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1].trim()) return decodeEntities(match[1].trim());
    }
    return null;
}

function extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]{1,300})<\/title>/i);
    return match ? decodeEntities(match[1].trim()) : null;
}

function extractArticleText(html) {
    // Strip scripts, styles, and nav/header/footer noise
    let cleaned = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<aside[\s\S]*?<\/aside>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');

    // Try to extract from semantic containers (ordered by specificity)
    const containers = [
        /<article[^>]*>([\s\S]*?)<\/article>/i,
        /<main[^>]*>([\s\S]*?)<\/main>/i,
        /<div[^>]+class=["'][^"']*(?:post-content|article-body|article-content|entry-content|story-body|prose|content-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    ];

    let source = cleaned;
    for (const pattern of containers) {
        const m = cleaned.match(pattern);
        if (m) { source = m[1]; break; }
    }

    // Extract paragraphs with meaningful content
    const paragraphs = [];
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = pRe.exec(source)) !== null) {
        const text = stripTags(m[1]).trim();
        if (text.length > 40 && paragraphs.length < 12) {
            paragraphs.push(text);
        }
    }

    return paragraphs.join('\n\n').slice(0, 4000);
}

function stripTags(html) {
    return decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim());
}

function decodeEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&rsquo;/g, '’')
        .replace(/&lsquo;/g, '‘')
        .replace(/&rdquo;/g, '”')
        .replace(/&ldquo;/g, '“')
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&hellip;/g, '…')
        .replace(/&eacute;/g, 'é')
        .replace(/&egrave;/g, 'è')
        .replace(/&agrave;/g, 'à')
        .replace(/&auml;/g, 'ä')
        .replace(/&ouml;/g, 'ö')
        .replace(/&uuml;/g, 'ü')
        .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchPreview' && request.url) {
        let url;
        try { url = new URL(request.url); } catch (_) {
            sendResponse({ error: 'Invalid URL' });
            return true;
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            sendResponse({ error: 'Unsupported protocol' });
            return true;
        }
        if (isPrivateHost(url.hostname)) {
            sendResponse({ error: 'Private/local addresses not allowed' });
            return true;
        }
        fetchPreview(request.url).then(sendResponse);
        return true;
    }
});
