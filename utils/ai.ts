import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { z } from "zod";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { pull } from "langchain/hub";

const schema = z.object({
  mood: z
    .string()
    .describe(
      "The mood of the person who wrote the text of the journal entry.",
    ),
  summary: z
    .string()
    .describe(
      "A quick concise summary of the journal entry, not more than 50 chars.",
    ),
  color: z
    .string()
    .describe(
      "The color of the mood of the person, it should be a hex.",
    ),
  negative: z
    .boolean()
    .describe(
      "whether the entry indicates a negative mood of the person or not.",
    ),
});
const parser = StructuredOutputParser.fromZodSchema(schema);

export async function analyze(content: string) {
  const openai = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  const mes = `
    Analyze the following journal entry:
    ${content}

    and return json following these types and information about each value: ${parser.getFormatInstructions()}
  `;

  try {
    const gptResponse = await openai.invoke(mes);

    const parsed = await parser.parse(gptResponse.content as string);
    return parsed;
  } catch (error) {
    return {
      mood: "unknown",
      summary: "unknown",
      color: "unknown",
      negative: false,
    };
  }
}

export async function qa(question: string, context: any[]) {
  const docs = context.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { id: entry.id, createdAt: entry.createdAt },
      }),
  );

  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
  });
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await MemoryVectorStore.fromDocuments(
    docs,
    embeddings,
  );
  const similaritySearch = await vectorStore.similaritySearch(
    question,
  );

  const promptTemplate = await pull("rlm/rag-prompt");

  const prompt = await promptTemplate.invoke({
    question,
    context: similaritySearch
      .map((s) => `${s.metadata.createdAt}: ${s.pageContent}`)
      .join("\n"),
  });

  const result = await model.invoke(prompt);

  return result.content;
}
