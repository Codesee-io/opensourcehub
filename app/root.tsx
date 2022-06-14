import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwindStyles from "./styles/index.css";
import gradientStyles from "~/styles/gradient.css";
import { getCurrentUserInfo } from "./session.server";
import RootLayout from "./components/RootLayout";
import { UserInfo } from "~/types";

export function links() {
  return [
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: gradientStyles },
    {
      rel: "icon",
      href: "/favicon.png",
      type: "image/png",
    },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
  title: "Open Source Hub",
  description:
    "Find your next open-source project! On Open Source Hub, maintainers advertise their projects for free and make it easy to onboard new contributors",
  // Facebook open graph tags
  "og:url": "https://opensourcehub.io",
  "og:type": "website",
  "og:title": "Onboard open-source contributors on Open Source Hub",
  "og:description":
    "Contribute, maintain, and impact the open-source communities you care about.",
  // TODO add social previews when we have them
  // "og:image": "https://opensourcehub.io/ossport_opengraph_v1.png",
  // "og:image:width": "1200",
  // "og:image:height": "630",
  // "og:image:type": "image/png",

  // Twitter open graph tags
  "twitter:card": "summary_large_image",
  "twitter:site": "@Codeseeio",
  "twitter:title": "Onboard open-source contributors on Open Source Hub",
  "twitter:description":
    "Contribute, maintain, and impact the open-source communities you care about.",
  // TODO add social previews when we have them
  // "twitter:image": "https://opensourcehub.io/ossport_twitter_v1.png",
  // "twitter:image:alt": "TODO",
});

export const loader: LoaderFunction = async ({ request }) => {
  const payload: LoaderData = {
    fathomSiteId: process.env.FATHOM_SITE_ID,
    userInfo: await getCurrentUserInfo(request),
  };
  return json(payload);
};

type LoaderData = {
  fathomSiteId?: string;
  userInfo: UserInfo | null;
};

export default function App() {
  const { fathomSiteId, userInfo } = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-light-background-shaded">
        <RootLayout userInfo={userInfo}>
          <Outlet />
        </RootLayout>
        {fathomSiteId && (
          <script
            src="https://cdn.usefathom.com/script.js"
            data-site={fathomSiteId}
            data-spa="auto"
            defer
          />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
