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

const app = express()
const PORT = 8080

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.listen(PORT, () => console.log(`${PORT}`))

const loadDocument = async (url: string) => {
    const loader = new GitbookLoader(url, { shouldLoadAllPaths: true })
    const docs = await loader.load()
    console.log(docs)
}

app.post('/api/load', async (req: Request, res: Response) => {
    try {
        const { url } = await req.body
        const docs = await loadDocument(url)
        // add docs to vector db
        res.status(200).json({ message: 'Successfully Created DB '})
    }
    catch(err){
        res.status(500).json({ err })
    }
})