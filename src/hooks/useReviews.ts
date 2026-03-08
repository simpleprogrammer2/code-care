import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Review = Tables<"reviews">;
type ReviewInsert = TablesInsert<"reviews">;

const REVIEWS_KEY = ["reviews"];

export const useReviews = (filter?: string) => {
  return useQuery({
    queryKey: [...REVIEWS_KEY, filter],
    queryFn: async (): Promise<Review[]> => {
      let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (filter && filter !== "all") {
        query = query.eq("status", filter as Review["status"]);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useReview = (id: string) => {
  return useQuery({
    queryKey: [...REVIEWS_KEY, id],
    queryFn: async (): Promise<Review> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Omit<ReviewInsert, "requester_id">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .insert({ ...review, requester_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REVIEWS_KEY }),
  });
};

export const usePickUpReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reviews")
        .update({ reviewer_id: user.id, status: "in_review" as const })
        .eq("id", reviewId)
        .eq("status", "open")
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REVIEWS_KEY }),
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, feedback, rating }: { reviewId: string; feedback: string; rating: number }) => {
      const { data, error } = await supabase
        .from("reviews")
        .update({
          reviewer_feedback: feedback,
          reviewer_rating: rating,
          status: "completed" as const,
        })
        .eq("id", reviewId)
        .select()
        .single();
      if (error) throw error;

      // Notify the requester
      await supabase.from("notifications").insert({
        user_id: data.requester_id,
        review_id: data.id,
        message: `Your review "${data.title}" has been completed with a ${rating}★ rating!`,
      });

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: REVIEWS_KEY }),
  });
};
