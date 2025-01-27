import { User } from "@supabase/supabase-js";
import { createContext, Resource, useContext } from "solid-js";

type UserContextObject = {
  data: Resource<{ user: User | null; error: Error | null }>;
  refetch: (info?: unknown) =>
    | {
      user: User | null;
      error: Error | null;
    }
    | Promise<
      | {
        user: User | null;
        error: Error | null;
      }
      | undefined
    >
    | null
    | undefined;
};

export const UserContext = createContext<UserContextObject>();

export function useUser() {
  return useContext(UserContext)!;
}
