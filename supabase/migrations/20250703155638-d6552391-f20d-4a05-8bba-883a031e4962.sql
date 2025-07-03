
-- Create a table for friendships
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  friend_id UUID REFERENCES auth.users NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Add Row Level Security (RLS) to friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Create policies for friendships
CREATE POLICY "Users can view friendships they're involved in" 
  ON public.friendships 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create friend requests" 
  ON public.friendships 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friendships they're involved in" 
  ON public.friendships 
  FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete friendships they're involved in" 
  ON public.friendships 
  FOR DELETE 
  USING (auth.uid() = user_id OR auth.uid() = friend_id);
