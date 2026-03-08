import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const NOTIFICATIONS_KEY = ["notifications"];

export interface Notification {
  id: string;
  user_id: string;
  review_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const query = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });

  const unreadCount = query.data?.filter((n) => !n.read).length ?? 0;

  return { ...query, unreadCount, markRead, markAllRead };
};
