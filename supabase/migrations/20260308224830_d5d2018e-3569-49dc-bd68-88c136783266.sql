
-- Update delete policy to allow deleting completed reviews too
DROP POLICY IF EXISTS "Requester can delete own open review" ON public.reviews;
CREATE POLICY "Requester can delete own review"
ON public.reviews
FOR DELETE
TO authenticated
USING (auth.uid() = requester_id AND status IN ('open', 'completed'));
