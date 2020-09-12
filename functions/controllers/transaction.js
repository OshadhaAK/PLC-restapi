const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');

const db = admin.firestore();

const userApp= express();

userApp.use(cors({ origin: true }));

userApp.get('/', async (req,res) => {
    const snapshot = await db.collection("transactions").get();

    let transactions = [];
    snapshot.forEach((doc) => {
        let id = doc.id;
        let data = doc.data();

        transactions.push({ id, ...data });
    });

    res.status(200).send(JSON.stringify(transactions));
});

userApp.get("/:id", async (req, res) => {
    const snapshot = await db.collection('transactions').doc(req.params.id).get();

    const transactionId = snapshot.id;
    const transactionData = snapshot.data();

    res.status(200).send(JSON.stringify({ id: transactionId, ...transactionData}));
});



userApp.post('/', async (req,res) => {
    const transaction = req.body;
    await db.collection('transactions').add(transaction);
    res.status(201).send();
});

exports.transaction = functions.https.onRequest(userApp);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
