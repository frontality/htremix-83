
-- Add unique constraint to username column in profiles table
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Update the handle_new_user function to not use email as username
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile without setting username from email
  INSERT INTO public.profiles (id, email_notifications, two_factor_enabled)
  VALUES (NEW.id, true, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
