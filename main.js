// Player Variables

let deb = false;

const player = {
    heart_auto: false,
    tickspeed: 2,
    hearts: 0,
    study_time: 5,
    studyUpgrade: { 
        upgrade1: {bought: false, cost: 25, heart_boost: 2, time_boost: 1},
        upgrade2: {bought: false, cost: 100, heart_boost: 1, time_boost: 2},
        upgrade3: {bought: false, cost: 150, heart_boost: 5, time_boost: 1},
        upgrade4: {bought: false, cost: 1000, heart_boost: 2, time_boost: 3},
        upgrade5: {bought: false, cost: 1800, heart_boost: 10, time_boost: 1},
        upgrade6: {bought: false, cost: 10000, heart_boost: 3, time_boost: 1},
        upgrade7: {bought: false, cost: 25000, heart_boost: 1, time_boost: 5},
        upgrade8: {bought: false, cost: 100000, heart_boost: 10, time_boost: 1},
        upgrade9: {bought: false, cost: 5e5, heart_boost: 2, time_boost: 1},
        upgrade10: {bought: false, cost: 1e6, heart_boost: 2, time_boost: 1},
        upgrade11: {bought: false, cost: 2e6, heart_boost: 2, time_boost: 1},
        upgrade12: {bought: false, cost: 3e6, heart_boost: 10, time_boost: 1},
        upgrade13: {bought: false, cost: 1e7, heart_boost: 3, time_boost: 2},
        upgrade14: {bought: false, cost: 5e7, heart_boost: 30, time_boost: 1},
        upgrade15: {bought: false, cost: 1e9, heart_boost: 100, time_boost: 1},
        upgrade16: {bought: false, cost: 1e11, heart_boost: 10, time_boost: 1}
    },
    frameInfo: {
        study: {
            locked: false, name: "Study", color: "rgb(255, 123, 0)"
        },
        crochet: {
            locked: true, name: "Crochet", color: "rgb(251, 255, 0)"
        },
        cinema: {
            locked: true, name: "Cinema", color: "rgb(5, 255, 38)"
        },
        grandbend: {
            locked: true, name: "Grandbend", color: "rgb(108, 238, 255)"
        },
        future: {
            locked: true, name: "Future", color: "rgb(0, 150, 0)"
        },
    }
};


// Cached Variables

const hText = document.getElementById("h_text");
const hsText = document.getElementById("hs_text");
const paperTime = document.getElementById("study_time");
const paperFill = document.getElementById("study_fill");
const loveTime = document.getElementById("love_paragraph");
const loveFill = document.getElementById("fill_love");
const framesContainer = document.getElementsByClassName("frame_item");
const navButtons = document.querySelectorAll(".navlist_item");
const paperImg = document.querySelectorAll(".click_paperImg");

document.getElementsByClassName("study_upgrades2")[0].style.display = "none"

for (let frame of framesContainer) {
    if (player["frameInfo"][frame.dataset.target]["locked"] == false) {
        frame.style.display = "grid";
    } else {
        frame.style.display = "none";
    }
}


// Game Logic

function heartGain() {
    if (deb) {
        let returnBoost = 1 * player.tickspeed;
        for (let boost of Object.values(player.studyUpgrade)) {
            if (boost.bought) {
                returnBoost *= boost.heart_boost;
            }
        }
        return returnBoost;
    } else {
        return 0;
    }
}

function timeGain() {
    let timeReturn = 5;
    for (let boost of Object.values(player.studyUpgrade)) {
        if (boost.bought) {
            timeReturn *= boost.time_boost;
        }
    }
    return timeReturn;
}

function addHearts() {
    player.hearts += heartGain() / 100;
}

function short(num) {

    if (num < 1000) {
        return Math.floor(num).toString(); // whole number for <1000
    }

    // Standard early suffixes
    const small = ["", "K", "M", "B", "T"];

    // Latin generated parts (after trillion)
    const ones = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
    const tens = ["", "Dc", "Vg", "Tg", "Qg", "Qq", "Sg", "St", "Og", "Ng"];
    const hundreds = ["", "Ce"];

    let tier = Math.floor(Math.log10(num) / 3);
    let scaled = num / (10 ** (tier * 3));

    let decimals = scaled >= 100 ? 1 : scaled >= 10 ? 2 : 3;
    const factor = 10 ** decimals;
    scaled = Math.floor(scaled * factor) / factor;

    let suffix = "";

    if (tier < small.length) {
        suffix = small[tier];
    } else {
        let latinTier = tier - 4; // shift past K,M,B,T

        let h = Math.floor(latinTier / 100);
        let t = Math.floor((latinTier % 100) / 10);
        let o = latinTier % 10;

        suffix =
            (hundreds[h] || "") +
            (tens[t] || "") +
            (ones[o] || "");
    }

    return scaled.toFixed(decimals) + suffix;
}

function displayHTML() {
    hText.textContent = "💛" + short(player.hearts, 0);
    hsText.textContent = short(heartGain(), 0) + " heart/s";

    for (let button of navButtons) {
        if (player["frameInfo"][button.dataset.target]["locked"] == true) {
            button.style.border = "2px solid white";
            button.innerHTML = "?????";
        } else {
            button.style.border = "2px solid " + player["frameInfo"][button.dataset.target]["color"];
            button.innerHTML = player["frameInfo"][button.dataset.target]["name"];
        }
    }
    const upgKeys = Object.keys(player.studyUpgrade)
    for (keys of upgKeys) {
        let element = document.getElementById(keys);
        if (player.studyUpgrade[keys].bought) {
            element.style.color = "pink";
            let splitString = element.innerHTML.split(" | ");
            splitString[1] = "Bought"
            splitString = splitString.join(" | ")
            element.innerHTML = splitString;
        } else {
            element.style.color = "white";
        }
    }

    let percent = Math.log10(player.hearts) / 300 * 100;
    if (player.hearts == 0) { percent = 0}
    if (percent > 100) { percent = 100}

    loveTime.innerHTML =  (Math.floor(percent * 100) / 100) + "% Love";
    loveFill.style.width = percent + "%";
}


// Navigation

navButtons.forEach(btn => {
    btn.addEventListener("click", handleClick);
});

function handleClick(navLink) {
    const target = navLink.currentTarget.dataset.target;
    if (player["frameInfo"][target]["locked"] != true) {
        for (let frame of framesContainer) {
            frame.style.display = frame.dataset.target === target ? "grid" : "none";
        }
    }
}



paperImg.forEach(img => {
    img.addEventListener("click", paperClick)
});

function paperClick(paper) {
    if (!deb) {
        deb = !deb;
        let startTime = player.study_time;
        let studyTimeHolder = player.study_time;
        
        let paperInterval = setInterval(function ah() {
            if (studyTimeHolder != player.study_time) {
                startTime -= studyTimeHolder - player.study_time;
                studyTimeHolder = player.study_time;
            }
            study_time.innerHTML = (Math.floor(startTime * 10) / 10) + " Seconds";
            paperFill.style.width = (startTime / player.study_time * 100) + "%";
            startTime -= 0.01;

            if (startTime <= 0) {
                deb = !deb;
                clearInterval(paperInterval);
            }
        }, 10)
    }
}

const upgrades = document.querySelectorAll('[id^="upgrade"]');

upgrades.forEach(upgrade => {
    upgrade.addEventListener("click", function () {
        const id = this.id; // "upgrade1", "upgrade2", etc.

        console.log("Clicked:", id);

        // Access your player object
        const upgradeData = player.studyUpgrade[id];

        if (!upgradeData.bought) {
            // Example purchase logic
            if (player.hearts >= upgradeData.cost) {
                player.hearts -= upgradeData.cost;
                upgradeData.bought = true;
                let number = Number(id.match(/\d+/)[0]);
                if (number == 8) {
                    document.getElementsByClassName("study_upgrades2")[0].style.display = "block"
                } else if (number == 16) {
                    player.frameInfo.crochet.locked = false;
                }
            }
        }
    });
});

// Game Loop

setInterval(() => {
    player.study_time = timeGain();
    if (deb) {
        addHearts();
    }
}, 10);

setInterval(() => {
    displayHTML();
}, 10);
