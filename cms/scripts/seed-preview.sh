#!/bin/sh
# Populates an empty CMS database by pulling content from another Strapi
# instance. Runs as the Railway pre-deploy command, so it must never block a
# deploy: any failure is reported and the deploy continues with an empty CMS.
set -u

if [ -z "${SEED_SOURCE_URL:-}" ] || [ -z "${SEED_SOURCE_TOKEN:-}" ]; then
  echo "seed-preview: SEED_SOURCE_URL or SEED_SOURCE_TOKEN not set, skipping"
  exit 0
fi

if [ "${SEED_SOURCE_URL%/}" = "${CMS_URL%/}/admin" ]; then
  echo "seed-preview: source is this instance, skipping"
  exit 0
fi

has_content=$(node -e '
  const { Client } = require("pg");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client
    .connect()
    .then(() => client.query("SELECT to_regclass($1) AS t", ["public.stories"]))
    .then(({ rows }) =>
      rows[0].t ? client.query("SELECT EXISTS (SELECT 1 FROM stories) AS e") : { rows: [{ e: false }] }
    )
    .then(({ rows }) => console.log(rows[0].e ? "yes" : "no"))
    .catch((err) => { console.error(err.message); console.log("error"); })
    .finally(() => process.exit(0));
')

case "$has_content" in
  yes)
    echo "seed-preview: database already has content, skipping"
    exit 0
    ;;
  no) ;;
  *)
    echo "seed-preview: could not inspect the database, skipping"
    exit 0
    ;;
esac

echo "seed-preview: empty database, pulling content from $SEED_SOURCE_URL"
# Binary assets are excluded: media records keep their absolute bucket URLs.
if yarn strapi transfer \
  --from "$SEED_SOURCE_URL" \
  --from-token "$SEED_SOURCE_TOKEN" \
  --only content,config \
  --force; then
  echo "seed-preview: done"
else
  echo "seed-preview: transfer failed (schemas must match the source exactly), continuing with an empty database"
fi
exit 0
