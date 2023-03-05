import express from 'express'
import mongoose from 'mongoose'
import Product from './models/Product.js'
import authRoute from './routes/authRoute.js'
import dotenv from "dotenv"
import { v4 } from 'uuid'
import cors from 'cors'
import AWS from 'aws-sdk'
import bodyParser from 'body-parser'
import multer from 'multer'
import fs from 'fs'
import { Stream } from 'stream'


dotenv.config()

const PORT = 8080
const DB_URL = `mongodb+srv://danil8665:3edc4rfv@cluster0.dh2l5no.mongodb.net/?retryWrites=true&w=majority`
const BUCKET = 'my-first-bucket-for-project'

const app = express()

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        mongoose.set('strictQuery', false);
        app.listen(PORT, ()=> {
            console.log(`Server started on port ${PORT}`)
        })
    }
    catch(e) {
        console.log(e)
    }
}
startApp()


app.use(express.json())
app.use('/auth', authRoute)
app.use(bodyParser.urlencoded({ extended: true}));
mongoose.set('strictQuery', true);
app.use(cors());

app.get('/image', (req, res) => {
    getImage()
    try{
        res.json({ message: "Success" })
    }
    catch(error) {
        res.json({ message: error })
    }
  })

  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  

app.post('/upload', upload.single('file'), async (req, res) => {

    const myObject = JSON.parse(req.body.product);

    // Получаем буфер с содержимым файла
    const fileContent = req.file.buffer;

    console.log(myObject);

    let s3 = new AWS.S3({
                region: "us-east-1",
                accessKeyId: "AKIA2CPC77OVWYJ3S25E",
                secretAccessKey: "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",
            })
  const fileKey = `123/${req.file.originalname}`
    // Определяем параметры загрузки файла в S3
    const params = {
      Bucket: BUCKET,
      Key: fileKey, // Имя файла в S3 будет таким же, как на клиенте
      Body: fileContent
    };
  
    // Загружаем файл в S3
    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`File uploaded successfully. File URL: ${data.Location}`);
      }
    });
    const url = s3.getSignedUrl('getObject', {
            Bucket: BUCKET,
            Key: fileKey
    })
                    
        const {manufacturer, name, price, discount, rate} = myObject
        const product = await Product.create({manufacturer, name, price, discount, rate, picture: url})
        res.json(product)
});

app.get('/products', async (req, res) => {
    const products = await Product.find()
    res.json(products)
})

app.get(`/product/:id`, async(req, res) => {
    const productId = await Product.findById(req.params.id)
    res.json(productId)
})