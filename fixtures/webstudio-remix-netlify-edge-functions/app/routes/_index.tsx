/* eslint-disable camelcase */
import {
  type V2_ServerRuntimeMetaFunction,
  type LinksFunction,
  type LinkDescriptor,
  type ActionArgs,
  type LoaderArgs,
  json,
} from "@remix-run/server-runtime";
import type { Page as PageType, SiteMeta } from "@webstudio-is/sdk";
import { ReactSdkContext } from "@webstudio-is/react-sdk";
import { n8nHandler, getFormId } from "@webstudio-is/form-handlers";
import { Scripts, ScrollRestoration } from "@remix-run/react";
import {
  fontAssets,
  pageData,
  user,
  projectId,
  pagesPaths,
  formsProperties,
  Page,
  imageAssets,
} from "../__generated__/_index.tsx";
import css from "../__generated__/index.css";
import { assetBaseUrl, imageBaseUrl, imageLoader } from "~/constants.mjs";

export type PageData = {
  site?: SiteMeta;
  page: PageType;
};

export const loader = async (arg: LoaderArgs) => {
  const host =
    arg.request.headers.get("x-forwarded-host") ||
    arg.request.headers.get("host") ||
    "";
  return json({ host });
};

export const meta: V2_ServerRuntimeMetaFunction<typeof loader> = ({ data }) => {
  const { page, site } = pageData;

  const metas: ReturnType<V2_ServerRuntimeMetaFunction> = [
    { title: page.title },
    {
      property: "og:title",
      content: page.title,
    },
  ];

  if (site?.siteName) {
    metas.push({
      property: "og:site_name",
      content: site.siteName,
    });
    metas.push({
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.siteName,
        url: `https://${data?.host}`,
      },
    });
  }

  if (page.meta.description) {
    metas.push({
      name: "description",
      content: page.meta.description,
    });
    metas.push({
      property: "og:description",
      content: page.meta.description,
    });
  }

  if (page.meta.socialImageAssetId) {
    const imageAsset = imageAssets.find(
      (asset) => asset.id === page.meta.socialImageAssetId
    );

    if (imageAsset) {
      metas.push({
        property: "og:image",
        content: imageLoader({
          src: imageAsset.name,
          // Do not transform social image (not enough information do we need to do this)
          format: "raw",
        }),
      });
    }
  }

  return metas;
};

export const links: LinksFunction = () => {
  const result: LinkDescriptor[] = [];

  result.push({
    rel: "stylesheet",
    href: css,
  });

  const { site } = pageData;

  if (site?.faviconAssetId) {
    const imageAsset = imageAssets.find(
      (asset) => asset.id === site.faviconAssetId
    );

    if (imageAsset) {
      result.push({
        rel: "icon",
        href: imageLoader({
          src: imageAsset.name,
          // Do not transform favicon
          // We need to know supported formats before to do this
          format: "raw",
        }),
        type: undefined,
      });
    }
  } else {
    result.push({
      rel: "icon",
      href: "/favicon.ico",
      type: "image/x-icon",
    });

    result.push({
      rel: "shortcut icon",
      href: "/favicon.ico",
      type: "image/x-icon",
    });
  }

  for (const asset of fontAssets) {
    if (asset.type === "font") {
      result.push({
        rel: "preload",
        href: assetBaseUrl + asset.name,
        as: "font",
        crossOrigin: "anonymous",
        // @todo add mimeType
        // type: asset.mimeType,
      });
    }
  }

  return result;
};

const getRequestHost = (request: Request): string =>
  request.headers.get("x-forwarded-host") || request.headers.get("host") || "";

const getMethod = (value: string | undefined) => {
  if (value === undefined) {
    return "post";
  }

  switch (value.toLowerCase()) {
    case "get":
      return "get";
    default:
      return "post";
  }
};

export const action = async ({ request, context }: ActionArgs) => {
  const formData = await request.formData();

  const formId = getFormId(formData);
  if (formId === undefined) {
    // We're throwing rather than returning { success: false }
    // because this isn't supposed to happen normally: bug or malicious user
    throw json("Form not found", { status: 404 });
  }

  const formProperties = formsProperties.get(formId);

  // form properties are not defined when defaults are used
  const { action, method } = formProperties ?? {};

  const email = user?.email;

  if (email == null) {
    return { success: false };
  }

  // wrapped in try/catch just in cases new URL() throws
  // (should not happen)
  let pageUrl: URL;
  try {
    pageUrl = new URL(request.url);
    pageUrl.host = getRequestHost(request);
  } catch {
    return { success: false };
  }

  if (action !== undefined) {
    try {
      // Test that action is full URL
      new URL(action);
    } catch {
      return json(
        {
          success: false,
          error: "Invalid action URL, must be valid http/https protocol",
        },
        { status: 200 }
      );
    }
  }

  const formInfo = {
    formData,
    projectId,
    action: action ?? null,
    method: getMethod(method),
    pageUrl: pageUrl.toString(),
    toEmail: email,
    fromEmail: pageUrl.hostname + "@webstudio.email",
  } as const;

  const result = await n8nHandler({
    formInfo,
    hookUrl: context.N8N_FORM_EMAIL_HOOK as string,
  });

  return result;
};

const Outlet = () => {
  return (
    <ReactSdkContext.Provider
      value={{
        imageLoader,
        assetBaseUrl,
        imageBaseUrl,
        pagesPaths,
      }}
    >
      <Page
        scripts={
          <>
            <Scripts />
            <ScrollRestoration />
          </>
        }
      />
    </ReactSdkContext.Provider>
  );
};

export default Outlet;
