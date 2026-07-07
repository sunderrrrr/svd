// ======================== main.js ========================
let REGIONS = [];
let currentType = 'fiz';
let activePreset = null;
let currentCalcMode = 'connect';

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
        console.error('Region load error:', error);
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

document.addEventListener('DOMContentLoaded', function () {
    const sel = document.getElementById('calc-region');
    if (sel) sel.addEventListener('change', calcUpdate);
    initEventListeners();
});

function initEventListeners() {
    document.getElementById('type-fiz')?.addEventListener('click', () => setType('fiz'));
    document.getElementById('type-ip')?.addEventListener('click', () => setType('ip'));

    document.querySelectorAll('.preset-pill').forEach(pill => {
        pill.addEventListener('click', function () {
            const kw = parseInt(this.dataset.kw);
            setPreset(this, kw);
        });
    });

    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            setCalcMode(this.dataset.calcMode);
        });
    });

    document.querySelectorAll('.service-tab').forEach(tab => {
        tab.addEventListener('click', function () {
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
        btn.addEventListener('click', function () {
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
        btn.addEventListener('click', function (e) {
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
    acceptBtn?.addEventListener('click', function () {
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
    const resultClaim = document.getElementById('result-claim');
    const resultFiz = document.getElementById('result-fiz');
    const resultIp = document.getElementById('result-ip');
    const totalLabel = document.getElementById('total-label');

    if (mode === 'connect') {
        if (connectFields) connectFields.style.display = '';
        if (claimFields) claimFields.style.display = 'none';
        if (resultClaim) resultClaim.style.display = 'none';
        if (totalLabel) totalLabel.textContent = 'Итого ~ ';
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

        const preferential6 = reg.meter1ph;
        const preferential15 = reg.meter3phDirect;
        const construction6 = reg.rate * 6;
        const construction15 = reg.rate * 15;

        const rTariff6 = document.getElementById('r-tariff-6');
        const rTariff15 = document.getElementById('r-tariff-15');
        const rBuild6 = document.getElementById('r-build-6');
        const rBuild15 = document.getElementById('r-build-15');

        if (rTariff6) rTariff6.textContent = fmt(preferential6);
        if (rTariff15) rTariff15.textContent = fmt(preferential15);
        if (rBuild6) rBuild6.textContent = fmt(construction6);
        if (rBuild15) rBuild15.textContent = fmt(construction15);

        if (distance > 15) {
            if (activePreset === 6) {
                if (rTotal) { rTotal.textContent = '~' + fmt(construction6); rTotal.style.color = 'var(--red3)'; }
            } else if (activePreset === 15) {
                if (rTotal) { rTotal.textContent = '~' + fmt(construction15); rTotal.style.color = 'var(--red3)'; }
            } else {
                if (rTotal) rTotal.textContent = '—';
            }
            if (rHint) rHint.textContent = 'Расстояние > 15 м — строительный тариф (ставка × мощность). Точная стоимость по телефону.';
        } else {
            if (activePreset === 6) {
                if (rTotal) { rTotal.textContent = '~' + fmt(preferential6); rTotal.style.color = 'var(--red3)'; }
            } else if (activePreset === 15) {
                if (rTotal) { rTotal.textContent = '~' + fmt(preferential15); rTotal.style.color = 'var(--red3)'; }
            } else {
                if (rTotal) rTotal.textContent = '—';
            }
            if (rHint) rHint.textContent = 'Льготный тариф (≤ 15 м) — стоимость прибора учёта. Выберите мощность.';
        }
    } else {
        // IP / OOO
        if (ipBlock) ipBlock.style.display = '';

        const maxDistance = locality === 'city' ? 200 : 300;
        const rTariff150 = document.getElementById('r-tariff-150');

        if (distance < maxDistance) {
            const businessPrice = reg.businessPrice;
            if (rTariff150) rTariff150.textContent = fmt(businessPrice);
            if (rTotal) { rTotal.textContent = '~' + fmt(businessPrice); rTotal.style.color = 'var(--red3)'; }
            if (rHint) rHint.textContent = `Без строительства (расстояние < ${maxDistance} м). 150 кВт, 3 фазы.`;
        } else {
            if (rTariff150) rTariff150.textContent = 'Рассчитывается индивидуально';
            if (rTotal) { rTotal.textContent = 'По телефону'; rTotal.style.color = 'var(--text2)'; }
            if (rHint) rHint.textContent = `Расстояние ≥ ${maxDistance} м — строительный тариф. Звоните.`;
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

// Canvas lightning (unchanged)
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
// ============================================================
// МОДАЛЬНОЕ ОКНО СОГЛАСИЯ ПД С WEB3FORMS
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('pdModal');
    const closeBtn = document.getElementById('pdModalClose');
    const checkbox = document.getElementById('pdAgreeCheckbox');
    const submitBtn = document.getElementById('pdSubmitBtn');
    const fioInput = document.getElementById('pdFio');
    const phoneInput = document.getElementById('pdPhone');

    if (!modal || !closeBtn || !checkbox || !submitBtn || !fioInput || !phoneInput) {
        console.warn('PD Modal elements not found');
        return;
    }

    let pendingAction = null;

    // === ОТКРЫТИЕ ===
    window.openPdModal = function(event, action, url) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        pendingAction = { action, url };
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Сбрасываем поля
        fioInput.value = '';
        phoneInput.value = '';
        checkbox.checked = false;
        submitBtn.classList.remove('active');
        submitBtn.disabled = true;
        fioInput.classList.remove('error');
        phoneInput.classList.remove('error');
        setTimeout(() => fioInput.focus(), 300);
    };

    // === ЗАКРЫТИЕ ===
    function closePdModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        pendingAction = null;
    }

    closeBtn.addEventListener('click', closePdModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closePdModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closePdModal();
    });

    // === ВАЛИДАЦИЯ ===
    function validateFields() {
        const fio = fioInput.value.trim();
        const phone = phoneInput.value.trim();
        const isChecked = checkbox.checked;

        const fioValid = fio.length >= 4 && fio.split(' ').length >= 2;
        const phoneDigits = phone.replace(/\D/g, '');
        const phoneValid = phoneDigits.length >= 10;

        fioInput.classList.toggle('error', fio.length > 0 && !fioValid);
        phoneInput.classList.toggle('error', phone.length > 0 && !phoneValid);

        if (fioValid && phoneValid && isChecked) {
            submitBtn.classList.add('active');
            submitBtn.disabled = false;
        } else {
            submitBtn.classList.remove('active');
            submitBtn.disabled = true;
        }

        return fioValid && phoneValid && isChecked;
    }

    fioInput.addEventListener('input', validateFields);
    phoneInput.addEventListener('input', validateFields);
    checkbox.addEventListener('change', validateFields);

    // === ФОРМАТИРОВАНИЕ ТЕЛЕФОНА ===
    phoneInput.addEventListener('input', function() {
    // Удаляем все НЕ цифры
    let digits = this.value.replace(/\D/g, '');
    
    // Ограничиваем 11 цифрами (код страны + 10 цифр номера)
    if (digits.length > 11) {
        digits = digits.slice(0, 11);
    }
    
    // Если цифр нет - поле пустое
    if (digits.length === 0) {
        this.value = '';
        return;
    }
    
    // Если первая цифра не 7 или 8 - добавляем 7
    if (!['7', '8'].includes(digits[0])) {
        digits = '7' + digits;
    }
    
    // Если первая цифра 8 - заменяем на 7
    if (digits[0] === '8') {
        digits = '7' + digits.slice(1);
    }
    
    // Форматируем в красивый вид: +7 (XXX) XXX-XX-XX
    let formatted = '+7';
    
    if (digits.length > 1) {
        formatted += ' (' + digits.slice(1, 4);
    }
    if (digits.length >= 4) {
        formatted += ') ' + digits.slice(4, 7);
    }
    if (digits.length >= 7) {
        formatted += '-' + digits.slice(7, 9);
    }
    if (digits.length >= 9) {
        formatted += '-' + digits.slice(9, 11);
    }
    
    this.value = formatted;
    
    // Вызываем валидацию
    validateFields();
});

// === ФОРМАТИРОВАНИЕ ТЕЛЕФОНА ===
phoneInput.addEventListener('input', function() {
    // Сохраняем позицию курсора
    const cursorPos = this.selectionStart;
    
    // Удаляем все не-цифры
    let digits = this.value.replace(/\D/g, '');
    
    // Ограничиваем 11 цифрами
    if (digits.length > 11) {
        digits = digits.slice(0, 11);
    }
    
    // Если цифр нет — очищаем поле
    if (digits.length === 0) {
        this.value = '';
        validateFields();
        return;
    }
    
    // Если первая цифра не 7 или 8 — подставляем 7
    if (!['7', '8'].includes(digits[0])) {
        digits = '7' + digits;
    }
    
    // Если первая цифра 8 — заменяем на 7
    if (digits[0] === '8') {
        digits = '7' + digits.slice(1);
    }
    
    // Форматируем
    let formatted = '+7';
    
    if (digits.length > 1) {
        formatted += ' (' + digits.slice(1, 4);
    }
    if (digits.length >= 4) {
        formatted += ') ' + digits.slice(4, 7);
    }
    if (digits.length >= 7) {
        formatted += '-' + digits.slice(7, 9);
    }
    if (digits.length >= 9) {
        formatted += '-' + digits.slice(9, 11);
    }
    
    this.value = formatted;
    
    // Восстанавливаем позицию курсора, если она была в конце
    if (cursorPos === this.value.length || cursorPos > this.value.length) {
        this.setSelectionRange(this.value.length, this.value.length);
    } else {
        this.setSelectionRange(cursorPos, cursorPos);
    }
    
    validateFields();
});

// === ОБРАБОТКА BACKSPACE ===
phoneInput.addEventListener('keydown', function(e) {
    // Если нажат Backspace
    if (e.key === 'Backspace') {
        const cursorPos = this.selectionStart;
        const value = this.value;
        
        // Если курсор в начале — ничего не делаем
        if (cursorPos === 0) return;
        
        // Если курсор стоит на спецсимволе (скобка, дефис, пробел) — перескакиваем через него
        const charBefore = value[cursorPos - 1];
        if (['(', ')', '-', ' ', '+'].includes(charBefore)) {
            // Удаляем спецсимвол и цифру перед ним
            // Находим позицию предыдущей цифры
            let newPos = cursorPos - 1;
            while (newPos > 0 && ['(', ')', '-', ' ', '+'].includes(value[newPos - 1])) {
                newPos--;
            }
            if (newPos > 0) {
                // Удаляем символ перед курсором
                const newValue = value.slice(0, newPos - 1) + value.slice(cursorPos);
                this.value = newValue;
                this.setSelectionRange(newPos - 1, newPos - 1);
                
                // Триггерим событие input для переформатирования
                const event = new Event('input', { bubbles: true });
                this.dispatchEvent(event);
                e.preventDefault();
            }
        }
    }
});
    // === ОТПРАВКА ЧЕРЕЗ WEB3FORMS ===
    submitBtn.addEventListener('click', async function() {
        if (!validateFields()) return;
        if (!pendingAction) return;

        const fio = fioInput.value.trim();
        const phone = phoneInput.value.trim();

        try {
            const originalText = this.textContent;
            this.textContent = '⏳ Отправка...';
            this.disabled = true;

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: 'dee8bc21-8216-4b7d-b9f0-aaf8e245ef50',
                    name: fio,
                    phone: phone,
                    message: `Пользователь ${fio} с телефоном ${phone} дал согласие на обработку персональных данных.`,
                    subject: '✅ Новое согласие на обработку ПД',
                    from_name: 'Сайт Свет в Дом'
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.textContent = '✅ Отправлено!';
                this.style.background = '#00a854';

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    this.disabled = false;
                    closePdModal();

                    const { action, url } = pendingAction;
                    setTimeout(() => {
                        if (action === 'call') {
                            window.location.href = url;
                        } else if (action === 'tg') {
                            window.open(url, '_blank');
                        } else if (action === 'max') {
                            window.open(url, '_blank');
                        }
                    }, 300);
                }, 1200);
            } else {
                throw new Error(result.message || 'Ошибка отправки');
            }
        } catch (error) {
            console.error('Send error:', error);
            this.textContent = '❌ Ошибка, попробуйте ещё раз';
            this.style.background = '#cc0000';
            setTimeout(() => {
                this.textContent = 'Отправить и продолжить';
                this.style.background = '';
                this.disabled = false;
            }, 2000);
        }
    });
});