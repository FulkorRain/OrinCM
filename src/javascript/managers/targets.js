import {TARGETS, LIMITS, MASTER_SWITCH} from './effect-config.js';

const OVERRIDE_KEY = 'golem_effects_override';

function _isOverridenOff() {
    if (!MASTER_SWITCH.allowUrlOverride) return false;

    const param = new URLSearchParams(location.search).get(MASTER_SWITCH.urlParam);
    try {
        const store = MASTER_SWITCH.rememberFor === 'local' ? localStorage : sessionStorage;
        if (param === 'off') store.setItem(OVERRIDE_KEY, 'off');
        else if (param === 'on') store.removeItem(OVERRIDE_KEY);
        return store.getItem(OVERRIDE_KEY) === 'off';
     } catch {
        return param === 'off';
     }

}

const masterOff = !MASTER_SWITCH.enabled || _isOverridenOff();
if (masterOff && MASTER_SWITCH.enabled) {
    console.info('Effects are switched off');
}

function isEffectsEnabled() {
    if (masterOff) return false;
    return !(document.body && document.body.matches(TARGETS.pageOff));
}

function pickRandom(list, count) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

function _isOnScreen(rect) {
    const margin = LIMITS.viewportMargin;
    return rect.width > 0 && rect.height > 0 &&
        rect.bottom > -margin && rect.top < window.innerHeight + margin &&
        rect.right > -margin && rect.left < window.innerWidth + margin;
}

function _textNodeRect(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    return range.getBoundingClientRect();
}

function _getRoots(root) {
    let roots;
    if (root instanceof Element) {
        roots = [root];
    } else {
        const scoped = Array.from(document.querySelectorAll(TARGETS.scope));
        roots = scoped.length > 0 ? scoped : [document.body];
    }
    return roots.filter(element => element && !element.closest(TARGETS.exclude));
}

function _collectTextNodes(root, textInclude = TARGETS.textInclude) {
    const nodes = [];
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                if (node instanceof Element) {
                    return node.matches(TARGETS.exclude) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
                }
                if (node.nodeValue.trim().length < TARGETS.minTextLength) return NodeFilter.FILTER_REJECT;
                const parent = node.parentElement;
                if (!parent || !parent.closest(textInclude)) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
}

const textRecords = new WeakMap();

function _track(node) {
    let record = textRecords.get(node);
    if (!record) {
        record = {pristine: node.nodeValue, resting: node.nodeValue};
        textRecords.set(node, record);
    }
    return record;
}

function getPristineText(node) {return _track(node).pristine;}
function getRestingText(node) {return _track(node).resting;}

function setRestingText(node, text) {
    _track(node).resting = text;
    node.nodeValue = text;
}

function showRestingText(node) {
    node.nodeValue = _track(node).resting;
}

function revertToPristine(node) {
    const record = _track(node);
    record.resting = record.pristine;
    node.nodeValue = record.pristine;
}

function getTextTargets({root = null, max = LIMITS.maxTextNodes, onlyVisible = LIMITS.onlyVisible, textInclude = TARGETS.textInclude} = {}) {
    if (!isEffectsEnabled()) return [];
    
    let nodes = [];
    for (const searchRoot of _getRoots(root)) {
        nodes = nodes.concat(_collectTextNodes(searchRoot, textInclude));
    }
    nodes = [...new Set(nodes)];

    if (onlyVisible) nodes = nodes.filter(node => _isOnScreen(_textNodeRect(node)));
    if (nodes.length > max) nodes = pickRandom(nodes, max);

    nodes.forEach(_track);
    return nodes;
}

function getImageTargets({root = null, max = LIMITS.maxImages, onlyVisible = LIMITS.onlyVisible} = {}) {
    if (!isEffectsEnabled()) return [];

    let images = [];
    for (const searchRoot of _getRoots(root)) {
        images = images.concat(Array.from(searchRoot.querySelectorAll(TARGETS.imageInclude)));
    }
    images = [...new Set(images)].filter(image => !image.closest(TARGETS.exclude));

    if (onlyVisible) images = images.filter(image => _isOnScreen(image.getBoundingClientRect()));
    if (images.length > max) images = pickRandom(images, max);
    return images;
}

export {
    isEffectsEnabled,
    getTextTargets,
    getImageTargets,
    pickRandom,
    getPristineText,
    getRestingText,
    setRestingText,
    showRestingText,
    revertToPristine,
};