import {
  createTRPCProxyClient,
  httpBatchLink,
  TRPCClientError,
} from "@trpc/client";
import { sharedRouter, type SharedRouter } from "./router";
import { callerLink } from "../trpc-caller-link";

type SharedClientOptions = {
  url: string;
  apiToken: string;
};

export const createTRPCProxyServiceClient = (
  options?: SharedClientOptions | undefined
) => {
  if (options !== undefined) {
    const remoteClient = createTRPCProxyClient<SharedRouter>({
      links: [
        httpBatchLink({
          url: options.url,
          headers: () => ({
            Authorization: options.apiToken,
          }),
        }),
      ],
    });

    return remoteClient;
  }

  const client = createTRPCProxyClient<SharedRouter>({
    links: [
      callerLink({
        appRouter: sharedRouter,
      }),
    ],
  });

  return client;
};
