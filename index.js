const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
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

app.post('/login', async (req, res) => {
    const {name ,password} = req.body
    const key = process.env.JWT_SECRET;

    const user = await prisma.user.findUnique({
        where: {
            name
        }
    })
    
    const token = jwt.sign(
        {
            type: "JWT",
            name: name,
        },
        key,
        {
          expiresIn: "1d",
        }
    )

    if(user && user.password === password){
        console.log('200보냄')
        res.send({
            status:200,
            token: token
        })
    }else{
        console.log('401보냄')
        res.send({
            status:401
        })
    }
    return
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

app.get('/chart', async (req, res) => {
    const key = process.env.JWT_SECRET
    const token = req.headers.authorization

    try {
        jwt.verify(token, key)
        console.log('토큰이 유효합니다.')
        res.send({
            success:true,
            status:200  
        })
    } catch (error) {
        console.error('토큰 검증 오류:', error)
        res.send({
            success:false,
            status:401
        })
    }
});

app.post('/study', async (req,res) => {
    const {what , result} = req.body
    const key = process.env.JWT_SECRET
    const token = req.headers.authorization
    try{
        const decodejwt = jwt.verify(token, key)
        const userid = decodejwt.name
        const Studydata = await prisma.study.create({
            data: {
                subject : what,
                study_time : result,
                user_id : userid
            }
        })
        console.log(Studydata)
        res.send({
            success:true,
            status:200
        })
    }catch(e){
        console.log(e)
        res.send({
            success:false,
            status:400
        })
    }
})

app.get('/getchart', async(req,res) => {
    const key = process.env.JWT_SECRET
    const token = req.headers.authorization
    try{
        const decodejwt = jwt.verify(token, key)
        const userid = decodejwt.name
        const Studydata = await prisma.study.groupBy({
            by: ['subject'],
            _sum: {
                study_time: true
            },
            where: {
                user_id: userid
            }
        })
        console.log(Studydata)
        res.send({
            success:true,
            status:200,
            data:Studydata
        })
    }catch(e){
        console.log(e)
        res.send({
            success:false,
            status:400
        })
    }
})