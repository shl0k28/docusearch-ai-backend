import { GitbookLoader } from 'langchain/document_loaders/web/gitbook'
import { CharacterTextSplitter } from 'langchain/text_splitter'

const readGitbookData = async (gitbookUrl: string) => {
    const urlLoader = new GitbookLoader(gitbookUrl, {
        shouldLoadAllPaths: true
    })
    const docs = await urlLoader.load()
    const textSplitter = new CharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 0
    })
    const texts = await textSplitter.splitDocuments(docs)
    return { texts }
}

export { readGitbookData }