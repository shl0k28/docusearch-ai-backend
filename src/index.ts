import { GitbookLoader } from 'langchain/document_loaders/web/gitbook'
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { Document } from 'langchain/document'
import { PineconeClient } from '@pinecone-database/pinecone'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { OpenAI } from 'langchain/llms/openai'
import { VectorDBQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { urlencoded } from 'body-parser'
import { config } from 'dotenv'
import express, { Request, Response } from 'express'
import { readGitbookData } from './utils/readGitbookData'
import { uploadDataToPinecone } from './utils/uploadDataToPinecone'
import { queryPineconeData } from './utils/queryPineconeData'

config()

const app = express()
const PORT = 8080

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.listen(PORT, () => console.log(`${PORT}`))

app.post('/api/load', async (req, res) => {
    try {
        const { url } = await req.body
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
    try {
        const { prompt } = await req.body
        const response = await queryPineconeData(prompt)
        res.status(200).json({ response })
    }
    catch(err){
        console.log(err)
        res.status(500).json({ err })
    }
})