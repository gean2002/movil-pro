import fs from 'fs';
const domain = 'movil-pro-2.myshopify.com';
const token = '4044240b39f9c12f24c61e5b8ed4e68a';

async function run() {
  const query = `
    query {
      collections(first: 50) {
        edges {
          node {
            title
            handle
            products(first: 5) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const url = `https://${domain}/api/2024-01/graphql.json`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token
      },
      body: JSON.stringify({ query })
    });

    const body = await response.json();
    let output = '';
    if(body.errors) {
        output += JSON.stringify(body.errors, null, 2);
    } else {
        const collections = body.data?.collections?.edges || [];
        output += `Found ${collections.length} collections:\n`;
        collections.forEach(({ node }) => {
          output += `[${node.title}] (handle: ${node.handle})\n`;
          const products = node.products.edges;
          output += `   - Product count (sample): ${products.length}\n`;
          products.forEach(p => output += `     * ${p.node.title}\n`);
          output += '\n';
        });
    }
    fs.writeFileSync('debug_output.txt', output);
  } catch (err) {
    fs.writeFileSync('debug_output.txt', err.toString());
  }
}

run();
