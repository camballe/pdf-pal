import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc";
import BASE_URL from "@/config/baseUrl"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: `${BASE_URL}/api/trpc`,
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
