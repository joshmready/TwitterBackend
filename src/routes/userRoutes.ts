import { Router } from 'express';
import { PrismaClient } from '@prisma/client'

const router = Router();
const prisma = new PrismaClient();

// User CRUD endpoints

/*
 Test with curl:

***IMPORTANT REMINDER***
with the curl the '\' when outside of the quotes of changes and updates, represents a multiline query

 curl -X POST -H "Content-Type: application/json" -d "{\"name\": \"Elon Musk\", \"email\": \"doge@twitter.com\", \"username\": \"elon\"}"  http://localhost:3000/user/
*/

//Create user
router.post('/', async (req, res) => {
    const { email, name, username } = req.body;

    try {
        const result = await prisma.user.create({
            data: {
                email,
                name,
                username,
                bio: "Hello, I'm new here"
            }
        });

        res.json(result);
    } catch (e) {
        res.status(400).json({ error: 'Username and email should be unique' });
    };

});

// List users
router.get('/', async (req, res) => {
    const allUser = await prisma.user.findMany();

    res.json(allUser);
});

// get one user
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } })

    res.json(user);
});

/*
 Test with curl:

 curl -X PUT -H "Content-type: application/json" \
      -d '{"name": "Josh", "bio": "Hello there!"} \
      http://localhost:3000/user/1
*/

// Update user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, bio, image } = req.body;

    try {
        const result = await prisma.user.update({
            where: { id: Number(id) },
            data: { bio, name, image }
        })
        res.json(result)
    } catch (e) {
        res.status(400).json({ error: 'Failed to update the user' })
    }

    res.status(501).json({ error: `Not Implemented: ${id}` });
});

// Testing to delete users, use the following:
// curl -X DELETE http://localhost:3000/user/3

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } })
    res.sendStatus(200);
});

export default router;