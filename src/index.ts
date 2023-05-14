import { urlencoded } from 'body-parser'
import { config } from 'dotenv'
import express, { Request, Response } from 'express'
import { readGitbookData } from './utils/readGitbookData'
import { uploadDataToPinecone } from './utils/uploadDataToPinecone'
import { queryPineconeData } from './utils/queryPineconeData'
import cors from 'cors'
config()

const app = express()
const PORT = 8080

app.use(express.json())
app.use(cors())
app.use(urlencoded({ extended: false }))
app.listen(PORT, () => console.log(`${PORT}`))

app.post('/api/load', async (req, res) => {
    const { url } = await req.body
    try {
        const { texts } = await readGitbookData(url)
        // add docs to vector db
        await uploadDataToPinecone(texts)
        res.status(200).json({ message: 'Successfully Created DB '})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ err })
    }
})

app.post('/api/query', async (req, res) => {
    const { prompt } = await req.body
    try {
        console.log(prompt)
        const response = await queryPineconeData(prompt)
        res.status(200).json({ response })
    }
    catch(err){
        console.log(err)
        res.status(500).json({ err })
    }
})