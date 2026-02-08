import Client from 'shopify-buy';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let env = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) env[key.trim()] = val.trim();
    });
} catch (e) { }

const client = Client.buildClient({
    domain: env.VITE_SHOPIFY_DOMAIN,
    storefrontAccessToken: env.VITE_SHOPIFY_STOREFRONT_TOKEN,
    apiVersion: '2024-01'
});

async function check() {
    console.log("🔍 Checking Samsung Variants...");
    const collection = await client.collection.fetchByHandle('samsung');
    if (collection) {
        collection.products.forEach(p => {
            console.log(`\nPRODUCT: ${p.title}`);
            console.log(`Handle: ${p.handle}`);
            console.log(`Variants: ${p.variants.length}`);
            p.variants.forEach(v => {
                console.log(` - Price: ${v.price.amount} ${v.price.currencyCode}`);
                console.log(` - Available: ${v.availableForSale}`);
                console.log(` - Qty: ${v.quantityAvailable}`);
            });
            console.log(`Options: ${JSON.stringify(p.options)}`);
            console.log(`Images: ${p.images.length}`);
        });
    }
}
check();
