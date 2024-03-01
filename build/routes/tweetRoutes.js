"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Tweet CRUD endpoints
/*
 Test with curl:

***IMPORTANT REMINDER***
with the curl the '\' when outside of the quotes of changes and updates, represents a multiline query

 curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Elon Musk\", \"email\": \"doge@twitter.com\", \"username\": \"elon\"}"  http://localhost:3000/user/
*/
//Create tweet
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content, image } = req.body;
    // @ts-ignore
    const user = req.user;
    console.log(req);
    // res.sendStatus(200);
    try {
        const result = yield prisma.tweet.create({
            data: {
                content,
                image,
                userId: user.id // TODO manage based on the auth user
            },
            include: { user: true }
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
    }
    ;
}));
// List tweet
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTweets = yield prisma.tweet.findMany({
        include: {
            user: {
                //embedding the *select* below allows you to inlcude everything about the tweet, but limit what is returned for the user
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true
                }
            }
        }
    });
    res.json(allTweets);
}));
// get one tweet
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const tweet = yield prisma.tweet.findUnique({
        where: { id: Number(id) },
        include: { user: true }
    });
    if (!tweet) {
        res.status(404).json({ error: "Tweet not found!" });
    }
    res.json(tweet);
}));
// Update tweet
router.put('/:id', (req, res) => {
    const { id } = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}` });
});
// Delete tweet
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.tweet.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
