import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// routes

import userRouter from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import shopRoutes from './routes/shop.route.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use('/api/v1', productRoutes);
app.use("/api/v1/",shopRoutes)




export {app}