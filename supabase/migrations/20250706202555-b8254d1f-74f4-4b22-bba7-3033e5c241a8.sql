
-- Reset all user data to ensure clean state
DELETE FROM messages;
DELETE FROM conversations;
DELETE FROM profiles;

-- Clear all auth users (this will cascade and remove all related data)
DELETE FROM auth.users;

-- Update the profiles table to ensure we have proper constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Ensure the handle_new_user function creates clean profiles
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email_notifications, two_factor_enabled)
  VALUES (NEW.id, true, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
