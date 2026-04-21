import express from 'express'
import swaggerUi from 'swagger-ui-express'
import authRoutes from './modules/auth/auth.routes'
import userRoutes from './modules/users/users.routes'
import adminRoutes from './modules/admin/admin.routes'
import exerciseRoutes from './modules/exercises/exercises.routes'
import { errorHandler } from './middlewares/errorHandler'
import { swaggerDocument } from './lib/swagger'

const app = express()

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)
app.use('/exercises', exerciseRoutes)
app.use(errorHandler)

export default app