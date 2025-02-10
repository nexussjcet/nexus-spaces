import { HfInference } from "@huggingface/inference"

const inference = new HfInference(process.env.HF_API_KEY!);

export async function generateEmbeddings(text: string) {
    const result = await inference.featureExtraction({
        model: "thenlper/gte-base",
        inputs: text
    })
    console.log(result)
    return result as Array<number>;
}
