import { PineconeClient } from '@pinecone-database/pinecone'
import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { config } from 'dotenv'

config()

const uploadDataToPinecone = async (docs: Document<Record<string, any>>[]) => {
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
    })
    const pineconeClient = new PineconeClient()
    await pineconeClient.init({
        apiKey: process.env.PINECONE_API_KEY as string,
        environment: process.env.PINECONE_ENVIRONMENT as string
    })
    const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX as string)

    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex
    })
}

export { uploadDataToPinecone }