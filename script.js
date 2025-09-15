// Spieldaten (später aus JSON laden)
const games = [
  {
    title: "Wahrheit oder Pflicht",
    desc: "Klassiker für mutige Runden",
    players: "2-12 Spieler",
    color: "#ff7675"
  },
  {
    title: "Wer würde eher",
    desc: "Lustige Vermutungen über Freunde",
    players: "3-10 Spieler",
    color: "#0984e3"
  },
  {
    title: "Ich hab noch nie",
    desc: "Erfahrt mehr übereinander",
    players: "3-15 Spieler",
    color: "#a29bfe"
  },
  {
    title: "Entweder/Oder",
    desc: "Schnelle Entscheidungen treffen",
    players: "2-8 Spieler",
    color: "#00b894"
  }
];

// Karten dynamisch einsetzen
const gameList = document.getElementById("game-list");

games.forEach(game => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>${game.title}</h3>
    <p>${game.desc}</p>
    <span style="color:${game.color}">${game.players}</span>
  `;
  gameList.appendChild(card);
});
