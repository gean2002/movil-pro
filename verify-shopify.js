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

const domain = env.VITE_SHOPIFY_DOMAIN;
const token = env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !token) {
    console.error("Missing credentials in .env.local");
    process.exit(1);
}

console.log(`🔌 Testing connection to: ${domain}`);

const client = Client.buildClient({
    domain: domain,
    storefrontAccessToken: token,
    apiVersion: '2024-01'
});

client.product.fetchAll(1).then((products) => {
    if (products.length > 0) {
        console.log('✅ SUCCESS: Connection established!');
        console.log(`📦 Found ${products.length} product(s).`);
        console.log(`🏷️  First product: "${products[0].title}"`);
    } else {
        console.log('✅ SUCCESS: Connection established, but store has no products.');
    }
}).catch((err) => {
    console.error('❌ ERROR: Connection failed.');
    console.error(err);
});
