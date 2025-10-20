# REST Endpoint description
API Endpunkte für LernApp.

Path: **?/api/***

## User (/user/)
- createUser(id, name, birthDate)

## Progress (/progress/)
- getProgress(cardID)
- createProgress(cardID, opt. deckID)

## Deck (/deck/)
- createDeck(id, cardIDs {empty}, title, description, createdAt (date.now), modified (date.now))
- getById(id)
- getCards()?
- getDecks()
- (getPreview)

## Card (/card/)
- getById(id)
- getDeckId(cardID)
- getCreatedBy() : userID
- getBrief: id, title, c_user