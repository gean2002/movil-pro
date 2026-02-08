import Client from 'shopify-buy';
import fs from 'fs';
import path from 'path';

// Manual env parsing
const envPath = path.resolve(process.cwd(), '.env.local');
let env = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) env[key.trim()] = val.trim();
    });
} catch (e) {
    console.error("Could not read .env.local");
    process.exit(1);
}

const client = Client.buildClient({
    domain: env.VITE_SHOPIFY_DOMAIN,
    storefrontAccessToken: env.VITE_SHOPIFY_STOREFRONT_TOKEN,
    apiVersion: '2024-01'
});

const collectionsToCheck = ['iphone', 'samsung', 'smartphones'];

async function checkCollections() {
    console.log("🔍 Checking Samsung Collection...");
    try {
        const collection = await client.collection.fetchByHandle('samsung');
        if (collection) {
            console.log(`✅ Collection 'samsung' found! ID: ${collection.id}`);
            console.log(`   Total Products: ${collection.products.length}`);
            collection.products.forEach(p => {
                console.log(`   - [${p.id}] ${p.title} | Type: ${p.productType} | Vendor: ${p.vendor}`);
                // console.log(`     Tags: ${JSON.stringify(p.tags)}`); 
            });
        } else {
            console.log(`❌ Collection 'samsung' NOT found.`);
        }
    } catch (error) {
        console.log(`❌ Error checking samsung: ${error.message}`);
    }
}

checkCollections();
