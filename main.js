const board = document.querySelector("#gameBoard");
(function initialize(){
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(json => {
        fetch(`https://deckofcardsapi.com/api/deck/${json.deck_id}/draw/?count=52`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            for(const item of json.cards){
                let card = document.createElement("img")
                card.src = item.image
                board.appendChild(card)
            }
        })
    })
    .catch(function(){
        alert("Error: could not load cards.")
    })
})();
