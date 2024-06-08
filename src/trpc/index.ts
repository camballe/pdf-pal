import { currentUser } from "@clerk/nextjs/server";
import {
  paypalProcedure,
  privateProcedure,
  publicProcedure,
  router,
} from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { CreatedSubscription, SubscriptionDetails } from "@/types/paypal";

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

  createPaypalSubscriptionOrder: paypalProcedure
    .input(z.object({ planId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { paypalAccessToken } = ctx;
      const { planId } = input;

      try {
        const config: AxiosRequestConfig = {
          method: "post",
          url: `${process.env.PAYPAL_BASE_URL!}/v1/billing/subscriptions`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${paypalAccessToken}`,
            Accept: "application/json",
            Prefer: "return=representation",
          },
          data: {
            plan_id: planId,
            application_context: {
              user_action: "SUBSCRIBE_NOW",
            },
          },
        };

        const response: AxiosResponse = await axios(config);

        return {
          data: <CreatedSubscription>response.data,
        };
      } catch (error: any) {
        console.error("Failed to create order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order!",
        });
      }
    }),

  approvePaypalSubscriptionOrder: paypalProcedure
    .input(
      z.object({
        paypalPlanId: z.string(),
        paypalSubscriptionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, paypalAccessToken } = ctx;
      const { paypalPlanId, paypalSubscriptionId } = input;

      try {
        if (!paypalSubscriptionId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No subscription id!",
          });
        }

        const config: AxiosRequestConfig = {
          method: "get",
          url: `${process.env
            .PAYPAL_BASE_URL!}/v1/billing/subscriptions/${paypalSubscriptionId}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${paypalAccessToken}`,
            Accept: "application/json",
          },
        };

        const response: AxiosResponse = await axios(config);

        const subscriptionDetails: SubscriptionDetails = response.data;

        await db.user.update({
          where: { id: userId },
          data: {
            paypalPayerId: subscriptionDetails.subscriber.payer_id,
            paypalPlanId,
            paypalSubscriptionId,
            paypalNextBillingTime:
              subscriptionDetails.billing_info.next_billing_time,
          },
        });

        return {
          message: "Subscription successful!",
        };
      } catch (error) {
        console.error("Error approving order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error approving order!",
        });
      }
    }),

  getPaypalSubscriptionDetails: paypalProcedure
    .input(
      z.object({
        paypalSubscriptionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { paypalAccessToken } = ctx;
      const { paypalSubscriptionId } = input;
      try {
 if (!paypalSubscriptionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No subscription id!",
        });
      }

      const config: AxiosRequestConfig = {
        method: "get",
        url: `${process.env
          .PAYPAL_BASE_URL!}/v1/billing/subscriptions/${paypalSubscriptionId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paypalAccessToken}`,
          Accept: "application/json",
        },
      };

      const response: AxiosResponse = await axios(config);

      return {
        data: <SubscriptionDetails>response.data,
      };
      } catch (error) {
        console.error("Error getting subscription details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error getting subscription details!",
        });
      }
     
    }),

  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),

  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          createdAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: { id: input.fileId, userId: ctx.userId },
      });

      if (!file) return { status: "PENDING" as const };

      return { status: file.uploadStatus };
    }),

  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),

  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });

      return file;
    }),
});

export type AppRouter = typeof appRouter;
