import express from 'express'
import userRoutes from './modules/users/users.routes'

const app = express()

app.use(express.json())
app.use('/users', userRoutes)

export default app