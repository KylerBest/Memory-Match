const board = document.querySelector("#gameBoard")
let firstCard = null
let score = 0
let lives = 10;
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
        console.log(this.parent)
        setTimeout(() => {
            if(firstCard){
                if(firstCard.value === this.value){
                    score++
                    console.log(score)
                    this.remove()
                    firstCard.remove()
                    firstCard = null
                }else{
                    lives--
                    console.log(lives)
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
            console.log(json)
            for(const card of json.cards){
                new Card(card.image, card.code[0])
            }
        })
    .catch(function(){
        alert("Error: could not load cards.")
    })
})
})();
