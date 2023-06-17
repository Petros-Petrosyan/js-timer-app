const COMPUTERS_COUNT = +prompt("How many computers do you have?", 4);
const TWO_PLAYER_ONE_MINUTE = (600 / 60).toFixed(0);
const THREE_PLAYER_ONE_MINUTE = (800 / 60).toFixed(0);
const FOUR_PLAYER_ONE_MINUTE = (1000 / 60).toFixed(0);

const CONTAINER_ELEMENT = document.getElementById("container");
const BUDGET_ELEMENT = document.getElementById("budget");
const TOGGLE_BUTTON_ELEMENT = document.getElementById("toggleButton");
const BUDGET_WRAPPER_ELEMENT = document.getElementById("budgetWrapper");

let isBudgetVisible = true;
let sections = [];
let budget = 0;
let template = `<div class="section">
                    <h3 class="sectionTitle">Computer /computerNumber/</h3>
                    <div class="buttons">
                        <button id="/start/" onclick="startTimer(/start-i/)">Start</button>
                        <button id="/stop/" onclick="stopTimer(/stop-i/)" class="stop-btn">Stop</button>
                    </div>
                    <div class="timer">
                        <h3><span id="/hours/">0</span> h. <span id="/minutes/">0</span> m.</h3> 
                        <h3 class="balance">Balance: <span id="/balance/">0</span></h3>
                    </div>
                    <div id="/settings/">
                        <div class="select">
                            <span>Player Counts</span>
                            <select id="/select/" onchange="changePlayerCounts(/select-i/)">
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                        <div class="inTime">
                            <button onclick="openInput(/inTimeBtn-i/)" id="/inTimeBtn/">In Time</button>
                            <div class="input" id="/inTime/">
                                <input id="/input/" onchange="changeInitialMoney(/input-i/)" type="number" placeholder="Money" autofocus>
                            </div>
                        </div>
                    </div>
               </div>`;

class Section {
  constructor(i, playerCounts = 2, initialMoney = null) {
    this.i = i;
    this.stop = false;
    this.invalidValue = false;
    this.playerCounts = playerCounts;
    this.initialMoney = initialMoney;
    this.currentMoney = 0;
    this.minutes = 0;
  }

  openInput() {
    document.getElementById(`inTimeBtn${this.i}`).style.display = "none";
    document.getElementById(`inTime${this.i}`).style.display = "block";
  }
  changePlayerCounts() {
    this.playerCounts = document.getElementById(`select${this.i}`).value;
  }
  changeInitialMoney() {
    const value = document.getElementById(`input${this.i}`).value;
    this.invalidValue = value < 100 ? true : false;
    if (!this.invalidValue) {
      this.initialMoney = value;
    }
  }
  startTimer() {
    this.stop = false;
    const oneMinute =
      this.playerCounts == 2
        ? TWO_PLAYER_ONE_MINUTE
        : this.playerCounts == 3
        ? THREE_PLAYER_ONE_MINUTE
        : FOUR_PLAYER_ONE_MINUTE;
    if (!!this.initialMoney && !this.invalidValue) {
      budget += Math.round(+this.initialMoney / 10) * 10;
      BUDGET_ELEMENT.innerHTML = budget;
      this.minutes = (+this.initialMoney / oneMinute).toFixed(0);
      this.currentMoney = +this.initialMoney;
      document.getElementById(`hours${this.i}`).innerHTML = Math.trunc(
        this.minutes / 60
      );
      document.getElementById(`minutes${this.i}`).innerHTML = this.minutes % 60;
      document.getElementById(`balance${this.i}`).innerHTML =
        Math.round(this.currentMoney / 10) * 10;
      this.timerId = setInterval(() => {
        this.minutes = this.minutes - 1;
        document.getElementById(`hours${this.i}`).innerHTML = Math.trunc(
          this.minutes / 60
        );
        document.getElementById(`minutes${this.i}`).innerHTML =
          this.minutes % 60;
        document.getElementById(`balance${this.i}`).innerHTML =
          Math.round(this.currentMoney / 10) * 10;
        if (this.minutes <= 0) {
          clearInterval(this.timerId);
          const audio = new Audio("sound/sound.mp3");
          audio.play();
        }
      }, 60000);
    } else if (!this.initialMoney && !this.invalidValue) {
      this.timerId = setInterval(() => {
        this.minutes = this.minutes + 1;
        this.currentMoney += +oneMinute;
        document.getElementById(`hours${this.i}`).innerHTML = Math.trunc(
          this.minutes / 60
        );
        document.getElementById(`minutes${this.i}`).innerHTML =
          this.minutes % 60;
        document.getElementById(`balance${this.i}`).innerHTML =
          Math.round(this.currentMoney / 10) * 10;
        if (this.stop) {
          clearInterval(this.timerId);
        }
      }, 60000);
    }

    if (this.invalidValue) {
      document.getElementById(`inTimeBtn${this.i}`).style.display =
        "inline-block";
      document.getElementById(`inTime${this.i}`).style.display = "none";
      this.invalidValue = !this.invalidValue;
    } else {
      document.getElementById(`start${this.i}`).style.display = "none";
      document.getElementById(`settings${this.i}`).style.display = "none";
      document.getElementById(`stop${this.i}`).style.display = "inline-block";
    }
  }

  stopTimer() {
    budget = !this.initialMoney
      ? budget + Math.round(+this.currentMoney / 10) * 10
      : budget;
    BUDGET_ELEMENT.innerHTML = budget;
    this.stop = true;
    this.playerCounts = 2;
    this.initialMoney = null;
    this.currentMoney = 0;
    this.minutes = 0;
    document.getElementById(`hours${this.i}`).innerHTML = 0;
    document.getElementById(`minutes${this.i}`).innerHTML = 0;
    document.getElementById(`balance${this.i}`).innerHTML = 0;
    document.getElementById(`input${this.i}`).value = "";
    document.getElementById(`select${this.i}`).value = 2;
    document.getElementById(`stop${this.i}`).style.display = "none";
    document.getElementById(`start${this.i}`).style.display = "inline-block";
    document.getElementById(`settings${this.i}`).style.display = "inline-block";
    document.getElementById(`inTimeBtn${this.i}`).style.display =
      "inline-block";
    document.getElementById(`inTime${this.i}`).style.display = "none";
    clearInterval(this.timerId);
  }
}

for (let i = 0; i < COMPUTERS_COUNT; i++) {
  let section = template
    .replace("/computerNumber/", i + 1)
    .replace("/inTimeBtn/", `inTimeBtn${i}`)
    .replace("/inTime/", `inTime${i}`)
    .replace("/select/", `select${i}`)
    .replace("/input/", `input${i}`)
    .replace("/hours/", `hours${i}`)
    .replace("/minutes/", `minutes${i}`)
    .replace("/balance/", `balance${i}`)
    .replace("/start/", `start${i}`)
    .replace("/stop/", `stop${i}`)
    .replace("/settings/", `settings${i}`)
    .replace("/select-i/", i)
    .replace("/inTimeBtn-i/", i)
    .replace("/input-i/", i)
    .replace("/start-i/", i)
    .replace("/stop-i/", i);

  CONTAINER_ELEMENT.insertAdjacentHTML("beforeend", section);
  sections.push(new Section(i));
}

const openInput = (i) => sections[i].openInput();
const changePlayerCounts = (i) => sections[i].changePlayerCounts();
const changeInitialMoney = (i) => sections[i].changeInitialMoney();
const startTimer = (i) => sections[i].startTimer();
const stopTimer = (i) => sections[i].stopTimer();

const toggleBudget = () => {
  TOGGLE_BUTTON_ELEMENT.innerHTML = isBudgetVisible
    ? "Hide Budget"
    : "Show Budget";
  BUDGET_WRAPPER_ELEMENT.style.display = isBudgetVisible ? "block" : "none";
  isBudgetVisible = !isBudgetVisible;
};
