import nonReactTrpcClient from "@/app/_trpc/non-react-client";
import { PLANS } from "@/config/paypalPlans";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getUserSubscriptionPlan() {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (!user.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      paypalNextBillingTime: null,
    };
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      paypalNextBillingTime: null,
    };
  }

  const isSubscribed = Boolean(
    dbUser.paypalPlanId &&
      dbUser.paypalNextBillingTime &&
      dbUser.paypalSubscriptionId
  );

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.planId === dbUser.paypalPlanId)
    : null;

  let isCanceled = false;
  if (isSubscribed) {
    const response =
      await nonReactTrpcClient.getPaypalSubscriptionDetails.query({
        paypalSubscriptionId: dbUser.paypalSubscriptionId!,
      });

    isCanceled = Boolean(response.data.status === "CANCELLED");
  }

  return {
    ...plan,
    paypalSubscriptionId: dbUser.paypalSubscriptionId,
    paypalNextBillingTime: dbUser.paypalNextBillingTime,
    paypalPayerId: dbUser.paypalPayerId,
    isSubscribed,
    isCanceled,
  };
}
