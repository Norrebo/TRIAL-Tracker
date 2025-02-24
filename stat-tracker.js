// Owlbear Rodeo 2.0 Plugin - Stat Tracker
// Dodatek do zarządzania statystykami tokenów

const STAT_NAMES = [
    "Violence", "Tenacity", "Agility", "Haste", "Sneak",
    "Bravado", "Wisdom", "Craft", "Power", "Faith"
];

const STAT_COLORS = {
    "Green": "#85ff66",
    "Red": "#ff4d4d",
    "Blue": "#44e0f1",
    "Yellow": "#ffd433",
    "White": "#ffffff"
};

let activeStatIndex = 0;
let lastStatIndex = null;

function createDMPanel() {
    const panel = document.createElement("div");
    panel.id = "stat-tracker-panel";
    panel.style.position = "absolute";
    panel.style.top = "50px";
    panel.style.left = "50px";
    panel.style.padding = "10px";
    panel.style.background = "rgba(0,0,0,0.8)";
    panel.style.color = "white";
    panel.style.borderRadius = "8px";
    panel.style.zIndex = "1000";

    // Tworzymy listę statystyk
    STAT_NAMES.forEach((stat, index) => {
        const statEntry = document.createElement("div");
        statEntry.textContent = `${index === 9 ? 0 : index + 1}. ${stat}`;
        statEntry.style.cursor = "pointer";
        statEntry.style.padding = "5px";
        statEntry.onclick = () => updateActiveStat(index);
        panel.appendChild(statEntry);
    });

    // Dodajemy przycisk resetu
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Colors";
    resetButton.style.marginTop = "10px";
    resetButton.onclick = resetStatColors;
    panel.appendChild(resetButton);

    document.body.appendChild(panel);
}

function updateActiveStat(index) {
    lastStatIndex = activeStatIndex;
    activeStatIndex = index;
    updateStatDisplay();
}

function updateStatDisplay() {
    document.querySelectorAll("#stat-tracker-panel div").forEach((entry, index) => {
        entry.style.opacity = index === lastStatIndex ? "0.5" : "1";
    });
    document.getElementById("active-stat-display").textContent = STAT_NAMES[activeStatIndex];
}

function resetStatColors() {
    lastStatIndex = null;
    updateStatDisplay();
}

// Tworzymy UI dla wyświetlania aktywnej statystyki
function createActiveStatDisplay() {
    const display = document.createElement("div");
    display.id = "active-stat-display";
    display.style.position = "absolute";
    display.style.top = "10px";
    display.style.left = "50%";
    display.style.transform = "translateX(-50%)";
    display.style.fontSize = "24px";
    display.style.color = "white";
    display.style.background = "black";
    display.style.padding = "5px 15px";
    display.style.borderRadius = "5px";
    document.body.appendChild(display);
    updateStatDisplay();
}

// Tworzymy menu kontekstowe dla tokenów
function createTokenContextMenu(token) {
    const menu = document.createElement("div");
    menu.style.position = "absolute";
    menu.style.background = "rgba(0,0,0,0.8)";
    menu.style.color = "white";
    menu.style.padding = "10px";
    menu.style.borderRadius = "8px";
    menu.style.zIndex = "1000";

    Object.entries(STAT_COLORS).forEach(([name, color]) => {
        const colorOption = document.createElement("div");
        colorOption.textContent = name;
        colorOption.style.cursor = "pointer";
        colorOption.style.color = color;
        colorOption.onclick = () => updateTokenColor(token, color);
        menu.appendChild(colorOption);
    });

    document.body.appendChild(menu);
    return menu;
}

function updateTokenColor(token, color) {
    token.metadata.statColor = color;
    renderTokenStats(token);
}

function renderTokenStats(token) {
    const statValue = token.metadata[STAT_NAMES[activeStatIndex].toLowerCase()];
    if (!statValue) return;

    const label = document.createElement("div");
    label.textContent = statValue;
    label.style.position = "absolute";
    label.style.bottom = "-20px";
    label.style.left = "50%";
    label.style.transform = "translateX(-50%)";
    label.style.color = token.metadata.statColor || "white";
    label.style.textShadow = "0px 0px 3px black";
    label.style.fontSize = "14px";
    document.body.appendChild(label);
}

// Inicjalizacja dodatku
function init() {
    createDMPanel();
    createActiveStatDisplay();
}

document.addEventListener("DOMContentLoaded", init);
