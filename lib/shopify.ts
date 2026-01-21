import Client from 'shopify-buy';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !storefrontAccessToken) {
    console.warn('⚠️ Shopify credentials missing in .env file');
}

export const shopifyClient = Client.buildClient({
    domain: domain || 'mock-shop.myshopify.com', // Fallback for dev/testing
    storefrontAccessToken: storefrontAccessToken || 'mock-token',
    apiVersion: '2024-01'
});

export const fetchAllProducts = async () => {
    try {
        const products = await shopifyClient.product.fetchAll();
        return products;
    } catch (error) {
        console.error('Error fetching products from Shopify:', error);
        return [];
    }
};

export const fetchProductById = async (id: string) => {
    try {
        const product = await shopifyClient.product.fetch(id);
        return product;
    } catch (error) {
        console.error(`Error fetching product ${id} from Shopify:`, error);
        return null;
    }
};

export const fetchProductByHandle = async (handle: string) => {
    try {
        const query = `
            query getProduct($handle: String!) {
                product(handle: $handle) {
                    id
                    title
                    description
                    availableForSale
                    images(first: 10) {
                        edges {
                            node {
                                src: url
                                altText
                            }
                        }
                    }
                    options {
                        name
                        values
                    }
                    variants(first: 250) {
                        edges {
                            node {
                                id
                                title
                                availableForSale
                                quantityAvailable
                                price {
                                    amount
                                    currencyCode
                                }
                                selectedOptions {
                                    name
                                    value
                                }
                                image {
                                    src: url
                                    altText
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await customShopifyFetch(query, { handle });

        // Transform data to match previous structure slightly if needed, or just return as is
        // The previous SDK returned a slightly different structure, so we might need to adapt downstream
        // But for now let's return the raw graphQL node which is cleaner
        const product = response.data?.product;

        if (!product) return null;

        // Flatten edges for easier consumption in components
        return {
            ...product,
            images: product.images.edges.map((e: any) => ({ src: e.node.src, altText: e.node.altText })),
            variants: product.variants.edges.map((e: any) => e.node)
        };

    } catch (error) {
        console.error(`Error fetching product handle ${handle} from Shopify:`, error);
        return null;
    }
};

export const createCheckout = async () => {
    try {
        const checkout = await shopifyClient.checkout.create();
        return checkout;
    } catch (error) {
        console.error('Error creating checkout:', error);
        return null;
    }
};

export const fetchCollectionWithProducts = async (handle: string) => {
    try {
        // Fetch collection by handle
        const collection = await shopifyClient.collection.fetchByHandle(handle);
        if (!collection) {
            console.warn(`Collection not found: ${handle}`);
            return null;
        }

        // Fetch products for this collection (default limit is 20)
        // Note: fetchByHandle includes products by default, but we can verify or fetch more if needed
        // The return object from fetchByHandle usually contains a products array
        return collection;
    } catch (error) {
        console.error(`Error fetching collection ${handle}:`, error);
        return null;
    }
};

export const fetchAllCollections = async () => {
    try {
        const collections = await shopifyClient.collection.fetchAll();
        return collections;
    } catch (error) {
        console.error('Error fetching all collections:', error);
        return [];
    }
};

// --- Customer Authentication (Raw Fetch) ---

const customShopifyFetch = async (query: string, variables: any = {}) => {
    const url = `https://${domain}/api/2024-01/graphql.json`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken || ''
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Shopify API Error (${response.status}): ${text}`);
    }

    return response.json();
};

export const loginUser = async (email, password) => {
    try {
        const mutation = `
            mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
                customerAccessTokenCreate(input: $input) {
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, {
            input: { email, password }
        });

        const data = response.data;

        if (data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
            throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
        }

        return data?.customerAccessTokenCreate?.customerAccessToken;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const fetchCustomer = async (accessToken) => {
    try {
        const query = `
            query {
                customer(customerAccessToken: "${accessToken}") {
                    id
                    firstName
                    lastName
                    email
                    defaultAddress {
                        address1
                        address2
                        city
                        province
                        zip
                        country
                    }
                    orders(first: 10) {
                        edges {
                            node {
                                id
                                orderNumber
                                processedAt
                                totalPrice {
                                    amount
                                    currencyCode
                                }
                                lineItems(first: 5) {
                                    edges {
                                        node {
                                            title
                                            quantity
                                        }
                                    }
                                }
                                financialStatus
                                fulfillmentStatus
                                successfulFulfillments(first: 1) {
                                  trackingCompany
                                  trackingInfo {
                                    number
                                    url
                                  }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await customShopifyFetch(query);
        return response.data?.customer;
    } catch (error) {
        console.error('Error fetching customer:', error);
        return null;
    }
};

export const registerUser = async (email, password, firstName, lastName) => {
    try {
        const mutation = `
            mutation customerCreate($input: CustomerCreateInput!) {
                customerCreate(input: $input) {
                    customer {
                        id
                        email
                    }
                    customerUserErrors {
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, {
            input: { email, password, firstName, lastName }
        });

        const data = response.data;
        if (data?.customerCreate?.customerUserErrors?.length > 0) {
            throw new Error(data.customerCreate.customerUserErrors[0].message);
        }

        return data?.customerCreate?.customer;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

export const associateCustomerToCheckout = async (checkoutId: string, customerAccessToken: string) => {
    try {
        const mutation = `
            mutation checkoutCustomerAssociateV2($checkoutId: ID!, $customerAccessToken: String!) {
                checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
                    checkout {
                        id
                        webUrl
                        email
                    }
                    checkoutUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, {
            checkoutId,
            customerAccessToken
        });

        const data = response.data;
        if (data?.checkoutCustomerAssociateV2?.checkoutUserErrors?.length > 0) {
            console.error('Checkout Association Errors:', data.checkoutCustomerAssociateV2.checkoutUserErrors);
            // We don't throw here to avoid blocking checkout if association fails, just log it.
            return null;
        }

        return data?.checkoutCustomerAssociateV2?.checkout;
    } catch (error) {
        console.error('Error associating customer to checkout:', error);
        return null;
    }
};

export const updateCustomer = async (accessToken: string, customer: { firstName?: string; lastName?: string; email?: string; password?: string }) => {
    try {
        const mutation = `
            mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
                customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
                    customer {
                        id
                        firstName
                        lastName
                        email
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, {
            customerAccessToken: accessToken,
            customer
        });

        const data = response.data;
        if (data?.customerUpdate?.customerUserErrors?.length > 0) {
            throw new Error(data.customerUpdate.customerUserErrors[0].message);
        }

        return data?.customerUpdate?.customer;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
};

export const updateCustomerAddress = async (accessToken: string, address: { address1: string; address2?: string; city: string; province: string; zip: string; country: string }) => {
    try {
        const mutation = `
            mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
                customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
                    customerAddress {
                        id
                        address1
                        address2
                        city
                        province
                        zip
                        country
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, {
            customerAccessToken: accessToken,
            address
        });

        const data = response.data;
        if (data?.customerAddressCreate?.customerUserErrors?.length > 0) {
            throw new Error(data.customerAddressCreate.customerUserErrors[0].message);
        }

        // To set as default, we might need another mutation, but for simplification
        // we'll just create it. Shopify often returns the first created address as default 
        // if none exists.
        return data?.customerAddressCreate?.customerAddress;
    } catch (error) {
        console.error('Error creating customer address:', error);
        throw error;
    }
};

export const updateDefaultAddress = async (accessToken: string, addressId: string) => {
    try {
        const mutation = `
            mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
                customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
                    customer {
                        id
                        defaultAddress {
                            id
                        }
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, {
            customerAccessToken: accessToken,
            addressId
        });

        return response.data?.customerDefaultAddressUpdate;
    } catch (error) {
        console.error('Error updating default address:', error);
        throw error;
    }
};

export const recoverCustomerPassword = async (email: string) => {
    try {
        const mutation = `
            mutation customerRecover($email: String!) {
                customerRecover(email: $email) {
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        const response = await customShopifyFetch(mutation, { email });
        const data = response.data;

        if (data?.customerRecover?.customerUserErrors?.length > 0) {
            throw new Error(data.customerRecover.customerUserErrors[0].message);
        }

        return true;
    } catch (error) {
        console.error('Error recovering password:', error);
        throw error;
    }
};

export const resetCustomerPassword = async (id: string, token: string, password: string) => {
    try {
        const mutation = `
            mutation customerReset($id: ID!, $input: CustomerResetInput!) {
                customerReset(id: $id, input: $input) {
                    customer {
                        id
                        email
                    }
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        code
                        field
                        message
                    }
                }
            }
        `;

        // Ensure ID is in GID format if it's not already
        const gid = id.startsWith('gid://') ? id : `gid://shopify/Customer/${id}`;

        const response = await customShopifyFetch(mutation, {
            id: gid,
            input: {
                password,
                resetToken: token
            }
        });

        const data = response.data;

        if (data?.customerReset?.customerUserErrors?.length > 0) {
            throw new Error(data.customerReset.customerUserErrors[0].message);
        }

        return data?.customerReset?.customerAccessToken;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const searchProducts = async (query: string) => {
    try {
        const graphqlQuery = `
            query searchProducts($query: String!) {
                products(first: 10, query: $query) {
                    edges {
                        node {
                            id
                            title
                            handle
                            availableForSale
                            images(first: 1) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
                                }
                            }
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            collections(first: 5) {
                                edges {
                                    node {
                                        handle
                                        title
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await customShopifyFetch(graphqlQuery, { query });
        const products = response.data?.products?.edges || [];

        return products.map(({ node }: any) => {
            // Determine category for routing
            const categoryHandle = node.collections.edges[0]?.node?.handle || 'smartphones';

            // Map category to app routes
            let routeCategory = 'smartphones';
            if (categoryHandle.includes('accessory') || categoryHandle.includes('accesorios')) routeCategory = 'accesorios';
            else if (categoryHandle.includes('refurbished') || categoryHandle.includes('reacondicionados')) routeCategory = 'reacondicionados';
            else if (categoryHandle.includes('tablet') || categoryHandle.includes('ipad')) routeCategory = 'tablets';
            else if (categoryHandle.includes('watch') || categoryHandle.includes('reloj')) routeCategory = 'relojes';
            else if (categoryHandle.includes('mac') || categoryHandle.includes('compu')) routeCategory = 'computadoras';
            else if (categoryHandle.includes('audio') || categoryHandle.includes('airpods') || categoryHandle.includes('buds')) routeCategory = 'audio';

            return {
                id: node.id,
                name: node.title,
                category: node.collections.edges[0]?.node?.title || 'Producto',
                price: `${node.priceRange.minVariantPrice.currencyCode === 'PEN' ? 'S/' : node.priceRange.minVariantPrice.currencyCode} ${parseFloat(node.priceRange.minVariantPrice.amount).toLocaleString('es-PE', { minimumFractionDigits: 0 })}`,
                link: `/${routeCategory}/${node.handle}`,
                image: node.images.edges[0]?.node?.url || '',
                available: node.availableForSale
            };
        });
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
};
