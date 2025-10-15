-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'team')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompts table
CREATE TABLE public.prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompt_versions table
CREATE TABLE public.prompt_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    change_notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, version_number)
);

-- Create indexes for better performance
CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompts_tags ON public.prompts USING GIN(tags);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX idx_prompt_versions_prompt_id ON public.prompt_versions(prompt_id);
CREATE INDEX idx_prompt_versions_created_at ON public.prompt_versions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for prompts table
CREATE POLICY "Users can view own prompts" ON public.prompts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON public.prompts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prompts" ON public.prompts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prompts" ON public.prompts
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for prompt_versions table
CREATE POLICY "Users can view versions of their prompts" ON public.prompt_versions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.prompts 
            WHERE prompts.id = prompt_versions.prompt_id 
            AND prompts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert versions for their prompts" ON public.prompt_versions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.prompts 
            WHERE prompts.id = prompt_versions.prompt_id 
            AND prompts.user_id = auth.uid()
        )
    );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON public.prompts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
