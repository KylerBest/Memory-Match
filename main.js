const board = document.querySelector("#gameBoard")
const body = document.querySelector("body")
const scoreCounter = document.querySelector("#score")
const livesCounter = document.querySelector("#lives")
let firstCard = null
let score = 0
let lives = 5;
function updateScore(num){
    if(score < 26){
        scoreCounter.textContent = `Score: ${score} + ${num}`
        setTimeout(function(){
            score += num
            scoreCounter.textContent = `Score: ${score}`
            if(score > 25){
                endGame("win") 
                return
            }
        }, 500)
    }
}
function updateLives(num){
    if(lives < 1 && num < 0){
        endGame()
        return
    }
    if(lives > 0){
        livesCounter.textContent = `Lives Remaining: ${lives} ${num < 0 ? `- ${Math.abs(num)}` : `+ ${num}`}`
        setTimeout(function(){
            lives += num
            livesCounter.textContent = `Lives Remaining: ${lives}`
        }, 500)
    }
}
class Card{
    constructor(imgSrc, value){
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
    get getThis(){return this}
    reveal(){
        this.hider.classList.add("remove")
        this.parent.removeEventListener("click", this.onCardClick)
    }
    remove(){
        this.parent.classList.add("remove")
    }
    reset(){
        this.hider.classList.remove("remove")
        this.parent.classList.remove("remove")
        this.parent.addEventListener("click", this.onCardClick)
    }
    onCardClick = () => {
        this.reveal()
        setTimeout(() => {
            if(firstCard){
                if(firstCard.value === this.value){
                    updateScore(1)
                    updateLives(3)
                    this.remove()
                    firstCard.remove()
                    firstCard = null
                }else{
                    updateLives(-1)
                    this.reset()
                    firstCard.reset()
                    firstCard = null
                }
            }else{
                firstCard = this
            }
        }, 1000)
    }
}

(function initialize(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(json => {
        fetch(`https://deckofcardsapi.com/api/deck/${json.deck_id}/draw/?count=52`)
        .then(res => res.json())
        .then(json => {
            for(const card of json.cards){
                new Card(card.image, card.code[0])
            }
        })
        .catch(function(){
            alert("Error: could not load cards.")
        })
    })
})()

function endGame(outcome){
    if(!document.querySelector("#endScreen")){
        board.style.display = "none"
        let endScreen = document.createElement("h1")
        endScreen.id = "endScreen"
        if(outcome === "win")endScreen.textContent = "YOU WIN"
        else endScreen.textContent = "YOU LOSE"
        body.appendChild(endScreen)
        let playAgain = document.createElement("button")
        playAgain.textContent = "Play Again?"
        playAgain.addEventListener("click", function(){
            location.reload()
        })
        body.appendChild(playAgain)
    }
}