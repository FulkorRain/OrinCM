import { stateManager } from "../managers/state-manager.js";
import { gsap } from "gsap";

const BUG_IMAGE_URL = "/src/assets/images/cockroach.webp";
const BUG_SIZE = 250;
const BUG_SIZE_MOBILE = 100;

const PIXELS_PER_SECOND = 300;
const TURN_SPEED = 0.25;

const STEP_MULTIPLIER_MIN = 1.0;
const STEP_MULTIPLIER_MAX = 3.0;

const BASE_DURATION_MS = 3000;
const MAX_DURATION_MS = 18000;

const IMAGE_FACING_OFFSET = 90;

const isMobile = window.innerWidth < 768;
const bugSize = isMobile ? BUG_SIZE_MOBILE : BUG_SIZE;

let isActive = false;
let bugElement = null;
let deathTimer = null;
let currentAngle = 0;
let bugTimeline = null;

function _angleTo(fromX, fromY, toX, toY) {
  return Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
}

function _shortestRotation(current, target) {
  let delta = target - current;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return current + delta;
}

function _spawnBug() {
  currentAngle = 0;
  const bug = document.createElement("img");
  bug.src = BUG_IMAGE_URL;
  
  bug.onerror = () => console.error("failed to load bug gif");
  
  bug.style.cssText = `
  position: fixed;
  width: ${bugSize}px;
  height: auto;
  z-index: 99999;
  pointer-events: none;
  opacity: 0;
  transform-origin: center center;
  `;
  document.body.appendChild(bug);
  bugElement = bug;
  
  gsap.set(bug, {
    left: Math.random() * (window.innerWidth - bugSize),
    top: Math.random() * (window.innerHeight - bugSize),
    xPercent: 0,
    yPercent: 0,
    force3D: false,
  });
  
  gsap.to(bug, { opacity: 1, duration: 0.3, onComplete: _wander });  
}

function _wander() {
  if (!bugElement) return;
  const fromX = gsap.getProperty(bugElement, "left");
  const fromY = gsap.getProperty(bugElement, "top");
  
  const stepMultiplier = STEP_MULTIPLIER_MIN + Math.random() * (STEP_MULTIPLIER_MAX - STEP_MULTIPLIER_MIN);
  const stepSize = bugSize * stepMultiplier;

  const radians = Math.random() * Math.PI * 2;
  
  const toX = Math.min(
    window.innerWidth - bugSize,
    Math.max(0, fromX + Math.cos(radians) * stepSize),
  );
  const toY = Math.min(
    window.innerHeight - bugSize,
    Math.max(0, fromY + Math.sin(radians) * stepSize),
  );
  
  const actualDistance = Math.hypot(toX - fromX, toY - fromY);
  const travelDuration = Math.max(0.3, actualDistance / PIXELS_PER_SECOND);

  const targetAngle = _angleTo(fromX, fromY, toX, toY) + IMAGE_FACING_OFFSET;
  const smoothAngle = _shortestRotation(currentAngle, targetAngle);
  currentAngle = smoothAngle;

  if (bugTimeline) bugTimeline.kill();

  bugTimeline = gsap.timeline({onComplete: _wander});
  
  bugTimeline.to(bugElement, {
    rotation: smoothAngle,
    duration: TURN_SPEED,
    ease: "power2.out",
  });

  bugTimeline.to(bugElement, {
    left: toX,
    top: toY,
    duration: travelDuration,
    ease: "none",
  });
}

function _killBug(immediate = false) {
  if (bugTimeline) {
    bugTimeline.kill();
    bugTimeline = null;
  }
  clearTimeout(deathTimer);
  deathTimer = null;
  
  if (!bugElement) return;
  
  if (immediate) {
    bugElement.remove();
    bugElement = null;
  } else {
    gsap.to(bugElement, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        if (bugElement) {
          bugElement.remove();
          bugElement = null;
        }
        document.dispatchEvent(
          new CustomEvent("effect-ended", {
            detail: { id: "bug-crawl" },
          }),
        );
      },
    });
  }
}

function bugCrawl() {
  
  if (bugElement && !isActive) {
    _killBug(true);
    return false;
  }
  isActive = !isActive;
  
  if (!isActive)  {
    _killBug(true);
    return isActive;
  }
  
  const intensity = stateManager.getIntensity();
  const duration = BASE_DURATION_MS + ((intensity - 1) / 9) * (MAX_DURATION_MS - BASE_DURATION_MS);
  
  _spawnBug();
  
  deathTimer = setTimeout(() => {
    isActive = false;
    _killBug(false);
  }, duration);
  
  return isActive;
}

bugCrawl.isActive = () => isActive;
export { bugCrawl };
