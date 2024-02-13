import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import User from "./Database/models/User.mjs"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors({
    credentials: true
}))


app.get('/', async (req, res) => {
    const users = await User.all();
    res.send(users)
})

app.post('/login', async (req, res) => {
    // Finding a user in the database by email.
    const user = await User.find(req.body.email)

    // Compare encrypted password with DB password
    const passwordCheck = await bcrypt.compare(req.body.password, user.password)

    // handle request accordingly
    if(!passwordCheck) {
        res.send({returnMessage: "wrong username or password"})
    } else {
        // Sign the JWT token (transform specific user data into token)
        const accessToken = sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                validation: "user.confirmed"
            },
            process.env.JWT_ACCESS_TOKEN
        );
        
        // Create a cookie to save the JWT data
        res.cookie("basile.tokens.uniqueName", accessToken, { maxAge: 60*60*24*30*1000, httpOnly: true})

        // Send back the access token and authenticated (optional?)
        res.send({
            accessToken: accessToken,
            auth: {id: user.id, name: user.name, email: user.email, validated: "user.confirmed"}
        })
    }
})

app.post('/new-user', async (req, res) => {
    const user = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        is_admin: false
    }
    await User.create(user)
        .then(()=>console.log("User added"))

    res.send({status: "OK"})
})

// app.get('/logout', authenticateToken, (req, res) => {
//     res.clearCookie('user-token')
//     res.json({message: "User is logged out!"})
// })

app.listen(PORT, () => {
    console.log(" _    _      _                            _   _ ")
    console.log("| |  | |    | |                          | | | |")
    console.log("| |  | | ___| | ___ ___  _ __ ___   ___  | | | |")
    console.log("| |/\\| |/ _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\ | | | |")
    console.log("\\  /\\  /  __/ | (_| (_) | | | | | |  __/ |_| |_|")
    console.log(" \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___| (_) (_)")
    console.log('');
    console.log(`This server is running on:`)
    console.log('');
    console.log(`~ ${process.env.DOMAIN}:${PORT}`);
})