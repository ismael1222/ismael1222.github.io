
/* ========== CONFIG - cambia esto por tu JSON en GitHub Pages ========== */
let JSON_URL = ''; // <<-- pega tu URL aquí si quieres
/* ==================================================================== */

const topA = document.getElementById('cardA');
const topB = document.getElementById('cardB');
const imgA = document.getElementById('imgA');
const imgB = document.getElementById('imgB');
const nameA = document.getElementById('nameA');
const nameB = document.getElementById('nameB');
const subA = document.getElementById('subA');
const subB = document.getElementById('subB');
const statusEl = document.getElementById('status');
const mapEl = document.getElementById('map');
const roundInfo = document.getElementById('roundInfo');
const remainingInfo = document.getElementById('remainingInfo');
const restartBtn = document.getElementById('restart');
const exportBtn = document.getElementById('export');
const example = document.getElementById('example');
const exportBox = document.getElementById('exportBox');
const exportData = document.getElementById('exportData');

let originalPlayers = [];
let totalRoundsNeeded = 1;

// Rounds structure: array of rounds; each round = { pairs: [ { players:[p1,p2?], winnerIndex:null/0/1, auto:false } ] }
// We'll keep track of currentRoundIndex and currentPairIndex to show the top pair.
let rounds = [];
let currentRoundIndex = 0;
let currentPairIndex = 0;

// UTIL: load players JSON
function fetchPlayers(url) {
    statusEl.textContent = 'Cargando personajes...';
    return fetch(url).then(r => {
        if (!r.ok) throw new Error('Fetch error ' + r.status);
        return r.json();
    }).then(arr => {
        if (!Array.isArray(arr)) throw new Error('JSON debe ser un array');
        return arr.map((p, i) => ({
            name: p.name ?? ('Jugador ' + (i + 1)),
            imageURL: p.imageURL ?? p.image ?? 'https://placehold.co/120?text=No+Image'
        }));
    });
}

function computeTotalRounds(n) {
    if (n <= 1) return 0;
    return Math.ceil(Math.log2(n));
}

function makeInitialRound(players) {
    const pairs = [];
    for (let i = 0; i < players.length; i += 2) {
        const a = players[i];
        const b = players[i + 1];
        const pair = { players: [a, b], winnerIndex: null, auto: false };
        if (!b) { pair.winnerIndex = 0; pair.auto = true; }
        pairs.push(pair);
    }
    return { pairs };
}

function startTournament(players) {
    originalPlayers = players.slice();
    totalRoundsNeeded = computeTotalRounds(originalPlayers.length);
    rounds = [];
    rounds.push(makeInitialRound(originalPlayers));
    currentRoundIndex = 0;
    currentPairIndex = 0;
    // auto advance any auto-winners within initial round (mark them visually)
    // but top area should skip pairs that are auto-advanced
    renderAll();
    autoAdvanceWhilePossible(); // may create next rounds if needed
    renderAll();
}

function autoAdvanceWhilePossible() {
    // While last round has all winners decided and produces >1 winners, create next round
    while (true) {
        const last = rounds[rounds.length - 1];
        const allDecided = last.pairs.every(p => p.winnerIndex !== null);
        if (!allDecided) break;
        const winners = last.pairs.map(p => p.players[p.winnerIndex]).filter(Boolean);
        if (winners.length <= 1) break;
        const next = { pairs: [] };
        for (let i = 0; i < winners.length; i += 2) {
            const a = winners[i];
            const b = winners[i + 1];
            const pair = { players: [a, b], winnerIndex: null, auto: false };
            if (!b) { pair.winnerIndex = 0; pair.auto = true; }
            next.pairs.push(pair);
        }
        rounds.push(next);
    }
}

// Renders the top "Would You Rather" area according to currentRoundIndex/currentPairIndex
function renderTop() {
    // find next interactive pair in current round (skip pairs with auto=true)
    const round = rounds[currentRoundIndex];
    if (!round) {
        topA.classList.add('dim'); topB.classList.add('dim');
        nameA.textContent = '—'; nameB.textContent = '—';
        imgA.src = imgB.src = 'https://placehold.co/800?text=-';
        subA.textContent = subB.textContent = '';
        return;
    }
    // advance currentPairIndex until we find pair not decided and not auto, or until end
    while (currentPairIndex < round.pairs.length) {
        const p = round.pairs[currentPairIndex];
        if (p.winnerIndex === null && !p.auto) break;
        currentPairIndex++;
    }
    if (currentPairIndex >= round.pairs.length) {
        // this round is finished (or only had auto pairs). If finished, we should prepare next round
        // but ui top should show a placeholder while creating next round
        nameA.textContent = 'Esperando...';
        nameB.textContent = 'Finalizando ronda';
        imgA.src = imgB.src = 'https://placehold.co/800?text=...';
        subA.textContent = subB.textContent = '';
        topA.classList.add('dim'); topB.classList.add('dim');
        // trigger end-of-round processing (if not already)
        setTimeout(() => {
            // create next round winners and push
            const allDecided = round.pairs.every(p => p.winnerIndex !== null);
            if (allDecided) {
                const winners = round.pairs.map(p => p.players[p.winnerIndex]).filter(Boolean);
                if (winners.length === 1) {
                    // tournament final winner established
                    renderAll();
                    return;
                }
                const next = { pairs: [] };
                for (let i = 0; i < winners.length; i += 2) {
                    const a = winners[i];
                    const b = winners[i + 1];
                    const pair = { players: [a, b], winnerIndex: null, auto: false };
                    if (!b) { pair.winnerIndex = 0; pair.auto = true; }
                    next.pairs.push(pair);
                }
                // increment round index / reset pair index
                rounds.push(next);
                currentRoundIndex++;
                currentPairIndex = 0;
                autoAdvanceWhilePossible();
                renderAll();
            } else {
                // nothing — probably waiting because some async auto-advances
                renderAll();
            }
        }, 300);
        return;
    }

    const pair = round.pairs[currentPairIndex];
    // safety if pair.players[1] missing but auto is false (shouldn't happen), show placeholder
    const a = pair.players[0] ?? { name: '(vacío)', imageURL: 'https://placehold.co/800?text==-' };
    const b = pair.players[1] ?? { name: '(vacío)', imageURL: 'https://placehold.co/800?text==-' };

    imgA.src = a.imageURL; imgB.src = b.imageURL;
    nameA.textContent = a.name; nameB.textContent = b.name;
    subA.textContent = 'Seleccione si prefiere este';
    subB.textContent = 'Seleccione si prefiere este';
    topA.classList.remove('dim'); topB.classList.remove('dim');
}

// Renders the full bracket/map below
function renderMap() {
    mapEl.innerHTML = '';
    rounds.forEach((r, idx) => {
        const rd = document.createElement('div'); rd.className = 'round';
        const h = document.createElement('h2'); h.textContent = 'Ronda ' + (idx + 1);
        rd.appendChild(h);
        const pairsWrap = document.createElement('div'); pairsWrap.className = 'pairs';
        r.pairs.forEach((p, pIdx) => {
            const pairEl = document.createElement('div'); pairEl.className = 'pair';
            for (let s = 0; s < 2; s++) {
                const pl = p.players[s];
                const plEl = document.createElement('div'); plEl.className = 'playerSmall';
                const img = document.createElement('img'); img.src = pl ? pl.imageURL : 'https://placehold.co/800?text==-';
                const meta = document.createElement('div'); meta.className = 'meta';
                const nm = document.createElement('div'); nm.className = 'name'; nm.textContent = pl ? pl.name : '(vacío)';
                const st = document.createElement('div'); st.className = 'sub'; st.textContent = p.auto && s === 0 ? 'Avanza automáticamente' : '';
                meta.appendChild(nm); meta.appendChild(st);
                plEl.appendChild(img); plEl.appendChild(meta);
                if (p.winnerIndex !== null) {
                    if (p.winnerIndex === s) plEl.classList.add('winner'); else plEl.classList.add('loser');
                } else if (p.auto && s === 0) {
                    // auto not yet reflected? mark winner
                    plEl.classList.add('winner');
                }
                pairEl.appendChild(plEl);
            }
            pairsWrap.appendChild(pairEl);
        });
        rd.appendChild(pairsWrap);
        mapEl.appendChild(rd);
        const hr = document.createElement('div'); hr.className = 'hr';
        mapEl.appendChild(hr);
    });

    // show final winner if exists
    const last = rounds[rounds.length - 1];
    if (last && last.pairs.length === 1 && last.pairs[0].winnerIndex !== null) {
        const w = last.pairs[0].players[last.pairs[0].winnerIndex];
        if (w) {
            const final = document.createElement('div'); final.className = 'final';
            const img = document.createElement('img'); img.src = w.imageURL; img.style.width = '64px'; img.style.height = '64px'; img.style.borderRadius = '8px';
            const txt = document.createElement('div'); txt.innerHTML = '<div style="font-weight:800">' + w.name + '</div><div style="color:var(--muted)">Ganador del torneo</div>';
            final.appendChild(img); final.appendChild(txt);
            mapEl.appendChild(final);
        }
    }
}

// Render status (round numbers)
function renderStatus() {
    const currentRoundNumber = currentRoundIndex + 1;
    // If originalPlayers length <=1, handle gracefully
    roundInfo.textContent = 'Ronda ' + currentRoundNumber + ' de ' + Math.max(1, totalRoundsNeeded);
    const remaining = Math.max(0, totalRoundsNeeded - currentRoundIndex - 1);
    remainingInfo.textContent = 'Rondas restantes: ' + remaining;
    statusEl.textContent = 'Parejas en ronda: ' + rounds[currentRoundIndex].pairs.length;
}

// Render everything
function renderAll() {
    renderTop();
    renderMap();
    renderStatus();
}

// Handle a selection on top (side = 0 or 1)
function selectTop(side) {
    const round = rounds[currentRoundIndex];
    if (!round) return;
    // ensure currentPairIndex is valid and not auto/decided
    while (currentPairIndex < round.pairs.length) {
        const p = round.pairs[currentPairIndex];
        if (p.winnerIndex === null && !p.auto) break;
        currentPairIndex++;
    }
    if (currentPairIndex >= round.pairs.length) {
        renderAll(); return;
    }
    const pair = round.pairs[currentPairIndex];
    if (pair.players[side] == null) return; // can't choose empty slot
    pair.winnerIndex = side;
    // update UI: set loser dimmed, winner highlighted
    renderMap();

    // move to next pair in same round (so top updates), or if round done, trigger next round creation
    currentPairIndex++;
    // if next is auto or decided, renderTop will skip them
    // small delay to allow user to see change
    setTimeout(() => {
        // if all pairs decided, assemble winners into next round
        const allDecided = round.pairs.every(p => p.winnerIndex !== null);
        if (allDecided) {
            const winners = round.pairs.map(p => p.players[p.winnerIndex]).filter(Boolean);
            if (winners.length === 1) {
                // tournament done
                renderAll();
                return;
            }
            const next = { pairs: [] };
            for (let i = 0; i < winners.length; i += 2) {
                const a = winners[i];
                const b = winners[i + 1];
                const pairNew = { players: [a, b], winnerIndex: null, auto: false };
                if (!b) { pairNew.winnerIndex = 0; pairNew.auto = true; }
                next.pairs.push(pairNew);
            }
            rounds.push(next);
            currentRoundIndex++;
            currentPairIndex = 0;
            autoAdvanceWhilePossible();
        }
        renderAll();
    }, 180);
}

// Auto-advance: if current pair is auto, mark winner and move on automatically
function checkAndAutoAdvanceTop() {
    const round = rounds[currentRoundIndex];
    if (!round) return;
    while (currentPairIndex < round.pairs.length) {
        const p = round.pairs[currentPairIndex];
        if (p.winnerIndex === null && p.auto) {
            p.winnerIndex = 0;
            currentPairIndex++;
            continue;
        }
        break;
    }
}

// UI events
topA.addEventListener('click', () => { selectTop(0); });
topB.addEventListener('click', () => { selectTop(1); });
restartBtn.addEventListener('click', () => {
    if (!originalPlayers.length) return;
    startTournament(originalPlayers);
});
exportBtn.addEventListener('click', () => {
    const out = { originalPlayers, rounds: rounds.map((r, i) => ({ round: i + 1, pairs: r.pairs.map(p => ({ players: p.players.map(pl => pl ? { name: pl.name, imageURL: pl.imageURL } : null), winnerIndex: p.winnerIndex })) })) };
    exportBox.style.display = 'block';
    exportData.textContent = JSON.stringify(out, null, 2);
});

// example select
example.addEventListener('change', () => {
    const val = example.value; if (!val) return;
    JSON_URL = val;
    loadAndStart();
});

// initial load
function loadAndStart() {
    if (!JSON_URL) {
        // fallback example if no URL given
        originalPlayers = [
            { name: 'Mario', imageURL: 'https://i.imgur.com/6QK9V1u.png' },
            { name: 'Peach', imageURL: 'https://i.imgur.com/6r1M3cS.png' },
            { name: 'Luigi', imageURL: 'https://i.imgur.com/7tTz3yH.png' },
            { name: 'Bowser', imageURL: 'https://i.imgur.com/xlXK4bd.png' },
            { name: 'Yoshi', imageURL: 'https://i.imgur.com/d1YQ7rK.png' },
            { name: 'Toad', imageURL: 'https://i.imgur.com/7jS6V5G.png' },
            { name: 'Daisy', imageURL: 'https://i.imgur.com/tC8b5z2.png' }
        ];
        totalRoundsNeeded = computeTotalRounds(originalPlayers.length);
        startTournament(originalPlayers);
        statusEl.textContent = 'Usando datos de ejemplo — pega tu JSON_URL en el script o selecciona un ejemplo.';
        return;
    }
    fetchPlayers(JSON_URL).then(players => {
        originalPlayers = players;
        totalRoundsNeeded = computeTotalRounds(originalPlayers.length);
        startTournament(players);
        statusEl.textContent = 'Listo.';
    }).catch(err => {
        statusEl.textContent = 'Error cargando JSON: ' + err.message;
        // fallback minimal
        originalPlayers = [
            { name: 'Fallback 1', imageURL: 'https://placehold.co/800?text=A' },
            { name: 'Fallback 2', imageURL: 'https://placehold.co/800?text=B' }
        ];
        startTournament(originalPlayers);
    });
}

// run
loadAndStart();