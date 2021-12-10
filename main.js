window.addEventListener("DOMContentLoaded", function () {
    const board = document.querySelector("#gameBoard")
    const body = document.querySelector("body")
    const scoreCounter = document.querySelector("#score")
    const livesCounter = document.querySelector("#lives")
    let firstCard = null
    let score = 0
    let lives = 5;

    function updateScore(num) {
        if (score < 26) {
            scoreCounter.textContent = `Points: ${score} + ${num}`
            setTimeout(function () {
                score += num
                scoreCounter.textContent = `Points: ${score}`
                if (score > 25) {
                    endGame("win")
                    return
                }
            }, 500)
        }
    }

    function updateLives(num) {
        if (lives < 1 && num < 0) {
            endGame()
            return
        }
        if (lives >= 0) {
            livesCounter.textContent = `Lives Remaining: ${lives} ${num < 0 ? `- ${Math.abs(num)}` : `+ ${num}`}`
            setTimeout(function () {
                lives += num
                livesCounter.textContent = `Lives Remaining: ${lives}`
            }, 500)
        }
    }
    class Card {
        constructor(imgSrc, value) {
            this.img = document.createElement("img")
            this.img.src = imgSrc

            this.value = value

            this.hider = document.createElement("div")
            this.hider.id = "hider"

            this.parent = document.createElement("div")
            this.parent.appendChild(this.img)
            this.parent.appendChild(this.hider)
            this.parent.addEventListener("click", this.onCardClick)
            board.appendChild(this.parent)
        }
        get getThis() {
            return this
        }
        reveal() {
            this.hider.classList.add("remove")
            this.parent.removeEventListener("click", this.onCardClick)
        }
        remove() {
            this.parent.classList.add("remove")
        }
        reset() {
            this.hider.classList.remove("remove")
            this.parent.classList.remove("remove")
            this.parent.addEventListener("click", this.onCardClick)
        }
        onCardClick = () => {
            this.reveal()
            setTimeout(() => {
                if (firstCard) {
                    if (firstCard.value === this.value) {
                        updateScore(1)
                        updateLives(3)
                        this.remove()
                        firstCard.remove()
                        firstCard = null
                    } else {
                        updateLives(-1)
                        this.reset()
                        firstCard.reset()
                        firstCard = null
                    }
                } else {
                    firstCard = this
                }
            }, 1000)
        }
    }

    (function initialize() {
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(res => res.json())
            .then(json => {
                fetch(`https://deckofcardsapi.com/api/deck/${json.deck_id}/draw/?count=52`)
                    .then(res => res.json())
                    .then(json => {
                        for (const card of json.cards) {
                            new Card(card.image, card.code[0])
                        }
                    })
                    .catch(function () {
                        alert("Error: could not load cards.")
                    })
            })
    })()

    function endGame(outcome) {
        let hsLives = 0
        if (!document.querySelector("#endScreen")) {
            board.style.display = "none"

            let container = document.createElement("div")
            container.id = "endScreenContainer"

            let endScreen = document.createElement("h1")
            endScreen.id = "endScreen"
            if (outcome === "win") {
                endScreen.textContent = "YOU WIN"
                hsLives = 3
            } else endScreen.textContent = "YOU LOSE"
            container.appendChild(endScreen)

            let highScore = document.createElement("h2")
            highScore.textContent = "Score:"
            container.appendChild(highScore)

            let endLives = document.createElement("h3")
            endLives.id = "endLives"
            endLives.textContent = `Lives: ${(lives + hsLives).toString()}`
            container.appendChild(endLives)

            let endScore = document.createElement("h3")
            endScore.id = "endScore"
            endScore.textContent = `Points: ${score.toString()}`
            container.appendChild(endScore)

            let playAgain = document.createElement("button")
            playAgain.textContent = "Play Again?"
            playAgain.addEventListener("click", function () {
                location.reload()
            })
            container.appendChild(playAgain)

            body.appendChild(container)


            let topPlayers = document.createElement("ol")
            topPlayers.id = "hsList"

            let rankingsHeader = document.createElement("h2")
            rankingsHeader.textContent = "Top Scores:"
            topPlayers.appendChild(rankingsHeader)

            fetch("http://localhost:3000/high_scores")
                .then(res => res.json())
                .then(json => {
                    for (let i = 0; i < 5; i++) {
                        if (json[i]) {
                            let highScore = document.createElement("li")
                            highScore.textContent = `${json[i].name}: ${json[i].lives} lives - ${json[i].points} points`
                            topPlayers.appendChild(highScore)
                        }
                    }
                })
                .catch(function () {
                    let errorMsg = document.createElement("p")
                    errorMsg.textContent = "Error: could not load players."
                    topPlayers.appendChild(errorMsg)
                })

            let leaderBoard = document.createElement("div")
            leaderBoard.appendChild(topPlayers)

            let formHeader = document.createElement("h2")
            formHeader.id = "formHeader"
            formHeader.textContent = "Submit Your Score:"
            leaderBoard.appendChild(formHeader)

            let submitScoreForm = document.createElement("form")
            let label = document.createElement("label")
            label.htmlFor = "submitYourScore"
            let nameInput = document.createElement("input")
            nameInput.id = "submitYourScore"
            nameInput.type = "text"
            nameInput.placeholder = "Enter Name"
            let submitButton = document.createElement("input")
            submitButton.type = "submit"
            submitScoreForm.appendChild(label)
            submitScoreForm.appendChild(nameInput)
            submitScoreForm.appendChild(submitButton)
            submitScoreForm.addEventListener("submit", (e) => {
                e.preventDefault()
                console.log(e)
                fetch("http://localhost:3000/high_scores", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: e.target.children[1].value,
                        points: score,
                        lives: lives
                    })
                })
                fetch("http://localhost:3000/high_scores")
                    .then(res => res.json())
                    .then(json => {
                        for (let i = 0; i < 5; i++) {
                            if (json[i]) {
                                let highScore = document.createElement("li")
                                highScore.textContent = `${json[i].name}: ${json[i].lives} lives - ${json[i].points} points`
                                topPlayers.appendChild(highScore)
                            }
                        }
                    })
                submitScoreForm.reset()
            })

            leaderBoard.appendChild(submitScoreForm)
            leaderBoard.id = "leaderBoard"
            body.appendChild(leaderBoard)
        }
    }
})