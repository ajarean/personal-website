import { projects } from './projects.js';

const IMAGE_EXTS = /\.(png|jpe?g|gif|webp|avif|svg)$/i;

const grid = document.getElementById('projects-grid');
grid.innerHTML = projects.map(p => `
    <div class="project-card">
        <div class="project-card__media">
            ${IMAGE_EXTS.test(p.video)
                ? `<img src="${p.video}" alt="${p.title}">`
                : `<video src="${p.video}" muted playsinline preload="metadata"></video>`}
        </div>
        <div class="project-card__body">
            <h3 class="project-card__title">${p.title}</h3>
            <p class="project-card__desc">${p.desc}</p>
            <a href="${p.github}" class="project-card__link" target="_blank" rel="noopener">View on GitHub &rarr;</a>
        </div>
    </div>
`).join('');

const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.setAttribute('data-theme', 'dark');
}

themeBtn.addEventListener('click', () => {
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('theme', dark ? 'light' : 'dark');
});

const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});

document.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => video.play());
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});
