document.addEventListener("DOMContentLoaded", function () {
    const board = document.querySelector("#gameBoard")
    const body = document.querySelector("body")
    const scoreCounter = document.querySelector("#score")
    const livesCounter = document.querySelector("#lives")
    let firstCard = null
    let score = 0
    let lives = 5

    function updateScore(num) {
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

    function updateLives(num) {
        if (lives < 1 && num < 0) {
            endGame()
            return
        }
        if (lives >= 0) {
            livesCounter.textContent = `Lives left: ${lives} ${num < 0 ? `- ${Math.abs(num)}` : `+ ${num}`}`
            setTimeout(function () {
                lives += num
                livesCounter.textContent = `Lives left: ${lives}`
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
                        updateLives(3)
                        updateScore(1)
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

            let endScore = document.createElement("h3")
            endScore.id = "endScore"
            endScore.textContent = `${score} points + ${lives} lives = ${score + lives} total`
            container.appendChild(endScore)

            let playAgain = document.createElement("button")
            playAgain.textContent = "Play Again?"
            playAgain.addEventListener("click", function () {
                location.reload()
            })
            container.appendChild(playAgain)

            body.appendChild(container)

            let leaderBoard = document.createElement("div")
            
            let leaderBoardHeader = document.createElement("h1")
            leaderBoardHeader.textContent = "Leaderboard"
            leaderBoardHeader.id = "leaderBoardHeader"
            leaderBoard.appendChild(leaderBoardHeader)
            
            let topPlayers = document.createElement("ol")
            topPlayers.id = "hsList"
            leaderBoard.appendChild(topPlayers)

            let rankingsHeader = document.createElement("h2")
            rankingsHeader.textContent = "Top Scores:"
            topPlayers.appendChild(rankingsHeader)

            fetch("http://localhost:3000/high_scores")
                .then(res => res.json())
                .then(json => {
                    //find the top 10 (or less) highest scores in db.json and display them on the leaderboard
                    let highScores = [...json]
                    let sortedScores = []
                    for(let i = 0; i < (json.length < 10 ? json.length : 10); i++){
                        let biggestNum = 0
                        let index = 0
                        for(let j = 0; j < highScores.length; j++){
                            let currentNum = highScores[j].totalScore
                            if(currentNum > biggestNum){
                                biggestNum = currentNum
                                index = j
                            }
                        }
                        sortedScores.push(highScores.splice(index, 1)[0])
                    }
                    for(const score of sortedScores){
                        let li = document.createElement("li")
                        li.textContent = `${score.name}: ${score.totalScore}`
                        topPlayers.appendChild(li)
                    }
                })
                .catch(function () {
                    let errorMsg = document.createElement("p")
                    errorMsg.textContent = "Error: could not load players."
                    topPlayers.appendChild(errorMsg)
                })


            let formContainer = document.createElement("div")
            formContainer.id = "formContainer"

            let formHeader = document.createElement("h2")
            formHeader.id = "formHeader"
            formHeader.textContent = "Submit Your Score:"
            formContainer.appendChild(formHeader)

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
                let input = e.target.children[1].value
                submitButton.disabled = true
                nameInput.disabled = true
                fetch("http://localhost:3000/high_scores")
                .then(res => res.json())
                .then(json => {
                    let list = document.querySelector("#hsList")
                    let listItems = list.querySelectorAll("li")
                    const newLi = () => {
                        let newLi = document.createElement("li")
                        newLi.textContent = `${input}: ${score + lives}`
                        newLi.style.background = "yellow"
                        return newLi
                    }
                    const removePreviousLowerScore = () => {
                        for(const li of listItems){
                            let content = li.textContent.split(': ')
                            if(content[0] == input && parseInt(content[1]) < score + lives){
                                li.remove()
                            }
                        }
                    }
                    const insertNewScore = () => {
                        for(const li of listItems){
                            let content = li.textContent.split(': ')
                            if(parseInt(content[1]) <= score + lives){
                                list.insertBefore(newLi(), li)
                                if(list.querySelectorAll("li").length > 10){
                                    listItems[listItems.length - 1].remove()
                                }
                                return
                            }
                        }
                        if(listItems.length < 10){
                            list.appendChild(newLi())
                        }
                    }
                    const post = () => {
                        fetch("http://localhost:3000/high_scores", {
                            method: 'POST',
                            headers: {
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: input,
                                totalScore: score + lives
                            })
                        })
                        .then(() => {
                            insertNewScore()
                        })
                    }
                    const patch = (id) => {
                        fetch(`http://localhost:3000/high_scores/${id}`, {
                            method: 'PATCH',
                            headers: {
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: input,
                                totalScore: score + lives
                            })
                        })
                        .then(() => {
                            removePreviousLowerScore()
                            insertNewScore()
                        })
                    }
                    let entryExists = false
                    for(const entry of json){
                        //if a leaderboard entry with the entered name 
                        //already exists AND it's a lower score than the 
                        //current one we don't want to submit a duplicate  
                        //entry, just update the one that's there
                        if(entry.name == input){
                            entryExists = true
                            if(entry.totalScore < score + lives){
                                patch(entry.id)
                            }
                            break
                        }
                    }
                    if(!entryExists)post()
                })
                submitScoreForm.reset()
            })

            formContainer.appendChild(submitScoreForm)
            leaderBoard.appendChild(formContainer)
            leaderBoard.id = "leaderBoard"
            body.appendChild(leaderBoard)
        }
    }
})