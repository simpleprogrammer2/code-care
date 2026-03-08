
ALTER TABLE public.reviews
  ADD COLUMN source_url text,
  ADD COLUMN num_lines integer,
  ADD COLUMN num_files integer,
  ADD COLUMN submission_type text NOT NULL DEFAULT 'paste';
