const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express')
const cors = require('cors')
const app = express()

const maria = require('./database/connect/maria')
maria.connect()

app.use(cors())
app.use(express.json({ extended: true }));

app.get('/', (_, res) => {
    res.send('Hello World')
})

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행 중')
})

app.get('/login', (_, res) => {
    console.log('login 요청 왔음')
})

app.post('/signup', async (req, res) => {
    const { name, password } = req.body
    
    const existingUser = await prisma.user.findUnique({
        where: {
            name
        },
    })

    if(existingUser){
        console.log('400보냄')
        res.send({
            status: 400
        })
        return
    }

    const user = await prisma.user.create({
        data: {
            name,
            password
        }
    })
    console.log(user)
    res.send({
        success: true,
        status: 200
    })
})