import { Router } from 'express';
import { PrismaClient } from '@prisma/client'

const router = Router();
const prisma = new PrismaClient();

// Tweet CRUD endpoints

/*
 Test with curl:

***IMPORTANT REMINDER***
with the curl the '\' when outside of the quotes of changes and updates, represents a multiline query

 curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Elon Musk\", \"email\": \"doge@twitter.com\", \"username\": \"elon\"}"  http://localhost:3000/user/
*/

//Create tweet
router.post('/', async (req, res) => {
    const { content, image, userId } = req.body;

    try {
        const result = await prisma.tweet.create({
            data: {
                content,
                image,
                userId // TODO manage based on the auth user
            }
        });

        res.json(result);
    } catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
    };
});

// List tweet
router.get('/', async (req, res) => {
    const allTweets = await prisma.tweet.findMany();
    res.json(allTweets);
});

// get one tweet
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });
    if (!tweet) {
        res.status(404).json({error: "Tweet not found!"})
    }

    res.json(tweet);
});

// Update tweet
router.put('/:id', (req, res) => {
    const {id} = req.params;
    res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Delete tweet
router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    await prisma.tweet.delete({ where: { id: Number(id) } })
    res.sendStatus(200);
});

export default router;