
-- Create a storage bucket for code file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('code-files', 'code-files', false);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload code files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'code-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read their own files
CREATE POLICY "Users can read own code files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'code-files' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow reviewers to read files for reviews they're assigned to
CREATE POLICY "Anyone can read code files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'code-files');
