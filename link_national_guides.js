
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
        cities: ['atlanta', 'austin', 'boston', 'charlotte', 'chicago', 'columbus', 'dallas', 'denver', 'fort-worth', 'houston', 'indianapolis', 'jacksonville', 'las-vegas', 'los-angeles', 'miami', 'minneapolis', 'nashville', 'new-orleans', 'new-york', 'oklahoma-city', 'orlando', 'philadelphia', 'phoenix', 'portland', 'sacramento', 'san-antonio', 'san-diego', 'san-francisco', 'san-jose', 'seattle', 'washington-dc', 'baltimore', 'salt-lake-city'],
        links: [
            '*   [LAZ Parking Defense Guide 2026](/guides/laz-parking-us-defense-guide)',
            '*   [SP+ (SP Plus) Defense Guide 2026](/guides/sp-plus-us-defense-guide)',
            '*   [Parkopedia App Appeal Guide 2026](/guides/parkopedia-app-appeal-guide)'
        ]
    },
    uk: {
        cities: ['london', 'manchester', 'birmingham', 'glasgow', 'liverpool', 'leeds', 'sheffield', 'bristol', 'newcastle', 'nottingham', 'aberdeen', 'bath', 'belfast', 'bournemouth', 'brighton', 'cambridge', 'cardiff', 'coventry', 'derby', 'dundee', 'edinburgh', 'exeter', 'gloucester', 'hull', 'leicester', 'luton', 'middlesbrough', 'milton-keynes', 'northampton', 'norwich', 'oxford', 'peterborough', 'plymouth', 'portsmouth', 'preston', 'reading', 'slough', 'southampton', 'stoke-on-trent', 'sunderland', 'swansea', 'wolverhampton', 'york'],
        links: [
            '*   [APCOA National Defense Guide 2026](/guides/apcoa-national-defense-guide-2026)',
            '*   [Euro Car Parks Appeal Guide 2026](/guides/euro-car-parks-appeal-guide)',
            '*   [ParkingEye National Defense Guide 2026](/guides/parkingeye-national-defense-guide-2026)',
            '*   [NCP National Defense Guide 2026](/guides/ncp-national-defense-guide-2026)'
        ]
    },
    australia: {
        cities: ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold-coast', 'canberra', 'darwin', 'hobart', 'cairns', 'geelong', 'townsville'],
        links: [
            '*   [Wilson Parking Defense Guide 2026](/guides/wilson-parking-defense-guide-au)',
            '*   [Secure Parking Defense Guide 2026](/guides/secure-parking-defense-guide-au)'
        ]
    },
    canada: {
        cities: ['toronto', 'montreal', 'vancouver', 'calgary', 'ottawa', 'edmonton', 'winnipeg', 'halifax', 'mississauga', 'brampton', 'kitchener', 'surrey-bc', 'quebec-city'],
        links: [
            '*   [Impark (REEF) Canada Defense Guide 2026](/guides/impark-parking-defense-guide-ca)'
        ]
    },
    nz: {
        cities: ['auckland', 'wellington', 'christchurch', 'hamilton'],
        links: [
            '*   [Wilson Parking New Zealand Defense Guide 2026](/guides/wilson-parking-defense-guide-nz)'
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
                // Remove old versions of the link (without 2026) if present
                const baseLink = linkToAdd.replace(' 2026', '');
                if (content.includes(baseLink) && baseLink !== linkToAdd) {
                    content = content.split(baseLink).join('');
                    updated = true;
                }

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
                
                // Final deduplication for exact linkToAdd
                const lines = content.split('\n');
                const uniqueLines = [];
                let seenLink = false;
                for (const line of lines) {
                    if (line.trim() === linkToAdd.trim()) {
                        if (seenLink) {
                            updated = true;
                            continue; // Skip duplicate
                        }
                        seenLink = true;
                    }
                    uniqueLines.push(line);
                }
                content = uniqueLines.join('\n');
            });
        }
    }
    
    if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
