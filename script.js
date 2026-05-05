let REGIONS = [];
let currentType = 'fiz';
let activePreset = null;
let currentCalcMode = 'connect';

// Загрузка регионов из JSON
fetch('regions.json')
    .then(response => response.json())
    .then(data => {
        REGIONS = data;
        populateRegionSelect();
        if (document.getElementById('calc-region').value !== '') {
            calcUpdate();
        }
    })
    .catch(error => {
        console.error('Ошибка загрузки регионов:', error);
        document.getElementById('calc-region').innerHTML = '<option value="">Ошибка загрузки</option>';
    });

function populateRegionSelect() {
    const sel = document.getElementById('calc-region');
    sel.innerHTML = '<option value="">Выберите регион</option>';
    REGIONS.forEach((r, i) => {
        const o = document.createElement('option');
        o.value = i;
        o.textContent = r.name;
        sel.appendChild(o);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const sel = document.getElementById('calc-region');
    if (sel) sel.addEventListener('change', calcUpdate);
    initEventListeners();
});

function initEventListeners() {
    document.getElementById('type-fiz')?.addEventListener('click', () => setType('fiz'));
    document.getElementById('type-ip')?.addEventListener('click', () => setType('ip'));

    document.querySelectorAll('.preset-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            const kw = parseInt(this.dataset.kw);
            setPreset(this, kw);
        });
    });

    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            setCalcMode(this.dataset.calcMode);
        });
    });

    document.querySelectorAll('.service-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const fizGrid = document.getElementById('services-fiz');
            const urGrid = document.getElementById('services-ur');
            if (target === 'fiz') {
                fizGrid.style.display = '';
                urGrid.style.display = 'none';
                triggerServiceAnimation('services-fiz');
                setType('fiz');
            } else {
                fizGrid.style.display = 'none';
                urGrid.style.display = '';
                triggerServiceAnimation('services-ur');
                setType('ip');
            }
        });
    });

    document.querySelectorAll('.hero-anchor-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetGridId = this.dataset.scrollTo;
            const tabTarget = targetGridId === 'services-fiz' ? 'fiz' : 'ur';
            const tabBtn = document.querySelector(`.service-tab[data-tab="${tabTarget}"]`);
            if (tabBtn) tabBtn.click();
            const gridElement = document.getElementById(targetGridId);
            if (gridElement) {
                const navHeight = document.querySelector('nav')?.offsetHeight || 70;
                const top = gridElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 200;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            setCalcMode('connect');
           
        });
    });

    document.querySelectorAll('.service-cta-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#calc-containter') {
                e.preventDefault();
                const onclickAttr = this.getAttribute('onclick');
                if (onclickAttr && onclickAttr.includes('claim')) {
                    scrollToCalc('claim');
                } else {
                    scrollToCalc('connect');
                }
            }
        });
    });

    document.getElementById('calc-distance')?.addEventListener('input', calcUpdate);
    document.getElementById('calc-locality')?.addEventListener('change', calcUpdate);

    document.getElementById('claim-contract-date')?.addEventListener('input', calcUpdate);
    document.getElementById('claim-paid-amount')?.addEventListener('input', calcUpdate);
    document.getElementById('claim-calc-date')?.addEventListener('input', calcUpdate);

    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const cookieAccepted = localStorage.getItem('cookieConsentAccepted');
    if (cookieAccepted === 'true' && cookieConsent) cookieConsent.style.display = 'none';
    acceptBtn?.addEventListener('click', function() {
        localStorage.setItem('cookieConsentAccepted', 'true');
        cookieConsent?.classList.add('hide');
        setTimeout(() => { if (cookieConsent) cookieConsent.style.display = 'none'; }, 400);
    });
}

function fmt(n) { return Math.round(n).toLocaleString('ru-RU') + ' ₽'; }

function setType(t) {
    currentType = t;
    document.getElementById('type-fiz')?.classList.toggle('active', t === 'fiz');
    document.getElementById('type-ip')?.classList.toggle('active', t === 'ip');
    
    const fizPresets = document.getElementById('preset-pills-fiz');
    const ipPresets = document.getElementById('preset-pills-ip');
    if (fizPresets) fizPresets.style.display = t === 'fiz' ? '' : 'none';
    if (ipPresets) ipPresets.style.display = t === 'ip' ? '' : 'none';
    
    clearPreset();
    calcUpdate();
}

function setPreset(el, kw) {
    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    activePreset = kw;
    calcUpdate();
}

function clearPreset() {
    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    activePreset = null;
}

function triggerServiceAnimation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cards = container.querySelectorAll('.service-card');
    if (!cards.length) return;
    cards.forEach(card => {
        card.classList.remove('visible');
        card.style.transition = 'none';
    });
    container.offsetHeight;
    cards.forEach((card, i) => {
        card.style.transition = '';
        card.style.transitionDelay = (i * 0.1) + 's';
    });
    requestAnimationFrame(() => {
        cards.forEach(card => card.classList.add('visible'));
    });
}
function setCalcMode(mode) {
    currentCalcMode = mode;
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.calcMode === mode);
    });
    
    const connectFields = document.getElementById('connect-fields');
    const claimFields = document.getElementById('claim-fields');
    const resultConnect = document.getElementById('result-connect');
    const resultClaim = document.getElementById('result-claim');
    const resultFiz = document.getElementById('result-fiz');
    const resultIp = document.getElementById('result-ip');
    const totalLabel = document.getElementById('total-label');

    if (mode === 'connect') {
        if (connectFields) connectFields.style.display = '';
        if (claimFields) claimFields.style.display = 'none';
        if (resultClaim) resultClaim.style.display = 'none';
        // resultFiz/resultIp показываются в calcConnect
        if (totalLabel) totalLabel.textContent = 'Итого ~ ';
        // Обновляем видимость result-fiz/result-ip
        if (resultFiz) resultFiz.style.display = currentType === 'fiz' ? '' : 'none';
        if (resultIp) resultIp.style.display = currentType === 'ip' ? '' : 'none';
    } else {
        if (connectFields) connectFields.style.display = 'none';
        if (claimFields) claimFields.style.display = '';
        if (resultFiz) resultFiz.style.display = 'none';
        if (resultIp) resultIp.style.display = 'none';
        if (resultClaim) resultClaim.style.display = '';
        if (totalLabel) totalLabel.textContent = 'К взысканию ~ ';
    }
    calcUpdate();
}
function scrollToCalc(mode = 'connect') {
    setCalcMode(mode);
    const el = document.getElementById('calc');
    const navHeight = document.querySelector('nav')?.offsetHeight || 70;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
}

function calcUpdate() {
    const ri = document.getElementById('calc-region')?.value;
    const rRegion = document.getElementById('r-region');
    const rHint = document.getElementById('r-hint');

    if (!ri || ri === '') {
        if (rRegion) {
            rRegion.textContent = 'не выбран';
            rRegion.style.color = 'var(--text3)';
        }
        clearResults();
        return;
    }

    const reg = REGIONS[parseInt(ri)];
    if (!reg) return;
    
    if (rRegion) {
        rRegion.textContent = reg.name.length > 22 ? reg.name.substring(0, 22) + '…' : reg.name;
        rRegion.style.color = 'var(--text)';
    }

    if (currentCalcMode === 'connect') {
        calcConnect(reg);
    } else {
        calcClaim();
    }
}

function clearResults() {
    const ids = ['r-tariff-6', 'r-tariff-15', 'r-tariff-150-build', 'r-tariff-150-nobuild',
                 'r-distance', 'r-locality', 'r-total', 'r-claim-penalty', 'r-claim-moral', 'r-claim-fine'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
    });
    const rHint = document.getElementById('r-hint');
    if (rHint) rHint.textContent = 'Выберите регион и пресет мощности для расчёта.';
}

function calcConnect(reg) {
    const distance = parseFloat(document.getElementById('calc-distance')?.value) || 0;
    const locality = document.getElementById('calc-locality')?.value || 'city';
    const rDistance = document.getElementById('r-distance');
    const rLocality = document.getElementById('r-locality');
    const rTotal = document.getElementById('r-total');
    const rHint = document.getElementById('r-hint');
    const fizBlock = document.getElementById('result-fiz');
    const ipBlock = document.getElementById('result-ip');

    if (rDistance) rDistance.textContent = distance + ' м';
    if (rLocality) rLocality.textContent = locality === 'city' ? 'Город' : 'Село';

    if (fizBlock) fizBlock.style.display = 'none';
    if (ipBlock) ipBlock.style.display = 'none';

    if (currentType === 'fiz') {
        if (fizBlock) fizBlock.style.display = '';

        // Льготный тариф — значения ПУ
        const льготный6 = reg.meter1ph;
        const льготный15 = reg.meter3phDirect;
        
        // Строительный тариф — ставка × мощность
        const стройка6 = reg.rate * 6;
        const стройка15 = reg.rate * 15;

        const rTariff6 = document.getElementById('r-tariff-6');
        const rTariff15 = document.getElementById('r-tariff-15');
        const rBuild6 = document.getElementById('r-build-6');
        const rBuild15 = document.getElementById('r-build-15');

        if (rTariff6) rTariff6.textContent = fmt(льготный6);
        if (rTariff15) rTariff15.textContent = fmt(льготный15);
        if (rBuild6) rBuild6.textContent = fmt(стройка6);
        if (rBuild15) rBuild15.textContent = fmt(стройка15);

        if (distance > 15) {
            // Строительный тариф
            if (activePreset === 6) {
                if (rTotal) { rTotal.textContent = '~' + fmt(стройка6); rTotal.style.color = 'var(--red3)'; }
            } else if (activePreset === 15) {
                if (rTotal) { rTotal.textContent = '~' + fmt(стройка15); rTotal.style.color = 'var(--red3)'; }
            } else {
                if (rTotal) rTotal.textContent = '—';
            }
            if (rHint) rHint.textContent = 'Расстояние > 15 м — строительный тариф (ставка × мощность). Точная стоимость по телефону.';
        } else {
            // Льготный тариф
            if (activePreset === 6) {
                if (rTotal) { rTotal.textContent = '~' + fmt(льготный6); rTotal.style.color = 'var(--red3)'; }
            } else if (activePreset === 15) {
                if (rTotal) { rTotal.textContent = '~' + fmt(льготный15); rTotal.style.color = 'var(--red3)'; }
            } else {
                if (rTotal) rTotal.textContent = '—';
            }
            if (rHint) rHint.textContent = 'Льготный тариф (≤ 15 м) — стоимость прибора учёта. Выберите мощность.';
        }
    } else {
        // ИП/ООО
        if (ipBlock) ipBlock.style.display = '';

        const maxDistance = locality === 'city' ? 200 : 300;
        
        if (distance <= maxDistance) {
            // Без строительства — ПУ из последней колонки
            const tariff150 = reg.meter3phSemiIndirect;
            const rTariff150 = document.getElementById('r-tariff-150');
            if (rTariff150) rTariff150.textContent = fmt(tariff150);
            if (rTotal) { rTotal.textContent = '~' + fmt(tariff150); rTotal.style.color = 'var(--red3)'; }
            if (rHint) rHint.textContent = `Без строительства (≤ ${maxDistance} м). 150 кВт, 3 фазы.`;
        } else {
            // Со строительством — ставка × мощность
            const tariff150 = reg.rate * 150;
            const rTariff150 = document.getElementById('r-tariff-150');
            if (rTariff150) rTariff150.textContent = fmt(tariff150);
            if (rTotal) { rTotal.textContent = '~' + fmt(tariff150); rTotal.style.color = 'var(--red3)'; }
            if (rHint) rHint.textContent = `Со строительством (> ${maxDistance} м). Ставка × 150 кВт. Точная стоимость по телефону.`;
        }
    }
}

function calcClaim() {
    const contractDateStr = document.getElementById('claim-contract-date')?.value;
    const paidAmount = parseFloat(document.getElementById('claim-paid-amount')?.value) || 0;
    const calcDateStr = document.getElementById('claim-calc-date')?.value;
    const rClaimPenalty = document.getElementById('r-claim-penalty');
    const rClaimMoral = document.getElementById('r-claim-moral');
    const rClaimFine = document.getElementById('r-claim-fine');
    const rTotal = document.getElementById('r-total');
    const rHint = document.getElementById('r-hint');
    const rPaid = document.getElementById('r-paid');
    const rOverdue = document.getElementById('r-overdue');

    if (!contractDateStr || !calcDateStr || paidAmount <= 0) {
        if (rClaimPenalty) rClaimPenalty.textContent = '—';
        if (rClaimMoral) rClaimMoral.textContent = '—';
        if (rClaimFine) rClaimFine.textContent = '—';
        if (rTotal) rTotal.textContent = '—';
        if (rHint) rHint.textContent = 'Заполните дату заключения договора, сумму и дату расчёта.';
        return;
    }

    const contractDate = new Date(contractDateStr);
    const firstDayDefault = new Date(contractDate);
    firstDayDefault.setDate(firstDayDefault.getDate() + 180);
    const calcDate = new Date(calcDateStr);
    const overdueDays = Math.max(0, Math.floor((calcDate - firstDayDefault) / (1000 * 60 * 60 * 24)));

    if (rPaid) rPaid.textContent = fmt(paidAmount);
    if (rOverdue) rOverdue.textContent = overdueDays + ' дн.';

    if (currentType === 'ip') {
        const penalty = (paidAmount * 0.0025) * (overdueDays + 60);
        if (rClaimPenalty) rClaimPenalty.textContent = fmt(penalty);
        if (rClaimMoral) rClaimMoral.textContent = 'не взыскивается';
        if (rClaimFine) rClaimFine.textContent = 'не взыскивается';
        if (rTotal) { rTotal.textContent = '~' + fmt(penalty); rTotal.style.color = 'var(--red3)'; }
        if (rHint) rHint.textContent = 'Штраф: 0,25% × ' + fmt(paidAmount) + ' × (' + overdueDays + ' + 60) дн.';
    } else {
        const penalty = (paidAmount * 0.0025) * (overdueDays + 60);
        const moralHarm = 5000;
        const consumerFine = (penalty + moralHarm) / 2;
        const totalClaim = penalty + moralHarm + consumerFine;
        if (rClaimPenalty) rClaimPenalty.textContent = fmt(penalty);
        if (rClaimMoral) rClaimMoral.textContent = fmt(moralHarm);
        if (rClaimFine) rClaimFine.textContent = fmt(consumerFine);
        if (rTotal) { rTotal.textContent = '~' + fmt(totalClaim); rTotal.style.color = 'var(--red3)'; }
        if (rHint) rHint.textContent = 'Штраф: 0,25% × ' + fmt(paidAmount) + ' × (' + overdueDays + ' + 60) дн. + моральный вред + потреб. штраф.';
    }
}

// Canvas animation
const canvas = document.getElementById('lightning-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    let bolts = [];
    let lastBolt = 0;
    function randomBolt() {
        const startX = Math.random() * canvas.width;
        const startY = 0;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = Math.random() * canvas.height * 0.7;
        const segments = [];
        let x = startX, y = startY;
        const steps = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i < steps; i++) {
            const nx = x + (endX - startX) / steps + (Math.random() - 0.5) * 60;
            const ny = y + (endY - startY) / steps;
            segments.push({ x1: x, y1: y, x2: nx, y2: ny });
            x = nx; y = ny;
        }
        return { segments, life: 1, decay: 0.08 + Math.random() * 0.06 };
    }
    function drawLightning(ts) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (ts - lastBolt > 2000 + Math.random() * 3000) {
            bolts.push(randomBolt());
            if (Math.random() > 0.5) bolts.push(randomBolt());
            lastBolt = ts;
        }
        bolts = bolts.filter(b => {
            b.life -= b.decay;
            if (b.life <= 0) return false;
            b.segments.forEach(s => {
                ctx.beginPath();
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
                ctx.strokeStyle = `rgba(255,80,100,${b.life * 0.7})`;
                ctx.lineWidth = b.life * 1.5;
                ctx.shadowBlur = 12;
                ctx.shadowColor = `rgba(192,0,30,${b.life * 0.5})`;
                ctx.stroke();
            });
            return true;
        });
        requestAnimationFrame(drawLightning);
    }
    requestAnimationFrame(drawLightning);
}

// Intersection Observer
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

document.querySelectorAll('.services-grid, .steps-track, .why-grid, .pricing-grid').forEach(g => {
    Array.from(g.children).forEach((c, i) => {
        c.style.transitionDelay = (i * 0.1) + 's';
    });
});