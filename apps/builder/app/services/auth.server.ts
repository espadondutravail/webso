import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy, type GitHubProfile } from "remix-auth-github";
import { GoogleStrategy, type GoogleProfile } from "remix-auth-google";
import * as db from "~/shared/db";
import { sessionStorage } from "~/services/session.server";
import { AUTH_PROVIDERS } from "~/shared/session";
import { authCallbackPath, isBuilder } from "~/shared/router-utils";
import { getUserById, type User } from "~/shared/db/user.server";
import env from "~/env/env.server";
import { builderAuthenticator } from "./builder-auth.server";
import { staticEnv } from "~/env/env.static.server";

const transformRefToAlias = (input: string) => {
  const rawAlias = input.endsWith(".staging") ? input.slice(0, -8) : input;

  return rawAlias
    .replace(/[^a-zA-Z0-9_-]/g, "") // Remove all characters except a-z, A-Z, 0-9, _ and -
    .toLowerCase() // Convert to lowercase
    .replace(/_/g, "-") // Replace underscores with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
};

export const callbackOrigin =
  env.DEPLOYMENT_ENVIRONMENT === "production"
    ? env.DEPLOYMENT_URL
    : env.DEPLOYMENT_ENVIRONMENT === "staging" ||
        env.DEPLOYMENT_ENVIRONMENT === "development"
      ? `https://${transformRefToAlias(staticEnv.GITHUB_REF_NAME ?? "main")}.${env.DEPLOYMENT_ENVIRONMENT}.webstudio.is`
      : `https://wstd.dev:${env.PORT || 5173}`;

const strategyCallback = async ({
  profile,
}: {
  profile: GitHubProfile | GoogleProfile;
}) => {
  try {
    const user = await db.user.createOrLoginWithOAuth(profile);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error({
        error,
        extras: {
          loginMethod: AUTH_PROVIDERS.LOGIN_DEV,
        },
      });
    }
    throw error;
  }
};

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
});

if (env.GH_CLIENT_ID && env.GH_CLIENT_SECRET) {
  const github = new GitHubStrategy(
    {
      clientID: env.GH_CLIENT_ID,
      clientSecret: env.GH_CLIENT_SECRET,
      callbackURL: `${callbackOrigin}${authCallbackPath({ provider: "github" })}`,
    },
    strategyCallback
  );
  authenticator.use(github, "github");
}

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  const google = new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${callbackOrigin}${authCallbackPath({ provider: "google" })}`,
    },
    strategyCallback
  );
  authenticator.use(google, "google");
}

if (env.DEV_LOGIN === "true") {
  authenticator.use(
    new FormStrategy(async ({ form }) => {
      const secretValue = form.get("secret");

      if (secretValue == null) {
        throw new Error("Secret is required");
      }

      const [secret, email = "hello@webstudio.is"] = secretValue
        .toString()
        .split(":");

      if (secret === env.AUTH_SECRET?.slice(0, 4)) {
        try {
          const user = await db.user.createOrLoginWithDev(email);
          return user;
        } catch (error) {
          if (error instanceof Error) {
            console.error({
              error,
              extras: {
                loginMethod: AUTH_PROVIDERS.LOGIN_DEV,
              },
            });
          }
          throw error;
        }
      }

      throw new Error("Secret is incorrect");
    }),
    "dev"
  );
}

export const findAuthenticatedUser = async (request: Request) => {
  const user = isBuilder(request)
    ? await builderAuthenticator.isAuthenticated(request)
    : await authenticator.isAuthenticated(request);

  if (user == null) {
    return null;
  }

  try {
    return await getUserById(user.id);
  } catch (error) {
    return null;
  }
};
