
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://pcn-appeal.lovable.app';
const postsDir = './posts';
const sitemapFile = './public/sitemap.xml';
const date = new Date().toISOString().split('T')[0];

const files = fs.readdirSync(postsDir);
const guideUrls = files.filter(f => f.endsWith('.md')).map(f => {
    const slug = f.replace('.md', '');
    return { loc: `${baseUrl}/guides/${slug}`, priority: '0.8', freq: 'weekly' };
});

const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', freq: 'daily' },
    { loc: `${baseUrl}/guides`, priority: '0.9', freq: 'weekly' }
];

const urls = [...staticUrls, ...guideUrls];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(sitemapFile, sitemap);
console.log(`Generated sitemap.xml with ${urls.length} URLs in ${sitemapFile}`);
