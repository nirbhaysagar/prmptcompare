import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BenchmarkRequest {
  promptId: string
  testData: string
  models: string[]
  apiKeys: Record<string, string>
}

interface ModelResponse {
  model: string
  response: string
  responseTime: number
  tokenCount: number
  cost: number
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { promptId, testData, models, apiKeys }: BenchmarkRequest = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the prompt content
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('content')
      .eq('id', promptId)
      .single()

    if (promptError || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create benchmark run record
    const { data: benchmarkRun, error: benchmarkError } = await supabase
      .from('benchmark_runs')
      .insert({
        prompt_id: promptId,
        test_data: testData,
        models: models,
        status: 'running'
      })
      .select()
      .single()

    if (benchmarkError || !benchmarkRun) {
      return new Response(
        JSON.stringify({ error: 'Failed to create benchmark run' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Run prompts against each model
    const responses: ModelResponse[] = []
    
    for (const model of models) {
      try {
        const response = await runModelPrompt(prompt.content, testData, model, apiKeys)
        responses.push(response)

        // Save model response to database
        await supabase
          .from('model_responses')
          .insert({
            benchmark_run_id: benchmarkRun.id,
            model_name: model,
            response_text: response.response,
            response_time_ms: response.responseTime,
            token_count: response.tokenCount,
            cost_usd: response.cost,
            error_message: response.error
          })
      } catch (error) {
        const errorResponse: ModelResponse = {
          model,
          response: '',
          responseTime: 0,
          tokenCount: 0,
          cost: 0,
          error: error.message
        }
        responses.push(errorResponse)

        // Save error response to database
        await supabase
          .from('model_responses')
          .insert({
            benchmark_run_id: benchmarkRun.id,
            model_name: model,
            response_text: null,
            response_time_ms: 0,
            token_count: 0,
            cost_usd: 0,
            error_message: error.message
          })
      }
    }

    // Update benchmark run as completed
    await supabase
      .from('benchmark_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', benchmarkRun.id)

    return new Response(
      JSON.stringify({
        benchmarkRunId: benchmarkRun.id,
        responses
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function runModelPrompt(promptContent: string, testData: string, model: string, apiKeys: Record<string, string>): Promise<ModelResponse> {
  const startTime = Date.now()
  
  const fullPrompt = `${promptContent}\n\nInput: ${testData}`
  
  switch (model) {
    case 'gpt-4':
    case 'gpt-4-turbo':
    case 'gpt-3.5-turbo':
      return await callOpenAI(fullPrompt, model, apiKeys.openai, startTime)
    
    case 'claude-3-opus':
    case 'claude-3-sonnet':
    case 'claude-3-haiku':
      return await callAnthropic(fullPrompt, model, apiKeys.anthropic, startTime)
    
    case 'gemini-pro':
      return await callGoogle(fullPrompt, apiKeys.google, startTime)
    
    case 'deepseek-chat':
      return await callDeepSeek(fullPrompt, apiKeys.deepseek, startTime)
    
    default:
      throw new Error(`Unsupported model: ${model}`)
  }
}

async function callOpenAI(prompt: string, model: string, apiKey: string, startTime: number): Promise<ModelResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  const responseTime = Date.now() - startTime

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI API error')
  }

  const responseText = data.choices[0]?.message?.content || ''
  const tokenCount = data.usage?.total_tokens || 0
  
  // Rough cost calculation (varies by model)
  const costPerToken = model.includes('gpt-4') ? 0.00003 : 0.000002
  const cost = (tokenCount * costPerToken) / 1000 // Convert to USD

  return {
    model,
    response: responseText,
    responseTime,
    tokenCount,
    cost
  }
}

async function callAnthropic(prompt: string, model: string, apiKey: string, startTime: number): Promise<ModelResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const responseTime = Date.now() - startTime

  if (!response.ok) {
    throw new Error(data.error?.message || 'Anthropic API error')
  }

  const responseText = data.content[0]?.text || ''
  const tokenCount = data.usage?.input_tokens + data.usage?.output_tokens || 0
  
  // Rough cost calculation (varies by model)
  const costPerToken = model.includes('opus') ? 0.000015 : model.includes('sonnet') ? 0.000003 : 0.00000025
  const cost = (tokenCount * costPerToken) / 1000

  return {
    model,
    response: responseText,
    responseTime,
    tokenCount,
    cost
  }
}

async function callGoogle(prompt: string, apiKey: string, startTime: number): Promise<ModelResponse> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    }),
  })

  const data = await response.json()
  const responseTime = Date.now() - startTime

  if (!response.ok) {
    throw new Error(data.error?.message || 'Google API error')
  }

  const responseText = data.candidates[0]?.content?.parts[0]?.text || ''
  const tokenCount = data.usageMetadata?.totalTokenCount || 0
  
  // Rough cost calculation for Gemini Pro
  const costPerToken = 0.0000005
  const cost = (tokenCount * costPerToken) / 1000

  return {
    model,
    response: responseText,
    responseTime,
    tokenCount,
    cost
  }
}

async function callDeepSeek(prompt: string, apiKey: string, startTime: number): Promise<ModelResponse> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  })

  const data = await response.json()
  const responseTime = Date.now() - startTime

  if (!response.ok) {
    throw new Error(data.error?.message || 'DeepSeek API error')
  }

  const responseText = data.choices[0]?.message?.content || ''
  const tokenCount = data.usage?.total_tokens || 0
  
  // Rough cost calculation for DeepSeek
  const costPerToken = 0.0000014
  const cost = (tokenCount * costPerToken) / 1000

  return {
    model,
    response: responseText,
    responseTime,
    tokenCount,
    cost
  }
}
