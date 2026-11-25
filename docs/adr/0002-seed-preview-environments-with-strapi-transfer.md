# 0002. Seed preview environments with `strapi transfer`

- **Status**: accepted
- **Date**: 2026-11-25

## Context

Railway creates an environment for every pull request by duplicating production's services and variables. It doesn't copy data, so each preview gets an empty Postgres. With no content and no permissions on the Public role, the CMS API answers 403 and the client shows nothing, which makes previews useless for reviewing.

Constraints:

- Railway's private network is scoped to one environment, so a preview can't reach production's Postgres without exposing it publicly.
- Previews must keep working even when seeding fails.
- The CMS runs Strapi 4.11.2, whose `strapi transfer` pulls from a remote instance over HTTPS with a transfer token, and requires the source and destination schemas to be identical.

## Decision

The `cms` service runs `cms/scripts/seed-preview.sh` as its pre-deploy command. When the database has no stories, it runs `strapi transfer --from $SEED_SOURCE_URL --only content,config` against the production CMS. In any other case (content already present, source is the instance itself, variables missing, transfer failed) it logs why and exits successfully.

## Alternatives considered

- **`pg_dump` from production and restore into the preview**: it copies everything and tolerates schema changes, but it needs production's Postgres exposed through a public TCP proxy and a Postgres client in the image.
- **GitHub Actions job running `railway ssh … strapi transfer` when a pull request opens**: more moving parts (Railway API token in GitHub, waiting for the environment to exist) and it races with Strapi's first start.
- **A seed archive in the repository (`strapi import`)**: it goes stale as soon as editors change content; the previous one was removed for that reason.
- **Transferring files too**: production stores media in a bucket and the records hold absolute URLs, so copying the binaries adds time without changing what the preview shows.

## Consequences

- **Positive**: previews come up with production content and permissions, without opening production's database to the internet.
- **Trade-offs**: a pull request that changes a content type can't be seeded (schemas differ) and starts empty. Admin users aren't transferred. The transfer token is a plain variable on the `cms` service, because Railway doesn't copy sealed variables into PR environments.
- **Follow-ups**: `SEED_SOURCE_URL` and `SEED_SOURCE_TOKEN` must be set on `cms` in production for new previews to inherit them.
