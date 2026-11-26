import { TARGETS, LIMITS, BANNER } from './effect-config.js';
import { isEffectsEnabled, pickRandom } from './targets.js';


const VARIANT = {
    NORMAL: 'normal',
    CORRUPT: 'corrupt',
    SPECIAL: 'special'
};

const banners = [];
const seen = new WeakSet();

function _deriveCorruptSrc(normalSrc) {
    const derived = normalSrc.replace(/(\.[a-z0-9]+)(\?.*)?$/i, `${BANNER.corruptSuffix}$1$2`);
    return derived === normalSrc ? null : derived;
}

function _buildBanner(element) {
    const img = element.querySelector('img');
    const normalSrc = img ? img.getAttribute('src') : null;
    if (!normalSrc) return null;

    img.removeAttribute('srcset');

    let stage = element.querySelector(`.${BANNER.stageClass}`);
    if (!stage) {
        stage = document.createElement('div');
        stage.className = BANNER.stageClass;
        img.parentNode.insertBefore(stage, img);
        stage.appendChild(img);
    }

    return {
        element, img, stage, 
        sources:{
            normal: normalSrc,
            corrupt: element.dataset.bannerCorrupt || _deriveCorruptSrc(normalSrc),
            special: element.dataset.bannerSpecial || BANNER.specialSrc
        },
        ready: {},
        loading: {},
        base: VARIANT.NORMAL,
        current: VARIANT.NORMAL
    };
}

function ensureReady(banner, variant) {
    if (variant === VARIANT.NORMAL) return Promise.resolve(true);

    const src = banner.sources[variant];
    if (!src) return Promise.resolve(false);

    if (!banner.loading[variant]) {
        banner.loading[variant] = new Promise(resolve => {
            const probe = new Image();
            probe.onload = () => {
                banner.ready[variant] = true;
                resolve(true);
            };
            probe.onerror = () => {
                console.warn (`could not load the ${variant} image: ${src}`);
                resolve(false);
            };
            probe.src = src;
        });
    }
    return banner.loading[variant];
}

function canShow(banner, variant) {
    return variant === VARIANT.NORMAL || banner.ready[variant] === true;
}

function showVariant(banner, variant) {
    if (!canShow(banner, variant)) return false;
    if (banner.current === variant) return true;

    banner.img.src = banner.sources[variant];
    banner.current = variant;
    banner.element.dataset.bannerVariant = variant;
    return true;
}

function restoreBase(banner) {
    return showVariant(banner, banner.base);
}

function setBase(banner, variant) {
    return ensureReady(banner, variant).then(ok => {
        if (!ok) return false;
        banner.base = variant;
        showVariant(banner, variant);
        return true;
    });
}

function resetAllBanners() {
    banners.forEach(banner => {
        banner.base = VARIANT.NORMAL;
        showVariant(banner, VARIANT.NORMAL);
    });
}

function _scan() {
    document.querySelectorAll(BANNER.selector).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);

        const banner = _buildBanner(el);
        if (!banner) return;

        banners.push(banner);
        ensureReady(banner, VARIANT.CORRUPT);
        ensureReady(banner, VARIANT.SPECIAL);
    });

    for (let i = banners.length - 1; i >= 0; i--) {
        if (!banners[i].element.isConnected) banners.splice(i, 1);
    }
}

function getBannerTargets({max = Infinity, filter = null} = {}) {
    if (!isEffectsEnabled()) return [];
    _scan();

    let list = banners.filter(banner => !banner.element.closest(TARGETS.exclude));
    if (filter) list = list.filter(filter);
    if (list.length > max) list = pickRandom(list, max);
    return list;
}

export {
    VARIANT,
    getBannerTargets,
    canShow,
    showVariant,
    restoreBase,
    setBase,
    resetAllBanners
};