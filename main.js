const board = document.querySelector("#gameBoard")
let lastCard = null
let score = 0
let lives = 10;
(function initialize(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(json => {
        fetch(`https://deckofcardsapi.com/api/deck/${json.deck_id}/draw/?count=52`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            for(const item of json.cards){
                let card = document.createElement("div")
                card.id = `${item.code[0]}`

                let img = document.createElement("img")
                img.src = item.image

                let hider = document.createElement("div")
                hider.id = "hider"

                card.addEventListener("click", function(){
                    hider.classList.add("remove")
                    setTimeout(function(){
                        if(lastCard != null){
                            if(lastCard.id == card.id){
                                card.firstChild.classList.add("remove")
                                lastCard.firstChild.classList.add("remove")

                                lastCard = null

                                score++
                                console.log(`Score: ${score}`)
                            }else{
                                card.lastChild.classList.remove("remove")
                                lastCard.lastChild.classList.remove("remove")
                                
                                lastCard = null
                                
                                lives--
                                if(lives < 1){
                                    board.style.display = "none"
                                }
                                console.log(`Lives: ${lives}`)
                            }
                        }else{
                            lastCard = card
                        }
                    }, 1000)
                })
                card.appendChild(img)
                card.appendChild(hider)
                board.appendChild(card)
            }
        })
    })
    .catch(function(){
        alert("Error: could not load cards.")
    })
})();
