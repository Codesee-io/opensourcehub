# How this project works

## Architecture

Open-Source Hub is built with [Remix](https://remix.run), a server-side framework for [React](https://reactjs.org/) applications.

| Directory         | Description                                                                                                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `app/components`  | React components                                                                                                                |
| `app/data`        | Data files generated at build-time and not stored in source control                                                             |
| `app/images`      | Assets like images and icons                                                                                                    |
| `app/routes`      | Files that define the routes and what they render. Learn about [routing in Remix](https://remix.run/docs/en/v1/guides/routing). |
| `app/styles`      | Auto-generated CSS files. This isn't stored in source control.                                                                  |
| `app/utils`       | Shared utilities and helpers                                                                                                    |
| `docs`            | Documentation!                                                                                                                  |
| `public`          | Files that will be uploaded to the root of the website                                                                          |
| `public/build`    | Remix stores the build output here. This isn't stored in source control.                                                        |
| `public/projects` | All the user-generated projects are stored here                                                                                 |
| `seed`            | Seed data for Firebase authentication and database                                                                              |
| `styles`          | CSS files processed by PostCSS                                                                                                  |

**Naming conventions:**

- `*.server.ts` files run server code and do not have access to the DOM.
- Components use Pascal Case. For example: `ProjectHeader.tsx`
- `~` is an alias for the `app` folder. For example, `~/components/Button` refers to `app/components/Button.tsx`.

### Deployment

Open-Source Hub is auto-deployed to Vercel when code is merged to the `main` branch. Build previews will be posted to pull requests in GitHub.

### Styling

CSS files are in the `styles` folder, at the root of the app. When the development server is running, those files get processed by PostCSS and output into `app/styles`. This allows pages to import only the required CSS, and nothing more.

Example: `styles/index.css` is processed into `app/styles/index.css`

To import CSS into a page, use Remix's `Links` component:

```tsx
import tailwindStyles from "~/styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: tailwindStyles }];
}
```

## Data fetching

We have 3 sources of data:

- user-generated projects
- GitHub
- CodeSee Maps

### Projects

Projects are stored as MDX files in the `public/projects` directory. When we build the site, we process every project and generate a JSON file in `app/data/projects.json`. That file is not stored in source control.

To access projects in components, use the `getProjects()` and `getProject()` methods from `app/projects.server.ts`.

```tsx
// Fetching a project by slug in a page

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const project = getProject("codesee-io/opensourcehub");

  // Send the project's name to the page
  return json({ name: project.attributes.name });
}

const MyComponent = () => {
  // Access the project's name
  const { name } = useLoaderData();

  return <h1>{name}</h1>;
};
```

To understand how the project data is generated, dig into `app/utils/parse-projects.ts`.

### GitHub

We fetch data from GitHub **at build time** and store it in a JSON file called `app/data/github.json`.

Generating this data requires an environment variable to be set (see `.env.sample`). If that variable is missing, we generate an empty JSON file.

To access that data, use the `getGitHubData()` and `getGitHubDataForProject()` methods from `app/github.server.ts`.

Check out `app/utils/github-data.ts` to understand how we gather this data.

### How to fetch data from GitHub

You'll need to generate an token to access the GitHub API.

1. Visit https://github.com/settings/tokens
2. Generate a new token (it doesn't need any scopes)
3. Add an environment variable called `GITHUB_PERSONAL_ACCESS_TOKEN=<your_token>` to the `.env` file
4. Run `yarn dev` again. This will iterate over all the projects and export data to `app/data/github.json`
5. Once you've done this once, we recommend removing the variable to avoid slow start times.

### CodeSee Maps

Each project can display a featured CodeSee Map using the `featuredMap` field in the frontmatter:

```yaml
---
name: Open-Source Hub
repoUrl: https://github.com/Codesee-io/opensourcehub
featuredMap:
  url: https://app.codesee.io/maps/public/848e3630-1650-11ec-8bc1-7d4a4822cc27
  description: Get a quick visual overview of the major areas of our repo!
---
```

If that field is present, the `$project.tsx` component fetches the map's metadata at runtime.

We've exposed a method `getCodeSeeMapMetadata()` to access that data in `app/codesee.server.io`.

---

[← Back](../README.md)
