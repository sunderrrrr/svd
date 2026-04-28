const REGIONS = [{ "name": "Астраханская область", "rate": 7695, "docs": 8279, "sum6kw": 46170, "sum15kw": 115425 }, { "name": "Брянская область", "rate": 8540, "docs": 14016.37, "sum6kw": 51240, "sum15kw": 128100 }, { "name": "Владимирская область", "rate": 12000, "docs": 21997.23, "sum6kw": 72000, "sum15kw": 180000 }, { "name": "Волгоградская область", "rate": 10124.56, "docs": 12628.72, "sum6kw": 60747.36, "sum15kw": 151868.4 }, { "name": "Воронежская область", "rate": 7844, "docs": 7154.9, "sum6kw": 47064, "sum15kw": 117660 }, { "name": "Ивановская область", "rate": 6522.09, "docs": 12366.98, "sum6kw": 39132.54, "sum15kw": 97831.35 }, { "name": "Казань Республика Татарстан", "rate": 7600, "docs": 33912, "sum6kw": 45600, "sum15kw": 114000 }, { "name": "Калининградская область", "rate": 12801.82, "docs": 23405.69, "sum6kw": 76810.92, "sum15kw": 192027.3 }, { "name": "Калужская область", "rate": 8740, "docs": 25098.71, "sum6kw": 52440, "sum15kw": 131100 }, { "name": "Кировская область", "rate": 7800, "docs": 25710, "sum6kw": 46800, "sum15kw": 117000 }, { "name": "Костромская область", "rate": 6522.09, "docs": 12436.31, "sum6kw": 39132.54, "sum15kw": 97831.35 }, { "name": "Краснодарский край", "rate": 11470, "docs": 17363.37, "sum6kw": 68820, "sum15kw": 172050 }, { "name": "Курская область", "rate": 9939, "docs": 18853, "sum6kw": 59634, "sum15kw": 149085 }, { "name": "Ленинградская область", "rate": 11910, "docs": 30065, "sum6kw": 71460, "sum15kw": 178650 }, { "name": "Московская область", "rate": 23859.53, "docs": 16663.41, "sum6kw": 143157.18, "sum15kw": 357892.95 }, { "name": "Нижегородская область (Дзержинск)", "rate": 9441, "docs": 19148.82, "sum6kw": 56646, "sum15kw": 141615 }, { "name": "Новосибирская область", "rate": 6522, "docs": 42322, "sum6kw": 39132, "sum15kw": 97830 }, { "name": "Омская область", "rate": 10540, "docs": 35491.79, "sum6kw": 63240, "sum15kw": 158100 }, { "name": "Оренбургская область", "rate": 6519.7, "docs": 19079.77, "sum6kw": 39118.2, "sum15kw": 97795.5 }, { "name": "Пензенская область", "rate": 8224.57, "docs": 8761.63, "sum6kw": 49347.42, "sum15kw": 123368.55 }, { "name": "Псковская область", "rate": 8635.02, "docs": 21987.13, "sum6kw": 51810.12, "sum15kw": 129525.3 }, { "name": "Республика Коми", "rate": 10000, "docs": 30393.54, "sum6kw": 60000, "sum15kw": 150000 }, { "name": "Ростовская область", "rate": 9981.25, "docs": 10710.29, "sum6kw": 59887.5, "sum15kw": 149718.75 }, { "name": "Рязанская область", "rate": 25178.99, "docs": 24827.68, "sum6kw": 151073.94, "sum15kw": 377684.85 }, { "name": "Самарская область (Тольятти)", "rate": 13039, "docs": 18799.11, "sum6kw": 78234, "sum15kw": 195585 }, { "name": "Саратовская область", "rate": 6265.82, "docs": 21702.63, "sum6kw": 37594.92, "sum15kw": 93987.3 }, { "name": "Свердловская область", "rate": 10000, "docs": 20024, "sum6kw": 60000, "sum15kw": 150000 }, { "name": "Смоленская область", "rate": 9400, "docs": 10950, "sum6kw": 56400, "sum15kw": 141000 }, { "name": "Тамбовская область", "rate": 6630.79, "docs": 9566.54, "sum6kw": 39784.74, "sum15kw": 99461.85 }, { "name": "Тверская область", "rate": 10262.39, "docs": 21434.86, "sum6kw": 61574.34, "sum15kw": 153935.85 }, { "name": "Томская область", "rate": 7378, "docs": 16766.03, "sum6kw": 44268, "sum15kw": 110670 }, { "name": "Тульская область", "rate": 10822.82, "docs": 26057.58, "sum6kw": 64936.92, "sum15kw": 162342.3 }, { "name": "Тюменская область", "rate": 6522.09, "docs": 11055, "sum6kw": 39132.54, "sum15kw": 97831.35 }, { "name": "Ульяновская область", "rate": 8471.2, "docs": 13510, "sum6kw": 50827.2, "sum15kw": 127068 }, { "name": "Уфа Республика Башкортостан", "rate": 6600, "docs": 15273.71, "sum6kw": 39600, "sum15kw": 99000 }, { "name": "Челябинская область", "rate": 13044.18, "docs": 19719.53, "sum6kw": 78265.08, "sum15kw": 195662.7 }, { "name": "Ярославская область", "rate": 8001, "docs": 18630.69, "sum6kw": 48006, "sum15kw": 120015 }, { "name": "Республика Калмыкия (Элиста)", "rate": 7227, "docs": 8324.33, "sum6kw": 43362, "sum15kw": 108405 }];

let currentType = 'fiz';
let activePreset = null;
let currentCalcMode = 'connect';

const sel = document.getElementById('calc-region');
REGIONS.forEach((r, i) => {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = r.name;
    sel.appendChild(o);
});
sel.addEventListener('change', calcUpdate);

function fmt(n) { return Math.round(n).toLocaleString('ru-RU') + ' ₽' }

function setType(t) {
    currentType = t;
    document.getElementById('type-fiz').classList.toggle('active', t === 'fiz');
    document.getElementById('type-ip').classList.toggle('active', t === 'ip');
    const p150 = document.querySelector('[data-kw="150"]');
    if (p150) p150.style.display = 'inline-flex';
    calcUpdate();
}

function setPreset(el, kw) {
    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    activePreset = kw;
    document.getElementById('calc-kw').value = kw;

    if (kw >= 150) {
        setType('ip');
    } else {
        setType('fiz');
    }
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

function setCalcMode(mode) {
    currentCalcMode = mode;
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.calcMode === mode);
    });
    const connectFields = document.getElementById('connect-fields');
    const claimFields = document.getElementById('claim-fields');
    const rowDistance = document.getElementById('row-distance');
    const rowPhase = document.getElementById('row-phase');
    const rowClaimPercent = document.getElementById('row-claim-percent');
    const totalLabel = document.getElementById('total-label');

    if (mode === 'connect') {
        connectFields.style.display = '';
        claimFields.style.display = 'none';
        rowDistance.style.display = '';
        rowPhase.style.display = '';
        rowClaimPercent.style.display = 'none';
        totalLabel.textContent = 'Итого ~ ';
    } else {
        connectFields.style.display = 'none';
        claimFields.style.display = '';
        rowDistance.style.display = 'none';
        rowPhase.style.display = 'none';
        rowClaimPercent.style.display = '';
        totalLabel.textContent = 'Примерная сумма иска ~ ';
    }
    calcUpdate();
}

document.querySelectorAll('.calc-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        setCalcMode(this.dataset.calcMode);
    });
});

function scrollToCalc(mode = 'connect') {
    setCalcMode(mode);
    const el = document.getElementById('calc');
    const navHeight = document.querySelector('nav')?.offsetHeight || 70;
    const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
}

function calcUpdate() {
    const ri = sel.value;
    const rRegion = document.getElementById('r-region');
    const rKw = document.getElementById('r-kw');
    const rRate = document.getElementById('r-rate');
    const rDistance = document.getElementById('r-distance');
    const rPhase = document.getElementById('r-phase');
    const rDuty = document.getElementById('r-duty');
    const rLawyer = document.getElementById('r-lawyer');
    const rTotal = document.getElementById('r-total');
    const rHint = document.getElementById('r-hint');
    const rClaimPercent = document.getElementById('r-claim-percent');
    const rowDistance = document.getElementById('row-distance');
    const rowPhase = document.getElementById('row-phase');

    if (ri === '') {
        rRegion.textContent = 'не выбран';
        rRegion.style.color = 'var(--text3)';
        return;
    }

    const reg = REGIONS[parseInt(ri)];
    rRegion.textContent = reg.name.length > 22 ? reg.name.substring(0, 22) + '…' : reg.name;
    rRegion.style.color = 'var(--text)';

    if (currentCalcMode === 'connect') {
        const kw = parseFloat(document.getElementById('calc-kw').value);
        const distance = parseFloat(document.getElementById('calc-distance').value) || 0;
        const phase = document.getElementById('calc-phase').value;

        if (!kw || kw <= 0) {
            rKw.textContent = '—';
            rRate.textContent = '—';
            rDistance.textContent = '—';
            rPhase.textContent = '—';
            rDuty.textContent = '—';
            rLawyer.textContent = '—';
            rTotal.textContent = '—';
            rHint.textContent = 'Введите мощность или выберите пресет.';
            return;
        }

        const baseRate = reg.rate;
        const phaseCoeff = phase === '3' ? 1.2 : 1.0;
        const effectiveRate = baseRate * phaseCoeff;
        let duty = effectiveRate * kw;
        let distanceSurcharge = 0;
        if (distance > 500) {
            distanceSurcharge = (distance - 500) * 500;
            duty += distanceSurcharge;
        }
        const lawyerFee = 0;
        const total = duty;

        rKw.textContent = kw + ' кВт';
        rRate.textContent = fmt(effectiveRate) + '/кВт';
        rDistance.textContent = distanceSurcharge > 0 ? fmt(distanceSurcharge) : '0 ₽';
        rPhase.textContent = phase === '3' ? '3 фазы (×1.2)' : '1 фаза (×1.0)';
        rDuty.textContent = fmt(duty);
        //rLawyer.textContent = fmt(lawyerFee);
        rTotal.textContent = '~' + fmt(total);
        rHint.textContent = 'Госпошлина + услуги юриста. Точная сумма после консультации. Оплата в 3 этапа.';
        rTotal.style.color = 'var(--red3)';
        rClaimPercent.textContent = '—';
    } else {
        const kw = parseFloat(document.getElementById('claim-kw').value);
        if (!kw || kw <= 0) {
            rKw.textContent = '—';
            rRate.textContent = '—';
            rDistance.textContent = '—';
            rPhase.textContent = '—';
            rDuty.textContent = '—';
            rLawyer.textContent = '—';
            rTotal.textContent = '—';
            rClaimPercent.textContent = '—';
            rHint.textContent = 'Введите мощность объекта для оценки суммы иска.';
            return;
        }
        const baseRate = reg.rate;
        const estimatedDuty = baseRate * kw;
        let percent = 0.2;
        if (document.getElementById('claim-violation').value === 'delay') percent = 0.15;
        if (document.getElementById('claim-violation').value === 'refusal') percent = 0.25;
        const claimAmount = estimatedDuty * percent;

        rKw.textContent = kw + ' кВт';
        rRate.textContent = fmt(baseRate) + '/кВт';
        rDuty.textContent = fmt(estimatedDuty);
        rLawyer.textContent = 'от ' + fmt(claimAmount * 0.3);
        rClaimPercent.textContent = (percent * 100).toFixed(0) + '%';
        rTotal.textContent = '~' + fmt(claimAmount);
        rHint.textContent = 'Ориентировочная сумма иска. Точный расчёт после консультации.';
        rTotal.style.color = 'var(--red3)';
        rowDistance.style.display = 'none';
        rowPhase.style.display = 'none';
    }
}

const canvas = document.getElementById('lightning-canvas');
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

(function () {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('cookieAcceptBtn');

    const cookieAccepted = localStorage.getItem('cookieConsentAccepted');

    if (cookieAccepted === 'true') {
        cookieConsent.style.display = 'none';
    }

    acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookieConsentAccepted', 'true');
        cookieConsent.classList.add('hide');
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 400);
    });

    if (cookieAccepted !== 'true') {
        cookieConsent.style.display = 'block';
    }
})();

// Якорные кнопки: скролл к услугам с включением нужной вкладки
document.querySelectorAll('.hero-anchor-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const targetGridId = this.dataset.scrollTo; // 'services-fiz' или 'services-ur'
    const tabTarget = targetGridId === 'services-fiz' ? 'fiz' : 'ur';

    // Находим кнопку таба и программно кликаем по ней
    const tabBtn = document.querySelector(`.service-tab[data-tab="${tabTarget}"]`);
    if (tabBtn) {
      tabBtn.click();
    }

    // Скроллим к конкретной сетке услуг
    const gridElement = document.getElementById(targetGridId);
    if (gridElement) {
      const navHeight = document.querySelector('nav')?.offsetHeight || 70;
      const top = gridElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 30;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});