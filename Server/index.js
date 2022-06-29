import express from 'express'
import mongoose from 'mongoose'
import routes from './routes/router.js'
const app = express()
const PORT = 5000

mongoose
    .connect("mongodb://localhost:27017/todoApp", { useNewUrlParser: true })
    .then(() => {
        app.use(express.json())
        app.use((req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
            res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH");
            next();
        });
        app.use('/api', routes)
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}!`)
        })
    })


