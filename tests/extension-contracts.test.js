const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const assert = require('node:assert/strict');
const test = require('node:test');
const vm = require('node:vm');

const root = join(__dirname, '..');
const manifest = JSON.parse(readFileSync(join(root, 'manifest.json'), 'utf8'));
const popupHtml = readFileSync(join(root, 'popup.html'), 'utf8');
const popupScript = readFileSync(join(root, 'popup.js'), 'utf8');
const contentScript = readFileSync(join(root, 'content.js'), 'utf8');
const backgroundScript = readFileSync(join(root, 'background.js'), 'utf8');

function parseAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g)) {
    const [, name, rawValue] = match;
    if (!rawValue) {
      attributes[name] = '';
      continue;
    }
    attributes[name] = rawValue.replace(/^['"]|['"]$/g, '');
  }
  return attributes;
}

function parsePopupDocument(html) {
  const elements = new Map();
  const selectOptions = new Map();

  for (const selectMatch of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)) {
    const selectAttributes = parseAttributes(selectMatch[1]);
    if (!selectAttributes.id) continue;

    const options = [];
    for (const optionMatch of selectMatch[2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)) {
      const optionAttributes = parseAttributes(optionMatch[1]);
      options.push({ value: optionAttributes.value ?? optionMatch[2].trim(), text: optionMatch[2].trim() });
    }
    elements.set(selectAttributes.id, { tagName: 'SELECT', attributes: selectAttributes });
    selectOptions.set(selectAttributes.id, options);
  }

  for (const tagMatch of html.matchAll(/<(input|div|select|button)\b([^>]*)>/gi)) {
    const [, tagName, rawAttributes] = tagMatch;
    const attributes = parseAttributes(rawAttributes);
    if (attributes.id && !elements.has(attributes.id)) {
      elements.set(attributes.id, { tagName: tagName.toUpperCase(), attributes });
    }
  }

  return { elements, selectOptions };
}

class FakeClassList {
  constructor(owner) {
    this.owner = owner;
    this.classes = new Set();
  }

  add(...classes) {
    for (const className of classes) this.classes.add(className);
    this.sync();
  }

  remove(...classes) {
    for (const className of classes) this.classes.delete(className);
    this.sync();
  }

  contains(className) {
    return this.classes.has(className);
  }

  toggle(className, force) {
    const shouldHave = force === undefined ? !this.classes.has(className) : Boolean(force);
    if (shouldHave) this.classes.add(className);
    else this.classes.delete(className);
    this.sync();
    return shouldHave;
  }

  sync() {
    this.owner.className = [...this.classes].join(' ');
  }
}

class FakeElement {
  constructor(tagName, document, attributes = {}, options = []) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = document;
    this.attributes = { ...attributes };
    this.children = [];
    this.parentNode = null;
    this.listeners = new Map();
    this.dataset = {};
    this.style = {};
    this.textContent = '';
    this.innerHTML = '';
    this.checked = false;
    this.removed = false;
    this.options = options.map((option) => ({ ...option }));
    this.selectedIndex = this.options.length ? 0 : -1;
    this.classList = new FakeClassList(this);
    this.className = '';

    if (attributes.class) this.className = attributes.class;
    if (attributes.id) this.id = attributes.id;
    if (attributes.value !== undefined) this.value = attributes.value;
    else if (this.options.length) this.value = this.options[0].value;
    else this.value = '';
  }

  set id(value) {
    this._id = value;
    this.attributes.id = value;
    if (this.ownerDocument) this.ownerDocument.register(this);
  }

  get id() {
    return this._id;
  }

  set className(value) {
    this._className = value;
    if (this.classList) {
      this.classList.classes = new Set(String(value).split(/\s+/).filter(Boolean));
    }
  }

  get className() {
    return this._className || '';
  }

  set value(nextValue) {
    this._value = String(nextValue);
    if (this.options.length) {
      const optionIndex = this.options.findIndex((option) => option.value === this._value);
      if (optionIndex !== -1) this.selectedIndex = optionIndex;
    }
  }

  get value() {
    return this._value;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  dispatchEvent(type, event = {}) {
    for (const listener of this.listeners.get(type) || []) {
      listener.call(this, { target: this, ...event });
    }
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    if (child.id) this.ownerDocument.register(child);
    return child;
  }

  remove() {
    this.removed = true;
    if (this.parentNode) {
      this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    }
    if (this.ownerDocument && this.id) this.ownerDocument.elementsById.delete(this.id);
  }

  querySelector(selector) {
    return this.ownerDocument.querySelectorWithin(selector, this);
  }
}

class FakeDocument {
  constructor(definition = { elements: new Map(), selectOptions: new Map() }) {
    this.elementsById = new Map();
    this.documentElement = new FakeElement('html', this);
    this.body = new FakeElement('body', this);
    this.documentElement.appendChild(this.body);
    this.listeners = new Map();

    for (const [id, { tagName, attributes }] of definition.elements) {
      const element = new FakeElement(tagName, this, attributes, definition.selectOptions.get(id) || []);
      this.body.appendChild(element);
    }
  }

  register(element) {
    this.elementsById.set(element.id, element);
  }

  getElementById(id) {
    return this.elementsById.get(id) || null;
  }

  createElement(tagName) {
    return new FakeElement(tagName, this);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(listener);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) || [];
    this.listeners.set(type, listeners.filter((candidate) => candidate !== listener));
  }

  dispatch(type) {
    for (const listener of this.listeners.get(type) || []) listener.call(this);
  }

  querySelector(selector) {
    return this.querySelectorWithin(selector, this.documentElement);
  }

  querySelectorWithin(selector, root) {
    const matcher = selector.startsWith('.')
      ? (element) => element.classList.contains(selector.slice(1))
      : selector.startsWith('#')
        ? (element) => element.id === selector.slice(1)
        : (element) => element.tagName.toLowerCase() === selector.toLowerCase();

    const stack = [...root.children];
    while (stack.length) {
      const element = stack.shift();
      if (matcher(element)) return element;
      stack.unshift(...element.children);
    }
    return null;
  }
}

function createChromeStub(storageValues = {}) {
  const storageGets = [];
  const storageSets = [];
  const sentMessages = [];
  const tabQueries = [];
  const runtimeListeners = [];

  const chrome = {
    runtime: {
      lastError: null,
      onMessage: {
        addListener(listener) {
          runtimeListeners.push(listener);
        },
      },
      sendMessage(message, callback) {
        sentMessages.push(message);
        if (callback) callback({});
      },
    },
    storage: {
      sync: {
        get(keys, callback) {
          storageGets.push(keys);
          callback({ ...storageValues });
        },
        set(values, callback) {
          storageSets.push(values);
          Object.assign(storageValues, values);
          if (callback) callback();
        },
      },
    },
    tabs: {
      query(query, callback) {
        tabQueries.push(query);
        callback([{ id: 42 }]);
      },
      sendMessage(tabId, message, callback) {
        sentMessages.push({ tabId, message });
        if (callback) callback({});
      },
    },
  };

  return { chrome, storageGets, storageSets, sentMessages, tabQueries, runtimeListeners, storageValues };
}

function runPopup(storageValues = {}) {
  const document = new FakeDocument(parsePopupDocument(popupHtml));
  const chromeStub = createChromeStub(storageValues);
  const sandbox = {
    document,
    chrome: chromeStub.chrome,
    console: { error() {}, log() {} },
  };

  vm.runInNewContext(popupScript, sandbox, { filename: 'popup.js' });
  document.dispatch('DOMContentLoaded');

  return { document, ...chromeStub };
}

function runContent(storageValues = {}) {
  const document = new FakeDocument();
  const chromeStub = createChromeStub(storageValues);
  const intervals = [];
  const clearedIntervals = [];
  const sandbox = {
    document,
    chrome: chromeStub.chrome,
    console: { error() {}, log() {} },
    location: { reload() {} },
    setInterval(callback, delay) {
      const interval = { callback, delay };
      intervals.push(interval);
      return interval;
    },
    clearInterval(interval) {
      clearedIntervals.push(interval);
    },
  };

  vm.runInNewContext(contentScript, sandbox, { filename: 'content.js' });

  return { document, intervals, clearedIntervals, ...chromeStub };
}

function runBackground(fetchImplementation = async () => {
  throw new Error('unexpected fetch');
}) {
  const runtimeListeners = [];
  let timeoutId = 0;
  const sandbox = {
    chrome: {
      runtime: {
        onMessage: {
          addListener(listener) {
            runtimeListeners.push(listener);
          },
        },
      },
    },
    fetch: fetchImplementation,
    URL,
    Map,
    Set,
    RegExp,
    String,
    Number,
    parseInt,
    setTimeout(callback) {
      return ++timeoutId;
    },
    clearTimeout() {},
    AbortController,
  };

  vm.runInNewContext(backgroundScript, sandbox, { filename: 'background.js' });
  assert.equal(runtimeListeners.length, 1, 'background must register one message listener');

  return runtimeListeners[0];
}

async function sendBackgroundMessage(listener, request) {
  return await new Promise((resolve) => {
    const keepChannelOpen = listener(request, {}, resolve);
    if (!keepChannelOpen) resolve(undefined);
  });
}
function toPlain(value) {
  return JSON.parse(JSON.stringify(value));
}


test('manifest exposes only the extension entry points needed for the popup, content script, and preview fetcher', () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(new Set(manifest.permissions), new Set(['activeTab', 'scripting', 'storage']));
  assert.equal(manifest.action.default_popup, 'popup.html');
  assert.equal(manifest.background.service_worker, 'background.js');

  assert.equal(manifest.content_scripts.length, 1);
  assert.deepEqual(manifest.content_scripts[0], {
    matches: ['*://hckrnews.com/*'],
    js: ['content.js'],
    run_at: 'document_start',
    all_frames: false,
  });

  assert.ok(
    manifest.host_permissions.includes('*://hckrnews.com/*'),
    'content script needs host access to hckrnews.com',
  );
  assert.ok(
    manifest.host_permissions.includes('*://*/*'),
    'background preview fetcher needs broad host access; background tests enforce private-host blocking',
  );
});

test('popup HTML provides the controls and initial values that popup.js wires on load', () => {
  const { document, storageGets } = runPopup({
    theme: 'dracula',
    autoRefreshEnabled: true,
    refreshInterval: 300,
    linkPreviewEnabled: true,
  });

  assert.deepEqual(toPlain(storageGets[0]), ['theme', 'autoRefreshEnabled', 'refreshInterval', 'linkPreviewEnabled']);
  assert.equal(document.getElementById('themeSelect').value, 'dracula');
  assert.equal(document.getElementById('statusBar').textContent, 'Theme: Dracula Official');
  assert.equal(document.getElementById('autoRefreshToggle').checked, true);
  assert.equal(document.getElementById('refreshInterval').value, '300');
  assert.equal(document.getElementById('refreshStatus').textContent, 'Refreshing every 300 seconds');
  assert.equal(document.getElementById('linkPreviewToggle').checked, true);
  assert.equal(
    document.getElementById('previewStatus').textContent,
    'Hover links to preview — click 📌 to pin as side panel',
  );
});

test('popup clamps auto-refresh intervals before persisting and messaging the content script', () => {
  const { document, storageSets, sentMessages } = runPopup({ refreshInterval: 60 });
  const intervalInput = document.getElementById('refreshInterval');

  intervalInput.value = '1';
  intervalInput.dispatchEvent('change');

  intervalInput.value = '9999';
  intervalInput.dispatchEvent('change');

  assert.deepEqual(storageSets.map((entry) => entry.refreshInterval), [5, 3600]);
  assert.deepEqual(sentMessages.map((entry) => entry.message.interval), [5, 3600]);
  assert.equal(document.getElementById('refreshInterval').value, '3600');
});

test('every theme option exposed by the popup is accepted by the content script', () => {
  const popupThemeValues = parsePopupDocument(popupHtml)
    .selectOptions.get('themeSelect')
    .map((option) => option.value);

  const { runtimeListeners, storageSets, document } = runContent({
    theme: 'default',
    darkModeEnabled: true,
    autoRefreshEnabled: false,
    linkPreviewEnabled: false,
  });
  const [listener] = runtimeListeners;
  assert.ok(listener, 'content script must listen for popup messages');

  for (const theme of popupThemeValues) {
    listener({ action: 'setTheme', theme }, {}, () => {});
  }

  assert.deepEqual(
    storageSets.filter((entry) => entry.theme).map((entry) => entry.theme),
    popupThemeValues,
  );

  const style = document.getElementById('hckr-dark-mode-style');
  assert.ok(style.textContent.includes('--bg-primary:'), 'accepted themes must inject the dark-mode CSS variables');
});

test('content script ignores unknown theme names from messages', () => {
  const { runtimeListeners, storageSets, document } = runContent({
    theme: 'default',
    darkModeEnabled: true,
    autoRefreshEnabled: false,
    linkPreviewEnabled: false,
  });
  const initialCss = document.getElementById('hckr-dark-mode-style').textContent;

  runtimeListeners[0]({ action: 'setTheme', theme: 'default;body{display:none}' }, {}, () => {});

  assert.deepEqual(storageSets.filter((entry) => entry.theme), []);
  assert.equal(document.getElementById('hckr-dark-mode-style').textContent, initialCss);
});

test('background fetchPreview message rejects invalid, non-http, and private/local URLs without fetching', async () => {
  const fetchedUrls = [];
  const listener = runBackground(async (url) => {
    fetchedUrls.push(url);
    throw new Error('network should not be reached for blocked URLs');
  });

  assert.deepEqual(toPlain(await sendBackgroundMessage(listener, { action: 'fetchPreview', url: 'not a url' })), {
    error: 'Invalid URL',
  });
  assert.deepEqual(toPlain(await sendBackgroundMessage(listener, { action: 'fetchPreview', url: 'file:///etc/passwd' })), {
    error: 'Unsupported protocol',
  });

  for (const url of [
    'http://localhost/article',
    'http://127.0.0.1/article',
    'http://10.0.0.1/article',
    'http://172.16.0.1/article',
    'http://192.168.1.20/article',
    'http://[::1]/article',
  ]) {
    assert.deepEqual(
      toPlain(await sendBackgroundMessage(listener, { action: 'fetchPreview', url })),
      { error: 'Private/local addresses not allowed' },
      `${url} must be blocked before fetch`,
    );
  }

  assert.deepEqual(fetchedUrls, []);
});

test('background fetchPreview parses stable article metadata and readable body text', async () => {
  const fetchedUrls = [];
  const listener = runBackground(async (url) => {
    fetchedUrls.push(url);
    return {
      ok: true,
      status: 200,
      type: 'basic',
      headers: { get: () => null },
      async text() {
        return `
          <!doctype html>
          <meta property="og:title" content="A &amp; B Launch">
          <meta name="description" content="Readable summary &amp; context">
          <meta property="og:site_name" content="Example News">
          <meta name="author" content="Ada Lovelace">
          <nav><p>This navigation paragraph is intentionally long enough to be ignored by extraction.</p></nav>
          <article>
            <p>This first article paragraph is long enough to be included in the preview body and decoded &amp; cleaned.</p>
            <p>This second paragraph keeps the readable article content flowing for users who hover links.</p>
          </article>
        `;
      },
    };
  });

  const preview = await sendBackgroundMessage(listener, {
    action: 'fetchPreview',
    url: 'https://example.com/articles/launch',
  });

  assert.equal(preview.title, 'A & B Launch');
  assert.equal(preview.description, 'Readable summary & context');
  assert.equal(preview.siteName, 'Example News');
  assert.equal(preview.byline, 'Ada Lovelace');
  assert.match(preview.content, /first article paragraph is long enough/);
  assert.match(preview.content, /second paragraph keeps the readable article content/);
  assert.doesNotMatch(preview.content, /navigation paragraph/);
  assert.equal(preview.url, 'https://example.com/articles/launch');
  assert.deepEqual(fetchedUrls, ['https://example.com/articles/launch']);
});
