# Memory-Match
My phase 1 project idea uses https://deckofcardsapi.com to create a memory-match type game. The goal of the game is to remove every pair of cards. 
# Here's how it works:
The cards laid out face-down on the board. If you click on a card, the face of the card is revealed until you click on a second card.
If the second card you click is the same as the first (suit doesn't matter), then you've made a match and both cards are removed from the board.
![Alt Text](https://cdn-images-1.medium.com/max/800/1*Qq8ZKxYk9fl3zZfJ7D_PvQ.gif)
# Lives:
To make the game more interesting, I've added some lives. You start with 5.
When a match is made, you gain 3 lives. If the match is unsuccessful, you lose 1 life.
You can find the lives counter at the top left of the screen.
# Points:
I've also added a points counter that goes up by one for every match you make.
You can find it at the top right of the screen.
# End of the game:
The game will end if you either run out of lives, or you match every single pair on the board.
When the game ends, you are shown the respective 'YOU WIN' or 'YOU LOSE' screen, which includes
a 'Play Again?' button, as well as a Leaderboard which you can submit your score to. The leaderboard 
works with JSON-server https://www.npmjs.com/package/json-server so the ranks are saved after reloading 
the page. When you submit your score, you fill out a form with your name and the leaderboard gets updated 
immediately. ![Alt Text](https://cdn-images-1.medium.com/max/800/1*BNDF0wEsPUXo0mBXr8vN0A.gif)