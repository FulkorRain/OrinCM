export const TARGETS = {
    textInclude: [
        'h1, h2, h3, h4, h5, h6',
        'p, li, blockquote, figcaption',
        'a, span, label, button',
        'dt, dd, td, th'
    ].join(', '),

    imageInclude: 'img',

    exclude: [
        '[data-no-effects]',
        '[data-effect-ui]',
        'script, style, noscript, template',
        'input, textarea, select, option, iframe',
        '[contenteditable]',
        '.price, .cart, .checkout',
    ].join(', '),

    minTextLength: 2,

    scope: '[data-effect-scope]',

    pageOff: 'body[data-effects="off"]'
};

export const LIMITS = {
    maxTextNodes: 40,
    maxImages: 6,
    onlyVisible: true,
    viewportMargin: 100,
};

export const CHAOS_TEXT = {
    minIntensity: 1,
    glitchChars: '█▓▒░▄▀■□▪▫◆◇○●∆∇∞≈≠≤≥⟁⌂⌘⌛⚡ĦŦŒŊƱɣʍʘʃʈ',
    charsPerIntensity: 0.5,
    glitchChance: 0.5,
    tickMs: 180,
    baseDurationMs: 800,
    maxDurationMs: 2500,
    maxTextNodes: 6
};

export const TEXT_CORRUPTION = {
    minIntensity: 1,
    glitchChars: '𓇋𓋴𓅂𓀀𓀁𓀂𓀃𓀄𓀅𓀆𓀇𓀈𓀉𓀊𓀋𓀌𓀍𓀎𓀏𓀐𓀑𓀒𓀓𓀔𓀕𓀖𓀗𓀘𓀙𓀚𓀛𓀜𓀝𓀞𓀟𓁀𓁁𓁂𓁃𓁄𓁅𓁆𓁇𓁈𓁉𓁊𓁋𓁌𓁍𓁎𓁏𓂀𓂁𓂂𓂃𓂄𓂅𓂆𓂇𓂈𓂉𓂊𓂋𓂌𓂍𓂎𓂏𓃀𓃁𓃂𓃃𓃄𓃅𓃆𓃇𓃈𓃉𓃊𓃋𓃌𓃍𓃎𓃏',
    charsPerIntensity: 2,
    glitchChance: 0.5,
    tickMs: 500,
    burstMinMs: 1500,
    burstMaxMs: 3000,
    pauseMinMs: 15000,
    pauseMaxMs: 20000,
    pauseScaleAtMax: 0.4,
    maxTextNodes: 1,
};

export const PERMANENT_CORRUPTION = {
    minIntensity: 2,
    glitchChars: '█▓▒░▄▀■□▪▫◆◇○●∆∇∞≈≠≤≥⟁⌂⌘⌛⚡ĦŦŒŊƱɣʍʘʃʈ',
    charsPerIntensity: 0.5,
    maxFraction: 0.15,
};

export const FLICKER = {
    minIntensity: 1,
    scanlinesFrom: 8,
    vignetteFrom: 10,
    bandFrom: 6,
    frameMs: 70,
    linesAtLowest: 6,
    linesAtHighest: 45,
    maxLineHeight: 0.5,
    alphaAtLowest: 0.12,
    alphaAtHighest: 0.4,
    barChanceAtLowest: 0.04,
    barChanceAtHighest: 0.3,
    maxBarHeight: 5,
    dimChance: 0.1,
    dimMax: 0.12,
    bandHeight: 60,
    bandSpeed: 0.15,
    fadeOutMs: 300,
    zIndex: 9100,
};

export const SCREEN_SHAKE = {
    minIntensity: 1,
    targets: ['#app', 'main'],
    stepMs: 80,
    amplitudeAtLowest: 1,
    amplitudeAtHighest: 3,
    ghostCount: 9,
    ghostOpacity: 0.8,
    ghostSpread: 4,
};

export const IMAGE_WARP = {
    minIntensity: 1,
    maxImages: 1,
    intervalAtLowestMs: 2500,
    intervalAtHighestMs: 200,
    warpSeconds: 0.3,
    resetSeconds: 0.4,
    scaleX: 0.06,
    scaleY: 0.08,
    skewX: 6,
    skewY: 3,
    hue: 20,
    blur: 2,
    saturate: 0.5
};

export const SCREEN_DECAY = {
    minIntensity: 6,
    maxCoverage: 0.001,
    secondsAtLowest: 25,
    secondsAtHighest: 7,
    cellSizeDesktop: 2,
    cellSizeMobile: 6,
    mobileBelowPx: 768,
    flashColor: '#3a0a0a',
    flashAlpha: 0.85,
    deadColor: '#000000',
    settleMinMs: 120,
    settleMaxMs: 300,
    fadeOutMs: 600,
    zIndex: 9000,
};

export const PERMANENT_DISSOLVE = {
    minIntensity: 2,
    imageSrc: '/images/index_banner.png',
    maxCoverage: 0.2,
    coverageCurve: 2,
    secondsForFullScreen: 10,
    cellSize: 30,
    dyingMs: 800,
    dyingJitter: 0.6,
    spreadChance: 0.45,
    decayColors: ['#2b2b2b', '#1a1a1a', '#000000'],
    pixelatedReveal: false,
    imageZoom: 0.95,
    imageBackground: '#1a1a1a',
    protect: 'a, button, input, textarea, select, label, [data-no-effects]',
    protectPaddingPx: 10,
    zIndex: 8900,
    fadeOutMs: 600,
};

export const PERMANENT_DECAY = {
    minIntensity: 5,
    candidates: 'section, article, aside',
    minWidthPx: 200,
    minHeightPx: 150,
    cellSizeDesktop: 6,
    cellSizeMobile: 14,
    mobileBelowPx: 768,
    maxSquares: 6000,
    tickMs: 80,
    cellsPerTick: 3,
    maxDecayPercent: 0.2,
    flashColor: '#3a0a0a',
    flashAlpha: 0.85,
    deadColor: '#000000',
    settleMinMs: 120,
    settleMaxMs: 300,
    fadeInMs: 300,
    zIndex: 10,
    resizeDebounceMs: 200,
};

export const DIRECTOR_CONFIG = {
    startDelayMinMs: 15000,
    startDelayMaxMs: 30000,
    tickMinMs: 4000,
    tickMaxMs: 8000,
    chanceAtLowest: 0.03,
    chanceAtHighest: 0.12,
    retryAfterFailMs: 10000,
    skipAttribute: 'data-effects-skip'
};

export const MESSAGE_SWAP = {
    minIntensity: 2,
    messages: ['Something has noticed you'],
    countAtLowest: 1,
    countAtHighest: 8,
    minTextLength: 25,
    showMinMs: 4000,
    showMaxMs: 9000,
};

export const LINK_CORRUPTION = {
    selector: '.corruptable-text',
    glitchChars: TEXT_CORRUPTION.glitchChars,
    baseChars: 2,
    charsPerIntensity: 0.5,
    glitchChance: 0.5,
    tickMs: 200,
    burstMinMs: 2000,
    burstMaxMs: 4000,
    pauseMinMs: 5000,
    pauseMaxMs: 9000,
};

export const BAIT = {
    enabled: true,
    tag: 'div',
    id: 'the-mall-sees-you',
    texts: ['Webpage structural integrity in critical condition'],
    minCount: 2,
    maxCount: 4,
    scatter: true,
    safetyCheckMs: 1000,
    glitchChars: TEXT_CORRUPTION.glitchChars,
    glitchTickMs: 140,
    glitchFraction: 0.65,
};

export const BANNER = {
    selector: '[data-banner]',
    stageClass: 'banner-ad__stage',
    specialSrc: '/images/special.png',
    corruptSuffix: '-corrupt',
}

export const BANNER_CORRUPTION = {
    minIntensity: 1,
    corruptChanceAtLowest: 0.05,
    corruptChanceAthighest: 0.7,
    specialChanceAtLowest: 0.05,
    specialChanceAtHighest: 0.3,
    rollWindowMs: 5000,
};

export const BANNER_SWITCH = {
    minIntensity: 1,
    maxBanners: 1,
    rules: {
        normal: {corrupt: 70, special: 30},
        corrupt: {special: 1},
        special: {}
    }
};

export const BANNER_SIZE = {
    minIntensity: 3,
    maxBanners: 1,
    zoomAtLowest: 2.5,
    zoomAtHighest: 6,
    zoomJitter: 0.15,
    zoomInSeconds: 0.15,
    zoomOutSeconds: 0.5,
};

export const BANNER_STATIC = {
    minIntensity: 6,
    maxBanners: 1,
    cellSize: 6,
    frameMs: 70,
    alphaAtLowest: 0.08,
    alphaAtHighest: 0.30,
    tearChance: 0.25,
    tearMinFraction: 0.05,
    tearMaxFraction: 0.2,
    fadeInSeconds: 0.15,
    fadeOutSeconds: 0.4,
};

//DIRECTOR:

const MIN_COOLDOWN = 30000;
const MAX_COOLDOWN = 80000;
const COOLDOWN = [MIN_COOLDOWN, MAX_COOLDOWN];

export const DIRECTOR_EFFECTS = {
    'chaos-text': { enabled: true, mode: 'once', cooldownMs: COOLDOWN },
    'text-corruption': { enabled: true, mode: 'burst', durationMs: [5000, 10000], cooldownMs: COOLDOWN },
    'flicker': { enabled: true, mode: 'burst', durationMs: [4000, 7000], cooldownMs: COOLDOWN },
    'screen-shake': { enabled: true, mode: 'burst', durationMs: [800, 2000], cooldownMs: COOLDOWN },
    'image-warp': { enabled: true, mode: 'burst', durationMs: [3000, 7000], cooldownMs: COOLDOWN },
    'screen-decay': { enabled: true, mode: 'burst', durationMs: [8000, 15000], cooldownMs: [60000, 120000] },
    'permanent-corruption': { enabled: false, mode: 'permanent' },
    'dissolve': { enabled: true, mode: 'session' },
    'message-swap': {enabled: true, mode: 'once', cooldownMs: COOLDOWN, },
    'permanent-decay': {enabled: false, mode: 'permanent'},
    'earwig': {enabled: true, mode: 'burst', durationMs: [30000, 60000], cooldownMs: [60000, 120000]},
    'banner-corruption': {enabled: true, mode: 'load'},
    'banner-switch': {enabled: true, mode: 'burst', durationMs: [300, 1500], cooldownMs: [10000, 30000]},
    'banner-size': {enabled: true, mode: 'burst', durationMs: [3000, 8000], cooldownMs: [30000, 60000]},
    'banner-static': {enabled: true, mode: 'burst', durationMs: [1500, 4000], cooldownMs: [20000, 50000]}
};

export const ESCALATION = {
    enabled: true,
    startChance: 0.10,
    chanceGrowthPerVisit: 0.05,
    maxChance: 0.5,
    levelsPerIncrease: 1,
    maxLevelFromVisits: 4,
};

export const JUMP_PAGES = {
    'mall': {level: 1},
    'jumpscare-404': {level: 8},
};


export const MASTER_SWITCH = {
    enabled: true, // ON & OFF SWITCH
    allowUrlOverride: true,
    urlParam: 'effects',
    rememberFor: 'session'
};

export const LOGGING = {
    logLevelChanges: true,
};