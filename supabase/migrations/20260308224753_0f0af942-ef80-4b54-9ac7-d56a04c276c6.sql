
-- Add completed_at timestamp to reviews
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone DEFAULT NULL;

-- Create a trigger to set completed_at when status changes to 'completed'
CREATE OR REPLACE FUNCTION public.set_completed_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_completed_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.set_completed_at();
