import { createHash } from "crypto";
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const hashedPassword = createHash("sha256").update(password).digest("hex");

    await kv.set(`user:${email}`, JSON.stringify({ email, password: hashedPassword }));
    
    res.status(201).json({ message: "User registered successfully" });
}
