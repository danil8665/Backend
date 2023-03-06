import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' 
import Role from '../models/Role.js'
import Product from '../models/Product.js'
import dotenv from "dotenv"
import router from '../routes/authRoute.js'
dotenv.config()

export const login = async (req, res) => {
   try {
       const { username, password } = req.body

       const user = await User.findOne({ username })
       if (!user) {
           return res.status(401).json({
               message: 'Такого юзера не существует.',

           })
       }

       const isPasswordCorrect = await bcrypt.compare(password, user.password)

       if (!isPasswordCorrect) {
           return res.json({
               message: 'Неверный пароль.',
           })
       }

       const token = jwt.sign(
           {
               id: user._id,
               role: user.role
           },
           ''+ process.env.JWT_KEY,
           { expiresIn: '6h' },
       )

       res.json({
           token,
           user,
           message: 'Вы вошли в систему.',
       })

       
   } catch (error) {
       res.json({ message: 'Ошибка при авторизации.' })   
   }
}

export const register = async (req, res) => {
    try {
        const { username, password } = req.body
 
        const isUsed = await User.findOne({ username })
 
        if (isUsed) {
            return res.json({
                message: 'Данный username уже занят.',
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const userRole = await Role.findOne({value: "USER"})
 
        const newUser = await User.create({username, password: hash, role: userRole.value})
        res.json({
            newUser,
            message: 'Регистрация прошла успешно.',
        })
    } 
    catch (error) {
        res.json({ message: 'Ошибка при создании пользователя.' })
        console.log(error)
    }
 }

 export const getMe = async (req, res) => {
    try{
     
      const user = await User.findById(req.userId)
      if (!user) {
         return res.json({
             message: 'Такого юзера не существует.',
         })
     }

     const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        ''+ process.env.JWT_KEY,
        { expiresIn: '6h' },

    )
    res.json({ user, token });
    }
    catch(error) {
      res.json({ message: 'Нет доступа' })
      console.log(error.message)
    }
}


//  export const getMe = async (req, res) => {
//     try{
     
//       const user = await User.findById(req.userId)
//       if (!user) {
//          return res.json({
//              message: 'Такого юзера не существует.',
//          })
//      }

//      const token = jwt.sign(
//         {
//             id: user._id,
//             role: user.role
//         },
//         ''+ process.env.JWT_KEY,
//         { expiresIn: '6h' },

//     )
//     res.json({
//         user,
//         token, 
//     })
//     }
//     catch(error) {
//       res.json({ message: 'Нет доступа' })
//       console.log(error.message)
//     }
//  } 