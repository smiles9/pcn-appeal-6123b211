
import fs from 'fs';
import path from 'path';

const postsDir = './posts';

const mappings = {
    germany: {
        cities: ['berlin', 'munich', 'frankfurt', 'hamburg', 'cologne', 'stuttgart', 'dusseldorf', 'dresden'],
        links: [
            '*   [APCOA Germany Defense Guide 2026](/guides/apcoa-germany-defense-guide)',
            '*   [Parkdepot Germany Defense Guide 2026](/guides/parkdepot-germany-defense-guide)'
        ]
    },
    france: {
        cities: ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'lille'],
        link: '*   [Guide de défense INDIGO France 2026](/guides/indigo-france-defense-guide)'
    },
    usa: {
        cities: ['atlanta', 'austin', 'boston', 'charlotte', 'chicago', 'columbus', 'dallas', 'denver', 'fort-worth', 'houston', 'indianapolis', 'jacksonville', 'las-vegas', 'los-angeles', 'miami', 'minneapolis', 'nashville', 'new-orleans', 'new-york', 'oklahoma-city', 'orlando', 'philadelphia', 'phoenix', 'portland', 'sacramento', 'san-antonio', 'san-diego', 'san-francisco', 'san-jose', 'seattle', 'washington-dc'],
        links: [
            '*   [LAZ Parking Defense Guide 2026](/guides/laz-parking-us-defense-guide)',
            '*   [SP+ (SP Plus) Defense Guide 2026](/guides/sp-plus-us-defense-guide)',
            '*   [Parkopedia App Appeal Guide 2026](/guides/parkopedia-app-appeal-guide)'
        ]
    },
    uk: {
        cities: ['london', 'manchester', 'birmingham', 'glasgow', 'liverpool', 'leeds', 'sheffield', 'bristol', 'newcastle', 'nottingham'],
        links: [
            '*   [APCOA National Defense Guide 2026](/guides/apcoa-national-defense-guide-2026)',
            '*   [Euro Car Parks Appeal Guide 2026](/guides/euro-car-parks-appeal-guide)'
        ]
    }
};

const files = fs.readdirSync(postsDir);

files.forEach(file => {
    if (!file.startsWith('parking-ticket-appeal-') || !file.endsWith('.md')) return;
    
    const city = file.replace('parking-ticket-appeal-', '').replace('.md', '');
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let updated = false;
    
    for (const country in mappings) {
        if (mappings[country].cities.includes(city)) {
            const countryLinks = mappings[country].links ? mappings[country].links : [mappings[country].link];
            
            countryLinks.forEach(linkToAdd => {
                if (!content.includes(linkToAdd)) {
                    // Find the end of the "Looking for more help?" section
                    const helpSectionMarker = '**Looking for more help?**';
                    const markerIndex = content.lastIndexOf(helpSectionMarker);
                    
                    if (markerIndex !== -1) {
                        // Find the end of the bullet points following the marker
                        let insertIndex = content.indexOf('\n---', markerIndex);
                        if (insertIndex === -1) insertIndex = content.length;
                        
                        const before = content.slice(0, insertIndex).trimEnd();
                        const after = content.slice(insertIndex);
                        
                        content = `${before}\n${linkToAdd}\n${after}`;
                        updated = true;
                    }
                }
            });
        }
    }
    
    if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
