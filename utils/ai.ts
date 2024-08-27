import { StructuredOutputParser } from "langchain/output_parsers";
import OpenAI from "openai";
import { z } from "zod";

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
    .describe("The color of the mood of the person, it should be a hex."),
  negative: z
    .boolean()
    .describe(
      "whether the entry indicates a negative mood of the person or not.",
    ),
});
const parser = StructuredOutputParser.fromZodSchema(schema);

export async function analyze(content: string) {
  const openai = new OpenAI();

  const mes = `
    Analyze the following journal entry:
    ${content}

    and return json following these types and information about each value: ${parser.getFormatInstructions()}
  `;

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: mes,
        },
      ],
    });

    const parsed = await parser.parse(
      gptResponse.choices[0].message.content as string,
    );
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
