import { currentUser } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const user = await currentUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

const generatePaypalAccessToken = middleware(async (opts) => {
  const paypalClientId: string = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const paypalSecretKey: string = process.env.PAYPAL_SECRET_KEY!;
  const paypalBaseUrl: string = process.env.PAYPAL_BASE_URL!;

  try {
    if (!paypalClientId || !paypalSecretKey) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(paypalClientId + ":" + paypalSecretKey).toString(
      "base64"
    );

    const config: AxiosRequestConfig = {
      method: "post",
      url: `${paypalBaseUrl}/v1/oauth2/token`,
      data: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };

    const response: AxiosResponse = await axios(config);
    if (response.status !== 200) {
      throw new Error(
        `Failed to generate Access Token: ${response.statusText}`
      );
    }
    const data: any = await response.data;

    return opts.next({
      ctx: {
        paypalAccessToken: data.access_token,
      },
    });
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Failed to generate access token!",
    });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const paypalProcedure = privateProcedure.use(generatePaypalAccessToken);
