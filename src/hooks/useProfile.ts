import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useProfileByReviewerId = (reviewerId: string | null) => {
  return useQuery({
    queryKey: ["profile", reviewerId],
    queryFn: async (): Promise<Profile | null> => {
      if (!reviewerId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", reviewerId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!reviewerId,
  });
};
