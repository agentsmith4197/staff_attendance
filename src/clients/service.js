const express = require('express');
const bodyParser = require('body-parser');
const { db, collection, query, where, getDocs } = require('./firebase');
const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');

const app = express();
app.use(bodyParser.json());

const rpID = 'attendance-iota-lemon.vercel.app'; // Update with your Vercel app domain
const expectedOrigin = `https://${rpID}`;

// Mock in-memory storage for simplicity
const users = new Map();

app.post('/generate-registration-options', async (req, res) => {
  const { username } = req.body;

  // Fetch user by registration number
  const q = query(collection(db, 'students'), where('registrationNumber', '==', username));
  const userDocs = await getDocs(q);

  if (userDocs.empty) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userDoc = userDocs.docs[0];
  const user = userDoc.data();
  const userId = userDoc.id;

  if (!users.has(userId)) {
    users.set(userId, { ...user, id: userId, devices: [] });
  }

  const userForWebAuthn = users.get(userId);

  const options = generateRegistrationOptions({
    rpName: 'Your App Name',
    rpID,
    userID: userForWebAuthn.id,
    userName: userForWebAuthn.registrationNumber,
    timeout: 60000,
    attestationType: 'direct',
    authenticatorSelection: {
      userVerification: 'preferred',
    },
  });

  userForWebAuthn.currentChallenge = options.challenge;
  res.json(options);
});

app.post('/verify-registration', async (req, res) => {
  const { credential } = req.body;

  const user = Array.from(users.values()).find(u => u.currentChallenge === credential.response.clientDataJSON.challenge);

  if (!user) {
    return res.status(400).json({ error: 'Invalid challenge' });
  }

  const verification = await verifyRegistrationResponse({
    credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin,
    expectedRPID: rpID,
  });

  if (verification.verified) {
    user.devices.push(verification.registrationInfo);
    delete user.currentChallenge;
    res.json({ verified: true, id: user.id });
  } else {
    res.json({ verified: false });
  }
});

app.post('/generate-authentication-options', async (req, res) => {
  const { username } = req.body;

  const q = query(collection(db, 'students'), where('registrationNumber', '==', username));
  const userDocs = await getDocs(q);

  if (userDocs.empty) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userDoc = userDocs.docs[0];
  const userId = userDoc.id;

  const user = users.get(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const options = generateAuthenticationOptions({
    timeout: 60000,
    allowCredentials: user.devices.map(dev => ({
      id: dev.credentialID,
      type: 'public-key',
    })),
    userVerification: 'preferred',
  });

  user.currentChallenge = options.challenge;
  res.json(options);
});

app.post('/verify-authentication', async (req, res) => {
  const { credential } = req.body;

  const user = Array.from(users.values()).find(u => u.currentChallenge === credential.response.clientDataJSON.challenge);

  if (!user) {
    return res.status(400).json({ error: 'Invalid challenge' });
  }

  const verification = await verifyAuthenticationResponse({
    credential,
    expectedChallenge: user.currentChallenge,
    expectedOrigin,
    expectedRPID: rpID,
    authenticator: user.devices.find(dev => dev.credentialID === credential.id),
  });

  if (verification.verified) {
    delete user.currentChallenge;
    res.json({ verified: true, id: user.id });
  } else {
    res.json({ verified: false });
  }
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
