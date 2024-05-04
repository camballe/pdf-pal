import { currentUser } from "@clerk/nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if (!user?.id || !user.primaryEmailAddress?.emailAddress)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: { id: user.id },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.primaryEmailAddress.emailAddress,
        },
      });
    }

    return { success: true };
  }),
});

export type AppRouter = typeof appRouter;
