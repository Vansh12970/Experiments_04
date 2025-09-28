const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

// Sample in-memory card collection
let cards = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' },
  { id: 3, suit: 'Diamonds', value: '10' }
];

// ✅ GET all cards
app.get('/cards', (req, res) => {
  res.json(cards);
});

// ✅ GET a specific card by ID
app.get('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find(c => c.id === cardId);
  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

// ✅ POST a new card
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  if (!suit || !value) {
    return res.status(400).json({ error: 'Suit and value are required' });
  }

  const newCard = {
    id: cards.length ? cards[cards.length - 1].id + 1 : 1,
    suit,
    value
  };
  cards.push(newCard);
  res.status(201).json(newCard);
});

// ✅ PUT to update a card
app.put('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const { suit, value } = req.body;

  const cardIndex = cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return res.status(404).json({ error: 'Card not found' });

  cards[cardIndex] = { ...cards[cardIndex], suit, value };
  res.json(cards[cardIndex]);
});

// ✅ DELETE a card
app.delete('/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = cards.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return res.status(404).json({ error: 'Card not found' });

  const removedCard = cards.splice(cardIndex, 1);
  res.json(removedCard[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
