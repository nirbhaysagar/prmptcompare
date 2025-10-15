-- Seed data for development
-- This file contains sample data to help with development and testing

-- Insert sample prompts for testing (only if no prompts exist)
INSERT INTO public.prompts (id, user_id, title, content, tags)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.users LIMIT 1),
    'Customer Support Response',
    'You are a helpful customer support representative. Respond to the following customer inquiry with empathy, clarity, and actionable solutions. Be concise but thorough.',
    ARRAY['customer-service', 'support', 'template']
WHERE NOT EXISTS (SELECT 1 FROM public.prompts WHERE title = 'Customer Support Response');

INSERT INTO public.prompts (id, user_id, title, content, tags)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.users LIMIT 1),
    'Code Review Assistant',
    'Review the following code and provide feedback on: 1) Code quality and best practices, 2) Potential bugs or issues, 3) Performance optimizations, 4) Security considerations. Be constructive and specific.',
    ARRAY['code-review', 'development', 'feedback']
WHERE NOT EXISTS (SELECT 1 FROM public.prompts WHERE title = 'Code Review Assistant');

INSERT INTO public.prompts (id, user_id, title, content, tags)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.users LIMIT 1),
    'Blog Post Outline Generator',
    'Create a comprehensive outline for a blog post about: [TOPIC]. Include: 1) Engaging introduction hook, 2) 3-5 main sections with key points, 3) Supporting evidence or examples, 4) Strong conclusion with call-to-action. Target audience: [AUDIENCE].',
    ARRAY['content', 'blog', 'outline', 'writing']
WHERE NOT EXISTS (SELECT 1 FROM public.prompts WHERE title = 'Blog Post Outline Generator');

INSERT INTO public.prompts (id, user_id, title, content, tags)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.users LIMIT 1),
    'Email Template Generator',
    'Create a professional email template for: [PURPOSE]. Tone: [TONE]. Include: 1) Clear subject line, 2) Appropriate greeting, 3) Main message with key points, 4) Professional closing. Keep it concise and actionable.',
    ARRAY['email', 'template', 'communication', 'business']
WHERE NOT EXISTS (SELECT 1 FROM public.prompts WHERE title = 'Email Template Generator');

-- Insert sample benchmark run for testing
INSERT INTO public.benchmark_runs (id, user_id, prompt_id, test_data, models, status, completed_at)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.users LIMIT 1),
    (SELECT id FROM public.prompts WHERE title = 'Customer Support Response' LIMIT 1),
    'Customer: "I''ve been waiting for my order for 3 weeks and haven''t received any updates. This is unacceptable!"',
    ARRAY['gpt-4', 'claude-3', 'gemini-pro'],
    'completed',
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.benchmark_runs WHERE test_data LIKE '%Customer: "I''ve been waiting for my order%');

-- Insert sample model responses for the benchmark run
INSERT INTO public.model_responses (id, benchmark_run_id, model_name, response_text, response_time_ms, token_count, cost_usd)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.benchmark_runs WHERE test_data LIKE '%Customer: "I''ve been waiting for my order%' LIMIT 1),
    'gpt-4',
    'I sincerely apologize for the delay in your order. I understand how frustrating this must be, especially without receiving updates. Let me immediately investigate your order status and provide you with a resolution. Could you please provide your order number so I can look into this right away?',
    1250,
    45,
    0.00135
WHERE NOT EXISTS (SELECT 1 FROM public.model_responses WHERE model_name = 'gpt-4' AND response_text LIKE '%I sincerely apologize for the delay%');

INSERT INTO public.model_responses (id, benchmark_run_id, model_name, response_text, response_time_ms, token_count, cost_usd)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.benchmark_runs WHERE test_data LIKE '%Customer: "I''ve been waiting for my order%' LIMIT 1),
    'claude-3',
    'I completely understand your frustration, and I''m truly sorry for this experience. A 3-week delay without communication is absolutely unacceptable. I''m going to personally handle this for you right now. Please share your order number, and I''ll not only check the status but also expedite shipping and provide you with a discount for the inconvenience.',
    980,
    52,
    0.00104
WHERE NOT EXISTS (SELECT 1 FROM public.model_responses WHERE model_name = 'claude-3' AND response_text LIKE '%I completely understand your frustration%');

INSERT INTO public.model_responses (id, benchmark_run_id, model_name, response_text, response_time_ms, token_count, cost_usd)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM public.benchmark_runs WHERE test_data LIKE '%Customer: "I''ve been waiting for my order%' LIMIT 1),
    'gemini-pro',
    'I apologize for the delay and lack of communication regarding your order. This is not the level of service we strive to provide. I''m going to investigate this immediately and ensure you receive your order as soon as possible. Please provide your order number so I can track down what happened and get this resolved for you today.',
    1100,
    48,
    0.00096
WHERE NOT EXISTS (SELECT 1 FROM public.model_responses WHERE model_name = 'gemini-pro' AND response_text LIKE '%I apologize for the delay and lack of communication%');
