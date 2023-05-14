import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";

dotenv.config();

const queryPineconeData = async (query: string) => {

    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY as string,
      environment: process.env.PINECONE_ENVIRONMENT as string,
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX as string);
    
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex }
    );
    

    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
        k: 1,
        returnSourceDocuments: true,
    });
    const response = await chain.call({ query });
    console.log(response);
    return response
}

export { queryPineconeData }