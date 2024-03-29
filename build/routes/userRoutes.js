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
// User CRUD endpoints
/*
 Test with curl:

***IMPORTANT REMINDER***
with the curl the '\' when outside of the quotes of changes and updates, represents a multiline query

 curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Elon Musk\", \"email\": \"doge@twitter.com\", \"username\": \"elon\"}"  http://localhost:3000/user/
*/
//Create user
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, username } = req.body;
    try {
        const result = yield prisma.user.create({
            data: {
                email,
                name,
                username,
                bio: "Hello, I'm new here"
            }
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
    }
    ;
}));
// List users
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield prisma.user.findMany({
    // select: { 
    //     id: true, 
    //     name: true, 
    //     image: true,
    //     bio: true
    // }
    });
    res.json(allUser);
}));
// get one user
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: Number(id) },
        include: { tweets: true }
    });
    res.json(user);
}));
/*
 Test with curl:

 curl -X PUT -H "Content-type: application/json" \
      -d '{"name": "Josh", "bio": "Hello there!"} \
      http://localhost:3000/user/1
*/
// Update user
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, bio, image } = req.body;
    try {
        const result = yield prisma.user.update({
            where: { id: Number(id) },
            data: { bio, name, image }
        });
        res.json(result);
    }
    catch (e) {
        res.status(400).json({ error: 'Failed to update the user' });
    }
    res.status(501).json({ error: `Not Implemented: ${id}` });
}));
// Testing to delete users, use the following:
// curl -X DELETE http://localhost:3000/user/3
// Delete user
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.user.delete({ where: { id: Number(id) } });
    res.sendStatus(200);
}));
exports.default = router;
