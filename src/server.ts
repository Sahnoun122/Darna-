import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/darna';

mongoose
	.connect(MONGO_URI)
	.then(() => console.log('✅ Connecté à MongoDB'))
	.catch((err) => console.error('❌ Erreur de connexion MongoDB:', err));

// Route de test
app.get('/', (req, res) => {
	res.json({ message: '🚀 API fonctionnelle avec Express + TypeScript + ES6' });
});

// Définir le port
const PORT = process.env.PORT || 8000;

// Démarrer le serveur
app.listen(PORT, () => {
	console.log(`🌍 Serveur démarré sur http://localhost:${PORT}`);
});
