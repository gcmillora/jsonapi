import { NextRequest, NextResponse } from "next/server"
import { ZodTypeAny, z } from "zod"
import { EXAMPLE_ANSWER, EXAMPLE_PROMPT } from "./example"
import { Hono } from "hono"
import { handle } from "hono/vercel"
import { env } from "hono/adapter"
import OpenAI from "openai"

export const runtime = 'edge'

const app = new Hono().basePath("/api")

type Environment = {
    OPENAI_API_KEY: string
}

const jsonSchemaToZod = (schema: any): ZodTypeAny => {
    const type = determineSchemaType(schema)

    switch(type) {
        case "string":
            return z.string().nullable()
        case "number":
            return z.number().nullable()
        case "boolean":
            return z.boolean().nullable()
        case "array":
            return z.array(jsonSchemaToZod(schema.items)).nullable()
        case "object":
            const shape : Record<string, ZodTypeAny> = {}

            for (const key in schema) {
                if(key !== "type"){
                    shape[key] = jsonSchemaToZod(schema[key])
                }
            }

            return z.object(shape).nullable()
        default:
            throw new Error(`Unsupported schema type: ${type}`)
    }
}

const determineSchemaType = (schema: any) => {
    if(!schema.hasOwnProperty("type")) {
        if(Array.isArray(schema)) return "array"
            else{
                return typeof schema
            }
    }
    return schema.type
}

app.get

app.post('/json', async (c) => {

    const { OPENAI_API_KEY } = env<Environment>(c)

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY
    })

    const body = await c.req.json()

    const genericSchema = z.object({
        data: z.string(),
        format: z.object({}).passthrough()
    })

    const { data, format} = genericSchema.parse(body)

    //Create a schema from the expected user format
    const dynamicSchema = jsonSchemaToZod(format)

    type PromiseExecutor<T> =
     (
        resolve: (value: T) => void, 
        reject: (reason?: any) => void
    ) => void

    class RetryablePromise<T> extends Promise<T> {
        static async retry<T>(
            retries: number,
            executor: PromiseExecutor<T>) :Promise<T>{
                return new RetryablePromise(executor).catch((error) => {
                    console.error(`Failed to execute promise: ${error}`)
                    return retries > 0 ?
                        RetryablePromise.retry(retries - 1, executor) : 
                        RetryablePromise.reject()
        })}
    }
    
    const result = await RetryablePromise.retry<object>(3, async (resolve, reject) => {
        try{

            const content = `DATA: \n"${data}"\n\n-----------\nExpected JSON format: 
                    ${JSON.stringify(format,null,2)}
                    \n\n-----------\nValid JSON output in expected format:`

            const res = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "assistant",
                        content: "You are an AI that converts data to the attached JSON format. You respond with nothing but valid JSON based on the input data. Your output should DIRECTLY be valid JSON, nothing added before and after. You will being with the opening curly brace and end with the closing curly brace. Only if you absolutely cannot determine a field, use the value null."
                    },
                    {
                        role: "user",
                        content: EXAMPLE_PROMPT
                    },
                    {
                        role: "user",
                        content: EXAMPLE_ANSWER
                    },
                    {
                        role: "user",
                        content: content

                    }
                ]
            })

            const text = res.choices[0].message.content

            const validationResult = dynamicSchema.parse(JSON.parse(text || ""))

            return resolve(validationResult)
        } catch(error){
            reject(error)
        }
    })

    return c.json(result)
}
)

export default app as never

export const POST = handle(app)