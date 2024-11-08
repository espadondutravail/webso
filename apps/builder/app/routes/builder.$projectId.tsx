import { type LoaderFunctionArgs } from "@remix-run/server-runtime";
import { redirect } from "~/services/no-store-redirect";
import { builderUrl } from "~/shared/router-utils";

// Support for Auth Token URLs generated by previous Builder versions
// @todo: Remove after 2024-12-31
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (params.projectId === undefined) {
    throw new Response("projectId is required", {
      status: 404,
    });
  }

  const url = new URL(request.url);

  return redirect(
    builderUrl({
      projectId: params.projectId,
      origin: request.url,
      authToken: url.searchParams.get("authToken") ?? undefined,
      mode: url.searchParams.get("mode") === "preview" ? "preview" : "design",
    })
  );
};
