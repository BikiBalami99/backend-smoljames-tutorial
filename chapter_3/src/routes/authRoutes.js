import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Try tot save the new user and hashed password to the db
    try {
        const insertUser = db.prepare(`
                INSERT INTO users (username, password)
                VALUES (?, ?)
            `);
        const result = insertUser.run(username, hashedPassword);

        // Create a default TODO for a new user
        const defaultTodo = `Hello! This is your first todo.`;
        const insertTodo = db.prepare(`
                INSERT INTO todos (user_id, task)
                VALUES (?, ?)
            `);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        // Create a token
        const token = jwt.sign(
            { id: result.lastInsertRowid },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    try {
        const getUser = db.prepare(`
                SELECT * FROM users
                WHERE username = ?
            `);
        const user = getUser.get(username);

        //Guard Clause
        if (!user) return res.status(404).send({ message: "User not found." });

        // If User exists

        // Checking if the password is correct
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid)
            return res.status(401).send({ message: "Invalid password" });

        // User exists and password is correct
        console.log(`user: ${JSON.stringify(user)}`);

        // Sign the token and give them back the token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }
});

export default router;
