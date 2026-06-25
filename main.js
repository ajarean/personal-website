const PLAYER = {
    name:       'Andy J.',
    level:      22,
    xpCurrent:  0,
    xpMax:      100,
};

async function initPlayerbar() {
    const res = await fetch('assets/playerbar.svg');
    const svgText = await res.text();
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');

    doc.getElementById('playername').querySelector('tspan').textContent = PLAYER.name;
    doc.getElementById('lv-number').querySelector('tspan').textContent  = PLAYER.level;
    doc.getElementById('xp-fraction').querySelector('tspan').textContent =
        `${PLAYER.xpCurrent}/${PLAYER.xpMax}`;

    const svg = doc.documentElement;
    svg.setAttribute('width', '400');
    svg.removeAttribute('height');

    document.querySelector('.ba-button--about').appendChild(
        document.importNode(svg, true)
    );
}
initPlayerbar();

let eyeBone = null;
let currentX = 0, currentY = 0;
let targetX = 0, targetY = 0;
const SMOOTH_FACTOR = 0.1;
let eyeTrackingEnabled = false;

const CAMERA = { x: 80, y: 830 };
const ZOOM_HEIGHT = 1250;
const aspect = window.innerWidth / window.innerHeight;
const vpHeight = ZOOM_HEIGHT;
const vpWidth = ZOOM_HEIGHT * aspect;

const showWelcome = !localStorage.getItem('visited');
if (showWelcome) localStorage.setItem('visited', '1');

const modalOverlay = document.getElementById('modal-student');
const modalWelcome = document.getElementById('modal-welcome');
const modalAbout = document.getElementById('modal-about');
const modalTitle = document.querySelector('.ba-modal__title');

function openModal(content) {
    modalWelcome.hidden = content !== 'welcome';
    modalAbout.hidden = content !== 'about';
    modalTitle.textContent = content === 'welcome' ? 'Welcome!' : 'About Me';
    modalOverlay.classList.add('open');
}

document.getElementById('btn-about').addEventListener('click', () => openModal('about'));
document.getElementById('modal-close').addEventListener('click', () => modalOverlay.classList.remove('open'));
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('open'); });

new spine.SpinePlayer("player-container", {
    skeleton: "assets/CH0284_home.skel",
    atlas: "assets/CH0284_home.atlas",
    scale: 1,
    premultipliedAlpha: false,
    alpha: true,
    backgroundColor: "#00000000",
    showControls: false,
    interactive: false,

    viewport: {
        x: CAMERA.x - vpWidth / 2,
        y: CAMERA.y - vpHeight / 2,
        width: vpWidth,
        height: vpHeight,
        clip: false
    },

    success: function(player) {
        eyeBone = player.skeleton.findBone("Touch_Eye");
        requestAnimationFrame(tickEyes);

        const skipDialog = document.getElementById('skip-dialog');
        let introPlaying = true;

        function finishIntro() {
            if (!introPlaying) return;
            introPlaying = false;
            player.animationState.setAnimation(0, 'Idle_01', true);
            eyeTrackingEnabled = true;
            document.querySelectorAll('.ui-hidden').forEach(el => el.classList.remove('ui-hidden'));
            if (showWelcome) openModal('welcome');
        }

        document.addEventListener('click', function onIntroClick() {
            if (!introPlaying) { document.removeEventListener('click', onIntroClick); return; }
            if (!skipDialog.open) skipDialog.showModal();
        });

        document.getElementById('skip-yes').addEventListener('click', (e) => {
            e.stopPropagation();
            skipDialog.close();
            finishIntro();
        });
        document.getElementById('skip-no').addEventListener('click', (e) => {
            e.stopPropagation();
            skipDialog.close();
        });

        player.animationState.addListener({
            complete: function(entry) {
                if (entry.animation.name === 'Start_Idle_01') finishIntro();
            }
        });

        player.animationState.setAnimation(0, 'Start_Idle_01', false);
    }
});

document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth * 0.50;
    const centerY = window.innerHeight * 0.40;
    const sensitivity = 2.0;
    targetX = (e.clientX - centerX) / sensitivity;
    targetY = (centerY - e.clientY) / sensitivity;
});

function tickEyes() {
    requestAnimationFrame(tickEyes);
    if (!eyeBone || !eyeTrackingEnabled) return;
    currentX += (targetX - currentX) * SMOOTH_FACTOR;
    currentY += (targetY - currentY) * SMOOTH_FACTOR;
    eyeBone.x = currentY;
    eyeBone.y = -1 * currentX;
}
