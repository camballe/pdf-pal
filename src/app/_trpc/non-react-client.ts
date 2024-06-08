import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/trpc";

const nonReactTrpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "https://pdfpal.enkambale.com/api/trpc",
    }),
  ],
});

export default nonReactTrpcClient;
