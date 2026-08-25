(function () {
  'use strict';

  var FRAMES_PER_DIRECTION = 4;   
  var FRAME_INTERVAL = 120;        
  var SPEED_MIN = 25;             
  var SPEED_MAX = 65;              
  var DIR_CHANGE_MIN = 1500;      
  var DIR_CHANGE_MAX = 4000;
  var PAUSE_CHANCE = 0.3;          
  var PAUSE_MIN = 500;          
  var PAUSE_MAX = 2000;
  var SIZE = 90;                
  var EDGE_MARGIN = 8;           

  var WANDER_MIN = 8000;        
  var WANDER_MAX = 18000;
  var GONE_MIN = 4000;          
  var GONE_MAX = 15000;
  var FIRST_APPEARANCE_MIN = 800;   
  var FIRST_APPEARANCE_MAX = 3000;
  var ENTRY_EXIT_SPREAD_DEG = 30; 
  var DIRS = [
    { name: 'east',       code: 'E',  deg: 0 },
    { name: 'south-east', code: 'SE', deg: 45 },
    { name: 'south',      code: 'S',  deg: 90 },
    { name: 'south-west', code: 'SW', deg: 135 },
    { name: 'west',       code: 'W',  deg: 180 },
    { name: 'north-west', code: 'NW', deg: 225 },
    { name: 'north',      code: 'N',  deg: 270 },
    { name: 'north-east', code: 'NE', deg: 315 }
  ];

  function getSpriteRoot() {
    var script = document.currentScript;
    if (script && script.getAttribute('data-sprite-root')) {
      var p = script.getAttribute('data-sprite-root');
      if (p.charAt(p.length - 1) !== '/') p += '/';
      return p;
    }
    return '/OrinCM/images/earwig/';
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function getDirectionForAngle(angleRad) {
    var deg = (angleRad * 180) / Math.PI;
    deg = deg % 360;
    if (deg < 0) deg += 360;
    var index = Math.round(deg / 45) % 8;
    return DIRS[index];
  }

  function buildSpriteCache(spriteRoot) {
    var cache = {};
    DIRS.forEach(function (dir) {
      var frames = [];
      for (var i = 1; i <= FRAMES_PER_DIRECTION; i++) {
        var src = spriteRoot + dir.name + '/earwig' + i + '_' + dir.code + '.png';
        var preload = new Image();
        preload.src = src;
        frames.push(src);
      }
      cache[dir.name] = frames;
    });
    return cache;
  }

  function init() {
    var spriteRoot = getSpriteRoot();
    var spriteCache = buildSpriteCache(spriteRoot);

    var bug = document.createElement('div');
    bug.className = 'earwig-bug';
    bug.setAttribute('aria-hidden', 'true');
    bug.style.width = SIZE + 'px';
    bug.style.height = SIZE + 'px';
    bug.style.visibility = 'hidden';

    var img = document.createElement('img');
    img.className = 'earwig-sprite';
    img.draggable = false;
    bug.appendChild(img);
    document.body.appendChild(bug);

    var maxX = function () { return window.innerWidth - SIZE - EDGE_MARGIN; };
    var maxY = function () { return window.innerHeight - SIZE - EDGE_MARGIN; };

    var x = 0;
    var y = 0;
    var angle = 0;
    var speed = rand(SPEED_MIN, SPEED_MAX);
    var paused = false;
    var frameIndex = 0;
    var lastFrameTime = 0;
    var lastTime = null;
    var currentDir = DIRS[0];

 
    var state = 'waiting';
    var wanderEndAt = 0;
    var directionTimerId = null;
    var pauseTimerId = null;
    var respawnTimerId = null;

    function clearWanderTimers() {
      if (directionTimerId) { clearTimeout(directionTimerId); directionTimerId = null; }
      if (pauseTimerId) { clearTimeout(pauseTimerId); pauseTimerId = null; }
      paused = false;
    }

  
    function spawnAtRandomEdge() {
      var edge = ['top', 'right', 'bottom', 'left'][Math.floor(rand(0, 4))];
      var spread = rand(-ENTRY_EXIT_SPREAD_DEG, ENTRY_EXIT_SPREAD_DEG);

      if (edge === 'top') {
        x = rand(0, Math.max(0, window.innerWidth - SIZE));
        y = -SIZE;
        angle = degToRad(90 + spread);
      } else if (edge === 'bottom') {
        x = rand(0, Math.max(0, window.innerWidth - SIZE));
        y = window.innerHeight;
        angle = degToRad(270 + spread);
      } else if (edge === 'left') {
        x = -SIZE;
        y = rand(0, Math.max(0, window.innerHeight - SIZE));
        angle = degToRad(0 + spread); 
      } else {
        x = window.innerWidth;
        y = rand(0, Math.max(0, window.innerHeight - SIZE));
        angle = degToRad(180 + spread); 
      }

      speed = rand(SPEED_MIN, SPEED_MAX);
      frameIndex = 0;
      currentDir = getDirectionForAngle(angle);
      img.src = spriteCache[currentDir.name][frameIndex];
      bug.style.visibility = 'visible';
      state = 'entering';
    }

    function scheduleFirstAppearance() {
      respawnTimerId = setTimeout(spawnAtRandomEdge, rand(FIRST_APPEARANCE_MIN, FIRST_APPEARANCE_MAX));
    }

    function scheduleRespawn() {
      bug.style.visibility = 'hidden';
      state = 'waiting';
      respawnTimerId = setTimeout(spawnAtRandomEdge, rand(GONE_MIN, GONE_MAX));
    }

    function pickNewDirection() {
      angle = rand(0, Math.PI * 2);
      speed = rand(SPEED_MIN, SPEED_MAX);
    }

    function scheduleDirectionChange() {
      var delay = rand(DIR_CHANGE_MIN, DIR_CHANGE_MAX);
      directionTimerId = setTimeout(function () {
        if (Math.random() < PAUSE_CHANCE) {
          paused = true;
          pauseTimerId = setTimeout(function () {
            paused = false;
            pickNewDirection();
            scheduleDirectionChange();
          }, rand(PAUSE_MIN, PAUSE_MAX));
        } else {
          pickNewDirection();
          scheduleDirectionChange();
        }
      }, delay);
    }

    function beginWandering() {
      state = 'wandering';
      wanderEndAt = performance.now() + rand(WANDER_MIN, WANDER_MAX);
      scheduleDirectionChange();
    }

    function beginLeaving() {
      clearWanderTimers();
      state = 'leaving';

      var distLeft = x;
      var distRight = window.innerWidth - (x + SIZE);
      var distTop = y;
      var distBottom = window.innerHeight - (y + SIZE);
      var minDist = Math.min(distLeft, distRight, distTop, distBottom);
      var spread = rand(-ENTRY_EXIT_SPREAD_DEG, ENTRY_EXIT_SPREAD_DEG);

      if (minDist === distLeft) {
        angle = degToRad(180 + spread);
      } else if (minDist === distRight) {
        angle = degToRad(0 + spread);
      } else if (minDist === distTop) {
        angle = degToRad(270 + spread);
      } else {
        angle = degToRad(90 + spread);
      }
    }

    function bounceOffEdges() {
      var bounced = false;
      var mX = maxX();
      var mY = maxY();

      if (x <= EDGE_MARGIN) {
        x = EDGE_MARGIN;
        angle = Math.PI - angle;
        bounced = true;
      } else if (x >= mX) {
        x = mX;
        angle = Math.PI - angle;
        bounced = true;
      }

      if (y <= EDGE_MARGIN) {
        y = EDGE_MARGIN;
        angle = -angle;
        bounced = true;
      } else if (y >= mY) {
        y = mY;
        angle = -angle;
        bounced = true;
      }

      if (bounced) {
        angle += rand(-0.4, 0.4);
      }
    }


    function updateSprite(timestamp) {
      var dir = getDirectionForAngle(angle);
      var changed = false;

      if (dir.name !== currentDir.name) {
        currentDir = dir;
        changed = true;
      }

      if (timestamp - lastFrameTime > FRAME_INTERVAL) {
        frameIndex = (frameIndex + 1) % FRAMES_PER_DIRECTION;
        lastFrameTime = timestamp;
        changed = true;
      }

      if (changed) {
        img.src = spriteCache[currentDir.name][frameIndex];
      }
    }

    function step(timestamp) {
      if (lastTime === null) lastTime = timestamp;
      var dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (state === 'waiting') {
        requestAnimationFrame(step);
        return;
      }

      if (!paused) {
        x += Math.cos(angle) * speed * dt;
        y += Math.sin(angle) * speed * dt;

        if (state === 'entering') {
          var fullyIn = x > EDGE_MARGIN && x < maxX() && y > EDGE_MARGIN && y < maxY();
          if (fullyIn) beginWandering();
        } else if (state === 'wandering') {
          bounceOffEdges();
          if (timestamp >= wanderEndAt) beginLeaving();
        } else if (state === 'leaving') {
          var fullyOut =
            x + SIZE < 0 || x > window.innerWidth || y + SIZE < 0 || y > window.innerHeight;
          if (fullyOut) {
            scheduleRespawn();
            requestAnimationFrame(step);
            return;
          }
        }

        updateSprite(timestamp);
      }

      bug.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    scheduleFirstAppearance();
  }

  var ENTRY_TRIGGER_PAGE = '/OrinCM/src/html/spark.html';

  function cameFromTriggerPage() {
    if (!document.referrer) return false; // no referrer = typed URL, bookmark, reload, or new tab
    try {
      var refUrl = new URL(document.referrer);
      return refUrl.pathname === ENTRY_TRIGGER_PAGE;
    } catch (e) {
      return false;
    }
  }

  if (cameFromTriggerPage()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();