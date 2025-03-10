import { createHash } from "crypto";
import { kv } from "@vercel/kv";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const user = await kv.get(`user:${email}`);
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = createHash("sha256").update(password).digest("hex");
    if (user.password !== hashedPassword) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ email }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
}
