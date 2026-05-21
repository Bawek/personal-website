const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://baweke.dev";

const normalizeApiBaseUrl = (url = "http://localhost:5000/api") => {
  const trimmed = url.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

function generateSiteMap(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const staticPaths = [
    "/",
    "/about",
    "/experience",
    "/skills",
    "/projects",
    "/blog",
    "/contact",
  ].map((loc) => ({ loc, lastmod: new Date().toISOString().split("T")[0] }));

  let dynamicPaths = [];
  try {
    const apiBase = normalizeApiBaseUrl(
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    );
    const [contentRes, projectsRes] = await Promise.allSettled([
      fetch(`${apiBase}/content?status=published&limit=100`),
      fetch(`${apiBase}/projects`),
    ]);
    if (contentRes.status === "fulfilled" && contentRes.value.ok) {
      const { contents } = await contentRes.value.json();
      dynamicPaths = (contents || [])
        .filter((c) => c.type === "post")
        .map((c) => ({
          loc: `/blog/${c.slug}`,
          lastmod: (c.updatedAt || c.publishedAt || c.createdAt || "").split(
            "T",
          )[0],
        }));
    }
    if (projectsRes.status === "fulfilled" && projectsRes.value.ok) {
      const { projects } = await projectsRes.value.json();
      dynamicPaths = dynamicPaths.concat(
        (projects || []).map((p) => ({
          loc: `/projects/${p.slug}`,
          lastmod: (p.updatedAt || p.createdAt || "").split("T")[0],
        })),
      );
    }
  } catch {
    /* sitemap still works with static routes if API unavailable */
  }

  const sitemap = generateSiteMap([...staticPaths, ...dynamicPaths]);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function SiteMap() {}
