# DPEEN

Static Astro site with strict TypeScript, Tailwind 4 and pnpm. Node 24 is used for local and Vercel builds (`nvm use`).

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

Install Chromium for browser checks with `pnpm exec playwright install chromium`. `pnpm build` includes Astro type checking. Use `pnpm format` and `pnpm format:check` for formatting.

## Structure

- `src/pages`: page and generated Open Graph image routes.
- `src/components`: individual page sections and native dialogs.
- `src/data/trustees.ts`: leadership names, roles, portraits and biographies.
- `src/lib/enquiry.ts`: Zod schema and typed enquiry formatter.
- `src/scripts/interactions.ts`: menu, dialog, donation and contact submission behavior.
- `src/styles/global.css`: Tailwind theme and global styles.

## Enquiries and donations

Enquiries validate with Zod on the client and server and send through Purelymail SMTP using `api/contact.ts`. Client inputs are sanitized with DOMPurify; emails use plain text, a fixed recipient, an authenticated sender and the visitor’s email as Reply-To. No personal data is persisted in browser storage. Delivery errors preserve the form and offer direct email. Donation transfers use the supplied UBA account.

Set `SMTP_USER` to the full Purelymail mailbox address (defaults to `info@dpeenetwork.com`) and add `SMTP_PASSWORD` privately in Vercel Environment Variables for Production and Preview. If two-factor authentication is enabled, use a Purelymail App Password. SMTP uses TLS at smtp.purelymail.com:465. Redeploy after changing environment variables. Without the password, the endpoint returns 503 and never claims delivery. Astro’s local static preview does not run `/api`; use Vercel dev or a deployment for live SMTP.

## Hosting and metadata

Vercel is configured for static Astro output in `dist`, a frozen pnpm 11.25.0 install, Node 24, and security headers. The install and build commands explicitly invoke the pinned pnpm version so they do not depend on Vercel’s bundled pnpm version. Hashed `/_astro/` assets use immutable caching; `/sw.js` is revalidated on every request. `SITE_URL` controls canonical and share-image URLs; the default is `https://www.dpeenetwork.com`. Change it before publishing if the domain differs. `astro-seo` manages head metadata; `astro-og-canvas` renders `/open-graph/home.png` at build time using local fonts.

Astro generates a Content Security Policy. Workbox caches the static page and local assets; externally hosted photos and Google fonts still need network access on first load. Build and test the production output because CSP is enforced there.

## Search discovery

The HTML includes typed JSON-LD for the organization, website and page, plus canonical and social metadata. `/robots.txt` permits crawling and points to the generated `/sitemap-index.xml`. `SITE_URL` must match the production domain.

After publishing, verify ownership in Google Search Console, submit `sitemap-index.xml`, and request indexing of the homepage. Validate the public page using Google's Rich Results Test. Discovery, indexing and rankings depend on search engines and are not guaranteed by metadata. Add confirmed public contact details and social profile URLs when available; none are fabricated in the structured data.

## Vercel deployment

The existing Vercel project is `chidi09s-projects/dpeen-site`, linked to GitHub repository `Chidi09/dpeen-site`. Its root directory is the repository root and its framework is Astro. Keep the commands and output directory from `vercel.json`; no server adapter is required for this static site.

Set `SITE_URL` in the production environment to the final HTTPS domain (currently `https://www.dpeenetwork.com`). Attach that domain in the project’s Domains settings and use the DNS records Vercel provides. Preview deployments can retain the production canonical URL. Contact delivery requires the SMTP environment variables above.

For CLI deployment, run `npx vercel link`, `npx vercel` for a preview, and `npx vercel --prod` for production. The local `.vercel` project link and downloaded environment files are ignored by Git. Deploy the committed Astro migration, lockfile, public images, and configuration together.
