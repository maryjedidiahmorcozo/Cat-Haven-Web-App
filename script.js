
let selectedCat = "";
let happiness = 50;
let points = 0;
let level = 1;
let xp = 0;
let energy = 100;
let streak = 0;
let energyNeeded = 0;
const SAVE_KEY = "cat-haven-pink-quest";

const catProfiles = {
  Yuki: {
    emoji: "🐱",
    mood: "Ready for cuddles",
    intro: "is happy to meet you and curl up beside your cozy corner.",
    primary: "#ff5ca8",
    secondary: "#c962ff",
    messages: [
      "Yay! Let's chase little toy mice together! 🐾",
      "A soft head bump says you are my favorite human. 💗",
      "I’m purring like a tiny engine of joy! 🧶",
      "This nap spot is perfect now that you’re here. 😴"
    ],
    reward: 10
  },
  Mochi: {
    emoji: "😸",
    mood: "Soft and sleepy",
    intro: "wants a warm cuddle and a dreamy little snack break.",
    primary: "#f479b3",
    secondary: "#d178ff",
    messages: [
      "Mmm, that treat was tasty and comforting. 🐟",
      "A gentle pet makes my whole heart melt. 💕",
      "I feel extra cozy when you’re near. 🛏️",
      "This toy makes me feel like a tiny king of the room. 👑"
    ],
    reward: 12
  },
  Luna: {
    emoji: "🐈‍⬛",
    mood: "Playful explorer",
    intro: "is ready to zoom through a little adventure with you.",
    primary: "#e85b9f",
    secondary: "#bb64f4",
    messages: [
      "I’m zooming around like a happy little comet! ✨",
      "That toy is brilliant — I’ve got a new mission. 🧸",
      "Your attention makes me feel brave and bold. 🌙",
      "This is my favorite kind of chaos: joyful and fun. 😼"
    ],
    reward: 15
  },
  Nori: {
    emoji: "😺",
    mood: "Goofy and glowing",
    intro: "is full of silly energy and ready to make you smile.",
    primary: "#f05aaf",
    secondary: "#ca6cfa",
    messages: [
      "A silly little pounce is my love language. 🐾",
      "This game is extra fun when we do it together. 🎉",
      "I’ll keep the room sparkling with happy chaos. ✨",
      "You are officially my favorite play partner. 💖"
    ],
    reward: 18
  }
};

function setActiveCatCard(name) {
  const cards = document.querySelectorAll(".cat-card");
  cards.forEach((card) => {
    const isSelected = card.dataset.cat === name;
    const button = card.querySelector(".select-btn");
    card.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
    button.textContent = isSelected ? "Selected ✓" : "Choose " + card.dataset.cat;
  });
}

function gainXp(amount) {
  xp += amount;

  while (xp >= 100) {
    xp -= 100;
    level += 1;
    happiness = Math.min(100, happiness + 8);
    energy = Math.min(100, energy + 10);
  }
}

function chooseCat(name) {
  const profile = catProfiles[name];
  if (!profile) return;

  selectedCat = name;
  happiness = 50;
  points = 0;
  level = 1;
  xp = 0;
  energy = 100;
  streak = 0;
  energyNeeded = 0;

  document.getElementById("catDisplay").textContent = profile.emoji;
  document.getElementById("catName").textContent = "You are playing with " + name + "!";
  document.getElementById("catMessage").textContent = name + " " + profile.intro;
  setStatus(profile.mood);

  document.documentElement.style.setProperty("--primary", profile.primary);
  document.documentElement.style.setProperty("--secondary", profile.secondary);

  setActiveCatCard(name);
  updateDisplay();
  saveGame();
  document.getElementById("play").scrollIntoView({ behavior: "smooth", block: "start" });
}

function checkCat(energyCost = 0) {
  if (selectedCat === "") {
    energyNeeded = 0;
    setStatus("Choose a cat first", true);
    document.getElementById("catMessage").textContent = "Please choose a cat first so the fun can begin! 🐾";
    return false;
  }

  if (energy < energyCost) {
    energyNeeded = energyCost;
    setStatus("Needs a rest", true);
    document.getElementById("catMessage").textContent = selectedCat + " needs a little more energy for that. Feed them or let them rest! 😴";
    return false;
  }

  energyNeeded = 0;
  return true;
}

function setStatus(message, isWarning = false) {
  const status = document.getElementById("statusPill");
  status.textContent = message;
  status.classList.toggle("is-warning", isWarning);
}

function interact(message, action) {
  if (!checkCat(Math.max(0, -action.energy))) return;

  const profile = catProfiles[selectedCat];
  happiness = Math.min(100, happiness + action.happiness);
  energy = Math.min(100, Math.max(0, energy + action.energy));
  points += action.points;
  gainXp(action.xp);
  streak += 1;
  document.getElementById("catDisplay").textContent = action.emoji || profile.emoji;
  document.getElementById("catDisplay").textContent = action.emoji || profile.emoji;
  updateDisplay();
  setStatus(happiness >= 100 ? "Joy level maxed" : profile.mood);
  document.getElementById("catMessage").textContent = selectedCat + ": " + message;
  saveGame();
}

function playWithCat() {
  const profile = catProfiles[selectedCat];
  const message = profile ? profile.messages[Math.floor(Math.random() * profile.messages.length)] : "Yay! Let's play with yarn! 🧶";
  interact(message, { happiness: 12, points: 10, xp: 18, energy: -20, emoji: "😻" });
}

function feedCat() {
  const message = selectedCat ? "Yummy! A little snack makes my heart feel extra cozy. 🐟" : "Yummy! Thank you for the treat! 🐟";
  interact(message, { happiness: 10, points: 8, xp: 12, energy: 24, emoji: "😋" });
}

function petCat() {
  const message = selectedCat ? "Purr... that gentle touch is pure happiness. 💗" : "Purr... I love your gentle pets! 💗";
  interact(message, { happiness: 8, points: 6, xp: 10, energy: 0, emoji: "😽" });
}

function giveToy() {
  const message = selectedCat ? "Wow! My new toy is brilliant and endlessly fun! 🧸" : "Wow! My new toy is so fun! 🧸";
  interact(message, { happiness: 14, points: 12, xp: 20, energy: -12, emoji: "😸" });
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      selectedCat,
      happiness,
      points,
      level,
      xp,
      energy,
      streak
    }));
  } catch (error) {
    console.error("Could not save Cat Haven progress.", error);
  }
}

function loadGame() {
  let saved;

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    saved = JSON.parse(raw);
  } catch (error) {
    console.error("Could not load Cat Haven progress.", error);
    return;
  }

  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return;

  selectedCat = Object.hasOwn(catProfiles, saved.selectedCat) ? saved.selectedCat : "";
  happiness = Number.isInteger(saved.happiness) ? Math.min(100, Math.max(0, saved.happiness)) : 50;
  points = Number.isInteger(saved.points) ? Math.max(0, saved.points) : 0;
  level = Number.isInteger(saved.level) ? Math.max(1, saved.level) : 1;
  xp = Number.isInteger(saved.xp) ? Math.min(99, Math.max(0, saved.xp)) : 0;
  energy = Number.isInteger(saved.energy) ? Math.min(100, Math.max(0, saved.energy)) : 100;
  streak = Number.isInteger(saved.streak) ? Math.max(0, saved.streak) : 0;

  if (selectedCat) {
    const profile = catProfiles[selectedCat];
    document.getElementById("catDisplay").textContent = profile.emoji;
    document.getElementById("catName").textContent = "You are playing with " + selectedCat + "!";
    document.getElementById("catMessage").textContent = selectedCat + " is happy to see you again! 💗";
    setStatus(happiness >= 100 ? "Joy level maxed" : profile.mood);
    document.documentElement.style.setProperty("--primary", profile.primary);
    document.documentElement.style.setProperty("--secondary", profile.secondary);
    setActiveCatCard(selectedCat);
  }
}

function updateDisplay() {
  document.getElementById("happiness").textContent = happiness;
  document.getElementById("points").textContent = points;
  document.getElementById("level").textContent = level;
  document.getElementById("xpDisplay").textContent = xp + "/100";
  document.getElementById("energyDisplay").textContent = energy + "%";
  document.getElementById("streak").textContent = streak + (streak === 1 ? " action" : " actions");
  document.getElementById("happinessBar").style.width = happiness + "%";
  document.getElementById("happinessBar").parentElement.setAttribute("aria-valuenow", String(happiness));
  document.getElementById("xpBar").style.width = xp + "%";
  document.getElementById("xpBar").parentElement.setAttribute("aria-valuenow", String(xp));
  document.getElementById("energyBar").style.width = energy + "%";
  document.getElementById("energyBar").parentElement.setAttribute("aria-valuenow", String(energy));
}

function rechargeEnergy() {
  const wasUnavailable = energyNeeded > 0 && energy < energyNeeded;
  const previousEnergy = energy;

  if (selectedCat && energy < 100) {
    energy = Math.min(100, energy + 8);
  }

  if (wasUnavailable && energy >= energyNeeded && selectedCat) {
    energyNeeded = 0;
    setStatus(catProfiles[selectedCat].mood);
    document.getElementById("catMessage").textContent = selectedCat + " has had a little rest and is ready again! 💗";
  }

  updateDisplay();
  if (energy !== previousEnergy) saveGame();
}

function resetGame() {
  selectedCat = "";
  happiness = 50;
  points = 0;
  level = 1;
  xp = 0;
  energy = 100;
  streak = 0;
  energyNeeded = 0;

  document.getElementById("catDisplay").textContent = "🐱";
  document.getElementById("catName").textContent = "Choose a cat to begin!";
  setStatus("Ready for cuddles");
  document.getElementById("catMessage").textContent = "Your furry friend is waiting for you.";

  document.documentElement.style.setProperty("--primary", "#f25a9b");
  document.documentElement.style.setProperty("--secondary", "#8d68db");

  setActiveCatCard("");
  updateDisplay();
  saveGame();
}

loadGame();
setInterval(rechargeEnergy, 4000);
updateDisplay();
