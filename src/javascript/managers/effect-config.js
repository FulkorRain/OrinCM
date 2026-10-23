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
    midFrom: 7,
    highFrom: 10,
    scanlinesFrom: 8,
    vignetteFrom: 10,
};

export const SCREEN_SHAKE = {
    minIntensity: 1,
    midFrom: 6,
    highFrom: 10,
    targets: ['#app', 'main']
};

export const IMAGE_WARP = {
    minIntensity: 1,
    maxImages: 1,
    intervalMs: 100,
    warpSeconds: 0.3,
    resetSeconds: 0.4,
    scaleXPerLevel: 0.06,
    scaleYPerLevel: 0.08,
    skewXPerLevel: 6,
    skewYPerLevel: 3,
    huePerLevel: 20,
    blurPerLevel: 2,
    saturatePerLevel: 0.5
};

export const SCREEN_DECAY = {
    minIntensity: 6,
    maxCoverage: 0.2,
    secondsAtLowest: 25,
    secondsAtHighest: 7,
    cellSizeDesktop: 6,
    cellSizeMobile: 14,
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
    minIntensity: 8,
    imageSrc: '/src/assets/images/index_banner.png',
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
}

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

export const DIRECTOR = {
    startDelayMinMs: 15000,
    startDelayMaxMs: 30000,
    tickMinMs: 4000,
    tickMaxMs: 8000,
    chanceAtLowest: 0.15,
    chanceAtHighest: 0.5,
    gapAtLowestMs: 45000,
    gapAtHighestMs: 20000,
    concurrencyTiers: [
        {fromLevel: 1, max: 1},
        {fromLevel: 5, max: 2},
        {fromLevel: 9, max: 3},
    ],
    countPermanentInCap: false,
    retryAfterFailMs: 10000,
    skipAttribute: 'data-effects-skip'
};

const MIN_COOLDOWN = 30000;
const MAX_COOLDOWN = 80000;
const COOLDOWN = [MIN_COOLDOWN, MAX_COOLDOWN];

export const DIRECTOR_EFFECTS = {
    'chaos-text': { enabled: true, mode: 'once', cooldownMs: COOLDOWN },
    'text-corruption': { enabled: true, mode: 'burst' },
    'flicker': { enabled: true, mode: 'burst', durationMs: [4000, 7000], cooldownMs: COOLDOWN },
    'screen-shake': { enabled: true, mode: 'burst', durationMs: [1500, 4000], cooldownMs: COOLDOWN },
    'image-warp': { enabled: true, mode: 'burst', durationMs: [3000, 7000], cooldownMs: COOLDOWN },
    'screen-decay': { enabled: true, mode: 'burst', durationMs: [8000, 15000], cooldownMs: [60000, 120000] },
    'permanent-corruption': { enabled: false, mode: 'permanent' },
    'permanent-dissolve': { enabled: true, mode: 'permanent' },
    'message-swap': {enabled: true, mode: 'once', cooldownMs: COOLDOWN, },
    'permanent-decay': {enabled: true, mode: 'permanent'},
};

export const ESCALATION = {
    enabled: true,
    startChance: 0.10,
    chanceGrowthPerVisit: 0.05,
    maxChance: 0.5,
    levelsPerIncrease: 1,
    maxLevelFromVisits: 4,
}

export const JUMP_PAGES = {
    'mall': {level: 1},
    'jumpscare-404': {level: 8},
}

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
    glitchFraction: 0.35,
};

export const MESSAGE_SWAP = {
    minIntensity: 2,
    messages: ['Something has noticed you'],
    count: 1,
    minTextLength: 30,
    showMinMs: 4000,
    showMaxMs: 9000,
}

export const MASTER_SWITCH = {
    enabled: true, // ON & OFF SWITCH
    allowUrlOverride: true,
    urlParam: 'effects',
    rememberFor: 'session'
}

export const LOGGING = {
    logLevelChanges: true,
}