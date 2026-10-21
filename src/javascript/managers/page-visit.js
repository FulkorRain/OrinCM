import { stateManager } from "./state-manager.js";
import { isEffectsEnabled } from "./targets.js";
import {ESCALATION, JUMP_PAGES} from './effect-config.js';

const VISITS_KEY = 'golem_page_visits';

let fallbackStore = null;
let hasRun = false;

function _loadVisits() {
    try {
        const parsed = JSON.parse(localStorage.getItem(VISITS_KEY));
        return parsed && typeof parsed === 'object' ? parsed: {};
    } catch {
        return fallbackStore || {};
    }
}

function _saveVisits(all) {
    try {
        localStorage.setItem(VISITS_KEY, JSON.stringify(all)); 
    } catch {
        fallbackStore = all;
    }
}

function _recordVisit(pageId) {
    const all = _loadVisits();
    const old = all[pageId];
    const record = old && typeof old === 'object' ? old : {visits: 0, jumped: false};
    record.visits = (Number.isFinite(record.visits) ? record.visits : 0) + 1;
    all[pageId] = record;
    _saveVisits(all);
    return record;
}

function _markJumped(pageId) {
    const all = _loadVisits();
    if (!all[pageId]) all[pageId] = {visits: 1, jumped: false};
    all[pageId].jumped = true;
    _saveVisits(all);
}

function _applyJump(pageId, jump, record) {
    if (record.jumped) return;
    _markJumped(pageId);

    if (stateManager.isCured()) return;
    if (jump.level > stateManager.getStoredIntensity()) {
        stateManager.setIntensity(jump.level);
    }
}

function _getChance(visits) {
    if (visits < 2) return 0;
    const chance = ESCALATION.startChance + (visits - 2) * ESCALATION.chanceGrowthPerVisit;
    return Math.min(ESCALATION.maxChance, chance);
}

function _rollForEscalation(visits) {
    if (!ESCALATION.enabled) return;
    if (!isEffectsEnabled()) return;
    if (stateManager.isCured()) return;

    if (Math.random() >= _getChance(visits)) return;

    const current = stateManager.getStoredIntensity();
    if (current >= ESCALATION.maxLevelFromVisits) return;
    stateManager.setIntensity(Math.min(ESCALATION.maxLevelFromVisits, current + ESCALATION.levelsPerIncrease));
}

function runPageVisit() {
    if (hasRun) return;
    hasRun = true;

    if (!isEffectsEnabled()) return;

    const pageId = stateManager.getPageId();
    const jump = JUMP_PAGES[pageId];
    const record = _recordVisit(pageId);

    if (jump) _applyJump(pageId, jump, record);
    else _rollForEscalation(record.visits);
}

export {runPageVisit};