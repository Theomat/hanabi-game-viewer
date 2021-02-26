const COPIES_PER_RANK = [3, 2, 2, 2, 1]

function emptyDeck() {
    var deck = []
    for (var color = 0; color < COLORS.length; color++) {
        var colorData = []
        for (var rank = 0; rank < 5; rank++) {
            colorData.push(0)
        }
        deck.push(colorData)
    }
    return deck
}

function fullDeck() {
    var deck = []
    for (var color = 0; color < COLORS.length; color++) {
        var colorData = []
        for (var rank = 0; rank < 5; rank++) {
            colorData.push(COPIES_PER_RANK[rank])
        }
        deck.push(colorData)
    }
    return deck
}

function addCardToDeck(deck, card, qty = 1) {
    if(qty == 0)
        return
    for(var i = 0; i < COLORS.length; i++){
        if(COLORS[i] == card.color){
            deck[i][card.rank] += qty
        }
    }
}

function inverseDeck(deck){
    var inverse = fullDeck()
    for (var color = 0; color < COLORS.length; color++) {
        for (var rank = 0; rank < 5; rank++) {
            inverse[color][rank] -= deck[color][rank]
        }
    }
    return inverse
}

function totalCards(deck){
    var total = 0
    for (var color = 0; color < COLORS.length; color++) {
        for (var rank = 0; rank < 5; rank++) {
            total += deck[color][rank]
        }
    }
    return total
}

function colorProbability(deck, color){
    var cards_in_color = 0
    for (var rank = 0; rank < 5; rank++) {
        cards_in_color += deck[color][rank]
    }
    return cards_in_color / totalCards(deck)
}


function cardProbability(deck, color, rank) {
    return deck[color][rank] / totalCards(deck)
}


function rankProbability(deck, rank) {
    var cards = 0
    for (var i = 0; i < COLORS.length; i++) {
        cards += deck[i][rank]
    }
    return cards / totalCards(deck)
}

function probabilitiesUsefulness(deck, fireworks){
    var probs = {
        playable: 0,
        discardable: 0
    }
    var color_index = 0
    for (var color in fireworks) {
        for(color_index = 0; COLORS[color_index] != color; color_index++){}
        var rank = fireworks[color]
        for(var i = 0; i < rank + 1; i++){
            probs.discardable += cardProbability(deck, color_index, i)
        }
        if(rank < 5){
            probs.playable += cardProbability(deck, color_index, rank + 1)
        }
        color_index ++
    }
    return probs
}

function deckProduct(deck, plausibles){
    var product = emptyDeck()
    for (var color = 0; color < COLORS.length; color++) {
        for (var rank = 0; rank < 5; rank++) {
            if(plausibles[color][rank])
                product[color][rank] = deck[color][rank]
        }
    }
    return product
}

function deckToTable(deck, caption) {
    return produce_table(
        deck.map(
            (line, i) =>
            line.map((el, rank) =>
                colorText(deck[i][rank] + " (" + (cardProbability(deck, i, rank) * 100).toFixed(2) + "%)", COLORS[i], ".card") 
            )
        ),
        caption,
        [0, 1, 2, 3, 4].map(rank => (rank + 1) + " (" + (rankProbability(deck, rank) * 100).toFixed(2) + "%)"),
        COLORS.map((color, i) => colorText(color + " (" + (colorProbability(deck, i) * 100).toFixed(2) + "%)", color, "")),
    )
}