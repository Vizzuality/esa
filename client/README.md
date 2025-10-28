This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### 🔐 GitHub Secrets

These secrets are required for CI/CD workflows:

| Name                                         | Description                                                                                                                          | Example / Notes                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_URL`                            | Public canonical URL of the deployment. Used for generating absolute links and metadata.                                             | `http://localhost:3000`, `https://esa-gda-comms-staging-mfafc.ondigitalocean.app`, or `https://impact-sphere-gda.esa.int` |
| `NEXT_PUBLIC_ENVIRONMENT`                    | Defines the current environment (`development`, `staging`, `production`). Used to conditionally enable analytics and other features. | `development`                                                                                                             |
| `NEXT_PUBLIC_API_URL`                        | API endpoint for the CMS (Strapi). Varies by environment.                                                                            | `http://localhost:1337/api` (local) / `https://impact-sphere-gda.esa.int/cms/impact-sphere/cms/api` (prod)                |
| `NEXT_PUBLIC_BASE_PATH`                      | Base path for assets and routes in staging/production (if deployed under a subdirectory).                                            | `/impact-sphere/`                                                                                                         |
| `NEXT_PUBLIC_PREVIEW_SECRET`                 | Secret token that authorizes preview access to unpublished content from the CMS.                                                     |
| `NEXT_PUBLIC_MAPBOX_API_TOKEN`               | Mapbox access token used for maps rendering.                                                                                         | Provided by project account (Vizzuality).                                                                                 |
| `NEXT_PUBLIC_MAPBOX_USERNAME`                | Mapbox account username used to access and manage project map styles.                                                                |
| `NEXT_PUBLIC_MAPBOX_STYLE_ID`                | Identifier of the Mapbox style applied to the main map visualization.                                                                |
| `NEXT_PUBLIC_MATOMO_URL`                     | Base URL of the Matomo analytics instance used for tracking.                                                                         |
| `NEXT_PUBLIC_MATOMO_SITE_ID`                 | Matomo site ID corresponding to this project’s production instance.                                                                  |
| `RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED` | Disables duplicate atom key warnings triggered during React hot reload in development.                                               |
| `AWS_ACCESS_KEY_ID`                          | AWS access key used by CI/CD workflows for deployment. Managed securely in GitHub Secrets.                                           |
| `AWS_SECRET_ACCESS_KEY`                      | AWS secret key used for authenticated deployment operations. Must remain private and never be committed.                             |

> 🧠 **Notes**
>
> - All secrets for **staging** and **production** are configured in **GitHub → Settings → Secrets and variables → Actions**.
> - Local development values belong in a `.env.local` file (never committed).
> - `NEXT_PUBLIC_` variables are exposed to the frontend and should not contain sensitive credentials.
> - Analytics (`Matomo`) are only active when `NEXT_PUBLIC_ENVIRONMENT=production`.
