const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

const rollDice = () => {
    diceValuesArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => a - b);
    diceValuesArr.forEach((value, index) => {
        listOfAllDice[index].textContent = value;
    });
};

const updateStats = () => {
    rollsElement.textContent = rolls;
    roundElement.textContent = round;
};

const updateRadioOption = (index, score) => {
    scoreInputs[index].disabled = false;
    scoreInputs[index].value = score;
    scoreSpans[index].textContent = `, score = ${score}`;
};

const updateScore = (selectedValue, achieved) => {
    score += parseInt(selectedValue);
    totalScoreElement.textContent = score;

    scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

const getHighestDuplicates = (arr) => {
    const counts = {};

    for (const num of arr) {
        if (counts[num]) {
            counts[num]++;
        } else {
            counts[num] = 1;
        }
    }

    let highestCount = 0;

    for (const num of arr) {
        const count = counts[num];
        if (count >= 3 && count > highestCount) {
            highestCount = count;
        }
        if (count >= 4 && count > highestCount) {
            highestCount = count;
        }
    }

    const sumOfAllDice = arr.reduce((acc, curr) => acc + curr, 0);

    if (highestCount === 4) {
        updateRadioOption(1, sumOfAllDice);
        updateRadioOption(0, sumOfAllDice);
    }

    if (highestCount === 3) {
        updateRadioOption(0, sumOfAllDice);
    }
};

const detectFullHouse = (arr) => {
    const counts = {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    const values = Object.values(counts);
    const hasThree = values.includes(3);
    const hasTwo = values.includes(2);

    if (hasThree && hasTwo) {
        updateRadioOption(2, 25);
    }
};

const checkForStraights = (arr) => {
    const sortedNumbersArr = arr.sort((a, b) => a - b);
    const uniqueNumbersArr = [...new Set(sortedNumbersArr)];
    const uniqueNumbersStr = uniqueNumbersArr.join("");

    const smallStraightsArr = ["1234", "2345", "3456"];
    const largeStraightsArr = ["12345", "23456"];

    if (smallStraightsArr.some(straight => uniqueNumbersStr.includes(straight))) {
        updateRadioOption(3, 30);
    }

    if (largeStraightsArr.includes(uniqueNumbersStr)) {
        updateRadioOption(4, 40);
    }
};

const resetRadioOptions = () => {
    for (const input of scoreInputs) {
        input.disabled = true;
        input.checked = false;
    }

    for (const span of scoreSpans) {
        span.textContent = "";
    }
};

const resetGame = () => {
    Array.from(listOfAllDice).forEach(label => label.textContent = 0);
    score = 0;
    round = 1;
    rolls = 0;
    totalScoreElement.textContent = score;
    scoreHistory.innerHTML = "";
    rollsElement.textContent = rolls;
    roundElement.textContent = round;

    resetRadioOptions();
};

rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert("You have made three rolls this round. Please select a score.");
    } else {
        resetRadioOptions();
        rolls++;
        rollDice();
        updateStats();
        getHighestDuplicates();
        detectFullHouse(diceValuesArr);
        checkForStraights(diceValuesArr);
        updateRadioOption(5, 0);
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    if (isModalShowing) {
        rulesContainer.style.display = "block";
        rulesBtn.textContent = "Hide rules";
    } else {
        rulesContainer.style.display = "none";
        rulesBtn.textContent = "Show rules";
    }
});

keepScoreBtn.addEventListener("click", () => {
    let selectedValue;
    let achieved;

    for (const radioButton of scoreInputs) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            achieved = radioButton.id;
            break;
        }
    }

    if (selectedValue) {
        rolls = 0;
        round++;
        updateStats();
        resetRadioOptions();
        updateScore(selectedValue, achieved);

        if (round > 6) {
            setTimeout(() => {
                alert(`Game Over! Your total score is ${score}`);
                resetGame();
            }, 500);
        }

    } else {
        alert("Please select an option or roll the dice");
    }
});