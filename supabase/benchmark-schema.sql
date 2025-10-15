-- Benchmark tables for multi-model testing

-- Create benchmark_runs table
CREATE TABLE public.benchmark_runs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    test_input TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create model_responses table
CREATE TABLE public.model_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    benchmark_run_id UUID REFERENCES public.benchmark_runs(id) ON DELETE CASCADE NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_provider VARCHAR(50) NOT NULL,
    response_text TEXT NOT NULL,
    tokens_used INTEGER,
    latency_ms INTEGER,
    cost_usd DECIMAL(10, 6),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create evaluations table
CREATE TABLE public.evaluations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model_response_id UUID REFERENCES public.model_responses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_winner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create api_keys table (for user's own API keys)
CREATE TABLE public.api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'deepseek')),
    encrypted_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_benchmark_runs_user_id ON public.benchmark_runs(user_id);
CREATE INDEX idx_benchmark_runs_prompt_id ON public.benchmark_runs(prompt_id);
CREATE INDEX idx_benchmark_runs_status ON public.benchmark_runs(status);
CREATE INDEX idx_model_responses_benchmark_run ON public.model_responses(benchmark_run_id);
CREATE INDEX idx_model_responses_model_name ON public.model_responses(model_name);
CREATE INDEX idx_evaluations_response_id ON public.evaluations(model_response_id);
CREATE INDEX idx_evaluations_user_id ON public.evaluations(user_id);
CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_provider ON public.api_keys(provider);

-- Enable Row Level Security (RLS)
ALTER TABLE public.benchmark_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for benchmark_runs table
CREATE POLICY "Users can view own benchmark runs" ON public.benchmark_runs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own benchmark runs" ON public.benchmark_runs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own benchmark runs" ON public.benchmark_runs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own benchmark runs" ON public.benchmark_runs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for model_responses table
CREATE POLICY "Users can view responses of their benchmark runs" ON public.model_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.benchmark_runs 
            WHERE benchmark_runs.id = model_responses.benchmark_run_id 
            AND benchmark_runs.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert responses for their benchmark runs" ON public.model_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.benchmark_runs 
            WHERE benchmark_runs.id = model_responses.benchmark_run_id 
            AND benchmark_runs.user_id = auth.uid()
        )
    );

-- RLS Policies for evaluations table
CREATE POLICY "Users can view own evaluations" ON public.evaluations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluations" ON public.evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluations" ON public.evaluations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own evaluations" ON public.evaluations
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for api_keys table
CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Function to encrypt API keys
CREATE OR REPLACE FUNCTION public.encrypt_api_key(key TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Simple base64 encoding for now (in production, use proper encryption)
    RETURN encode(key::bytea, 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt API keys
CREATE OR REPLACE FUNCTION public.decrypt_api_key(encrypted_key TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Simple base64 decoding for now (in production, use proper decryption)
    RETURN convert_from(decode(encrypted_key, 'base64'), 'UTF8');
END;
$$ LANGUAGE plpgsql;
