import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const getQueryClient = () => {
  return new QueryClient();
};

export { dehydrate, HydrationBoundary };
