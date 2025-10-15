-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Prompts policies
CREATE POLICY "Users can view own prompts" ON public.prompts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON public.prompts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON public.prompts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON public.prompts
    FOR DELETE USING (auth.uid() = user_id);

-- Prompt versions policies
CREATE POLICY "Users can view prompt versions for own prompts" ON public.prompt_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.prompts 
            WHERE id = prompt_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert prompt versions for own prompts" ON public.prompt_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.prompts 
            WHERE id = prompt_id AND user_id = auth.uid()
        )
    );

-- Benchmark runs policies
CREATE POLICY "Users can view own benchmark runs" ON public.benchmark_runs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own benchmark runs" ON public.benchmark_runs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own benchmark runs" ON public.benchmark_runs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own benchmark runs" ON public.benchmark_runs
    FOR DELETE USING (auth.uid() = user_id);

-- Model responses policies
CREATE POLICY "Users can view model responses for own benchmark runs" ON public.model_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.benchmark_runs 
            WHERE id = benchmark_run_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert model responses for own benchmark runs" ON public.model_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.benchmark_runs 
            WHERE id = benchmark_run_id AND user_id = auth.uid()
        )
    );

-- Evaluations policies
CREATE POLICY "Users can view own evaluations" ON public.evaluations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evaluations" ON public.evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evaluations" ON public.evaluations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own evaluations" ON public.evaluations
    FOR DELETE USING (auth.uid() = user_id);

-- API keys policies
CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage tracking" ON public.usage_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage tracking" ON public.usage_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage tracking" ON public.usage_tracking
    FOR UPDATE USING (auth.uid() = user_id);
