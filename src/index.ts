import { Request, Response } from "express"

const { GitbookLoader } = require('langchain/document_loaders/web/gitbook')
const express = require('express')
const app = express()
const PORT = 8080
app.use(express.json())

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