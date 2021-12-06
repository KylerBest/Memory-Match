const board = document.querySelector("#gameBoard");
(function initialize(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(json => {
        fetch(`https://deckofcardsapi.com/api/deck/${json.deck_id}/draw/?count=52`)
        .then(res => res.json())
        .then(json => {
            for(const item of json.cards){
                let card = document.createElement("div")
                let img = document.createElement("img")
                img.src = item.image
                let hider = document.createElement("div")
                hider.id = "hider"
                card.addEventListener("click", function(){
                    hider.classList.add("show")
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
