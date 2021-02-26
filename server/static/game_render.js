

// GLOBALS ---------------------------------------------------
CURRENT_TURN = 0
// END GLOBALS ---------------------------------------------------

function createHandTiles(gameData, parent){
  var players = gameData.players
  var tiles = []
  for(var i = 0; i < players; i++){
    var col = document.createElement("div")
    col.className = "col-md-auto"
    var tile = document.createElement("div")
    tile.class = "tile"
    tile.id = "hand-tile-" + i
    col.appendChild(tile)
    parent.appendChild(col)
    tiles.push(tile)
  }

  return tiles
}


function computeDeck(discard, fireworks, hands, except){
  var deck = fullDeck()
  for (var color in discard) {
    var array = discard[color]
    for (var rank = 0; rank < 5; rank++) {
      addCardToDeck(deck, {
        color: color,
        rank: rank
      }, -array[rank])
    }
  }

  for (var color in fireworks) {
    for (var rank = 0; rank < fireworks[color] + 1; rank++){
      addCardToDeck(deck, {
        color: color,
        rank: rank
      }, -1)
    }
  }

  if(hands != undefined){
    for (var i = 0; i < hands.length; i++) {
      if(i === except)
        continue
      var hand = hands[i]
      hand.map(card => addCardToDeck(deck, card, -1))
    }
  }
  return deck
}


function renderDeck(discard, fireworks, hands){
  
  var tile = document.getElementById("deck-tile")
  var total = computeDeck(discard, fireworks, hands)
  var public = computeDeck(discard, fireworks)
  tile.innerHTML = produce_list([deckToTable(public, "Unknowns Public Belief"), deckToTable(total, "Deck Exact Belief")], "card-deck")
}

// BOARD ---------------------------------------------------------
function renderBoard(board){
  renderFireworks(board.fireworks)

  var badgeInfo = document.getElementById("info-tokens")
  badgeInfo.innerHTML = board.information_tokens
  var badgeLives = document.getElementById("life-tokens")
  badgeLives.innerHTML = board.life_tokens

}

function renderFireworks(fireworks){
  var array = []
  var score = 0
  for(var color in fireworks){
    array.push(colorText(fireworks[color] + 1, color, "game-card"))
    score += fireworks[color] + 1
  }
  var tile = document.getElementById("fireworks-tile")
  
  var content = produce_list(array)
  tile.innerHTML = produce_card(content, "Fireworks (Score: " + score + ")") 
}
// END BOARD ---------------------------------------------------------

// HAND ---------------------------------------------------------

function produceHintTextForHand(index, knowledge){
  var hintText = ""
  var hinted_colors = COLORS.reduce((acc, color, i) => {
    var text = ""
    if (knowledge[index].color_hinted[i]) {
      text = color
    }
    return acc + text
  }, "")
  var hinted_ranks = [0, 1, 2, 3, 4].reduce((acc, rank) => {
    var text = ""
    if (knowledge[index].rank_hinted[rank]) {
      text = rank + 1
    }
    return acc + text
  }, "")
  if (hinted_colors == "") {
    if(hinted_ranks == ""){
      hintText = colorText("No hint", "black", "centered")
    } else {
      hintText = colorText(hinted_ranks, "black", "centered")
    }
  } else {
    if (hinted_ranks == "") {
      hintText = colorText(hinted_colors, hinted_colors, "centered")
    } else {
      hintText = colorText(hinted_ranks, hinted_colors, "centered")
    }
  }
  return hintText
}

function renderCardInHand(player, hands, action, played_index, hinted, knowledge, discard, fireworks, card, index){
  var classes = "game-card"
  if (index == played_index) {
    classes += " played"
  }
  else if (hinted[index] && action.target == player) {
    classes += " hinted"
  }

  var belief = computeDeck(discard, fireworks, hands, player)
  belief = deckProduct(belief, knowledge[index].plausibles)
  var probs = probabilitiesUsefulness(belief, fireworks)
  var playable = "P: " + (probs.playable * 100).toFixed(1) + "%"
  var discard = "D: " + (probs.discardable * 100).toFixed(1) + "%"


  var card = colorText(card.rank + 1, card.color, classes)
  var plausibles = produce_table(
    knowledge[index].plausibles.map(
      (line, i) =>
        line.map((el, rank) =>
          colorText((cardProbability(belief, i, rank) * 100).toFixed(1) + "%", COLORS[i], "")
        )
    ),
    "Belief",
    [0, 1, 2, 3, 4].map(rank => (rank + 1)),
  )

  var hintText = produceHintTextForHand(index, knowledge)

  var id = "p" + player + "card" + index
  var plausible_btn = "<button class=\"btn btn-primary\" type=\"button\" onclick=\"makeCollapse('" + id + "')\">+</button>"
  return produce_vertical_list([card, playable, discard, hintText, plausible_btn, produce_collapse(plausibles, id)])
}

function renderHand(player, hands, action, knowledge, discard, fireworks){
  var tile = document.getElementById("hand-tile-" + player)
  var hand = hands[player]
  // Action highlight
  var played_index = -1
  if ((action.move_type === "PLAY" || action.move_type === "DISCARD") && player == action.player){
    played_index = action.card_index
  }
  var hinted = action.revealed
  
  var content = produce_list(hand.map(function(card, index){
    return renderCardInHand(player, hands, action, played_index, hinted, knowledge, discard, fireworks, card, index)
  }))
  tile.innerHTML = produce_card(content, "Player "+ player)
}
// END HAND ---------------------------------------------------------

function makeCollapse(id){
  $("#" + id).collapse('toggle')
}

// ACTION ---------------------------------------------------------

function renderAction(action, hands) {
  var tile = document.getElementById("action-tile")
  var content = ""
  if (action.move_type === "PLAY" || action.move_type === "DISCARD"){
    var title = ""
    var played_card = hands[action.player][action.card_index]
    var card = colorText(played_card.rank + 1, played_card.color, "game-card")
    var footer = ""
    if(action.move_type === "PLAY"){
      title = "P" + action.player + " plays"
      if(action.scored){
        footer = "Scored !"
      } else {
        footer = "Lost 1 life !"
      }
    } else {
      title = "P" + action.player + " discards"
    }
    title = colorText(title, "black", "game-action")
    footer = colorText(footer, "black", "game-action")
    content = produce_list([title, card, footer], "card-game-action")
  } else {
    var content = ""
    var hint = ""
    if(action.move_type === "REVEAL_COLOR"){
      hint = colorText(" " + action.color, action.color, "game-action pad-left-sm")
    } else {
      hint = action.rank + 1
      hint = colorText("rank " + hint, "black", "game-action pad-left-sm")
    }
    var hint_info = "P" + action.player + " hints P" + action.target
    var cards_hinted = action.revealed.reduce(function(acc, x){
      if(x){
        return acc + 1
      } else 
        return acc
    }, 0)
    var footer = ". Hinted " + cards_hinted + " card(s)"
    footer = colorText(footer, "black", "game-action")
    hint_info = colorText(hint_info, "black", "game-action")
    content = produce_list([hint_info, hint, footer])
  }
  tile.innerHTML = produce_card(content, undefined, undefined, undefined, "no-border")
  
}
// END ACTION ---------------------------------------------------------

function renderAtTurn(gameData, turn) {
  if (turn >= gameData.turns.length) {
    return
  }
  var turnData = gameData.turns[turn]
  var actionData = gameData.actions[turn]
  // Render hands
  var players = gameData.players
  var hands = turnData.hands
  var knowledges = turnData.knowledge
  for (var i = 0; i < players; i++) {
    renderHand(i, hands, actionData, knowledges[i], turnData.discard, turnData.board.fireworks)
  }
  $('.collapse').collapse({toggle: false});
  // Render fireworks
  renderBoard(turnData.board)
  renderDeck(turnData.discard, turnData.board.fireworks, hands)
  renderAction(actionData, hands)

  // Update turn input
  var input = document.getElementById("turn-input")
  input.value = "" + turn
  // Update turn progress
  var progress = document.getElementById("turn-progress")
  progress.textContent = turn + " / " + gameData.max_turns
  setProgressBarValue(progress, (turn * 100 / gameData.max_turns).toFixed(0))
}



function render(gameData){
  createHandTiles(gameData, document.getElementById("hand-tile-container"))
  renderAtTurn(gameData, 0)
}


function goToTurn(element, translation) {
  if (translation === undefined){
    var input = document.getElementById("turn-input")
    CURRENT_TURN = Number(input.value)
  } else {
    CURRENT_TURN += translation
  }  
  if (CURRENT_TURN < 0){
    CURRENT_TURN = 0
    var popover = new bootstrap.Popover(element, {
      content: "Turn must be >= 0 !",
      placement: "bottom"
    })
    popover.show()
    setTimeout(function () { popover.dispose() }, 3000)
  } else if (CURRENT_TURN >= gameData.max_turns) {
    CURRENT_TURN = gameData.max_turns - 1
    var popover = new bootstrap.Popover(element, {
      content: "Turn must be < " + gameData.max_turns + " !",
      placement: "bottom"
    })
    popover.show()
    setTimeout(function() {popover.dispose()}, 3000)
  }
  renderAtTurn(gameData, CURRENT_TURN)
}


// MAIN
$(document).ready(function () {
  render(gameData)
});
