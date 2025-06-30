
-- Fix foreign key relationships for conversations and messages tables
ALTER TABLE conversations 
DROP CONSTRAINT IF EXISTS conversations_participant1_id_fkey,
DROP CONSTRAINT IF EXISTS conversations_participant2_id_fkey;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_participant1_id_fkey 
FOREIGN KEY (participant1_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_participant2_id_fkey 
FOREIGN KEY (participant2_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable realtime for messages
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable realtime for conversations
ALTER TABLE conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- Add encryption column for message content
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS encrypted_content TEXT,
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT false;

-- Update RLS policies to be more secure
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;

CREATE POLICY "Users can view their conversations" ON conversations FOR SELECT 
  USING (auth.uid() = participant1_id OR auth.uid() = participant2_id);

CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

-- Add privacy settings to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS hide_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS anonymous_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS encrypted_messaging BOOLEAN DEFAULT true;
