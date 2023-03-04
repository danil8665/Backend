import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_KEY)
            req.userId = decoded.id
            
            next()
        } catch (error) {
            console.log(error) 
            return res.json({
                message: 'Нет доступа.',
            })
        }
    } else {
        return res.json({
            message: 'Нет доступа.',
            
        })
       
    }
}