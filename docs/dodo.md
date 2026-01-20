# TypeScript

> Integrate Dodo Payments into your TypeScript and Node.js applications with type safety and modern async/await support

The TypeScript SDK provides convenient server-side access to the Dodo Payments REST API for TypeScript and JavaScript applications. It features comprehensive type definitions, error handling, retries, timeouts, and auto-pagination for seamless payment processing.

## Installation

Install the SDK using your package manager of choice:

<CodeGroup>
  ```bash npm theme={null}
  npm install dodopayments
  ```

  ```bash yarn theme={null}
  yarn add dodopayments
  ```

  ```bash pnpm theme={null}
  pnpm add dodopayments
  ```
</CodeGroup>

## Quick Start

Initialize the client with your API key and start processing payments:

```javascript  theme={null}
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  bearerToken: process.env['DODO_PAYMENTS_API_KEY'], // This is the default and can be omitted
  environment: 'test_mode', // defaults to 'live_mode'
});

const checkoutSessionResponse = await client.checkoutSessions.create({
  product_cart: [{ product_id: 'product_id', quantity: 1 }],
});

console.log(checkoutSessionResponse.session_id);
```

<Warning>
  Always store your API keys securely using environment variables. Never commit them to version control or expose them in client-side code.
</Warning>

## Core Features

<CardGroup cols={2}>
  <Card title="TypeScript First" icon="shield-check">
    Full TypeScript support with comprehensive type definitions for all API endpoints
  </Card>

  <Card title="Auto-Pagination" icon="arrows-rotate">
    Automatic pagination for list responses makes working with large datasets effortless
  </Card>

  <Card title="Error Handling" icon="triangle-exclamation">
    Built-in error types with detailed messages for different failure scenarios
  </Card>

  <Card title="Smart Retries" icon="repeat">
    Configurable automatic retries with exponential backoff for transient errors
  </Card>
</CardGroup>

## Configuration

### Environment Variables

Set environment variables for secure configuration:

```bash .env theme={null}
DODO_PAYMENTS_API_KEY=your_api_key_here
```

### Timeout Configuration

Configure request timeouts globally or per-request:

```typescript  theme={null}
// Configure default timeout for all requests (default is 1 minute)
const client = new DodoPayments({
  timeout: 20 * 1000, // 20 seconds
});

// Override per-request
await client.checkoutSessions.create(
  { product_cart: [{ product_id: 'product_id', quantity: 0 }] },
  { timeout: 5 * 1000 }
);
```

### Retry Configuration

Configure automatic retry behavior:

```javascript  theme={null}
// Configure default for all requests (default is 2 retries)
const client = new DodoPayments({
  maxRetries: 0, // disable retries
});

// Override per-request
await client.checkoutSessions.create(
  { product_cart: [{ product_id: 'product_id', quantity: 0 }] },
  { maxRetries: 5 }
);
```

<Tip>
  The SDK automatically retries requests that fail due to network errors or server issues (5xx responses) with exponential backoff.
</Tip>

## Common Operations

### Create a Checkout Session

Generate a checkout session for collecting payment information:

```typescript  theme={null}
const session = await client.checkoutSessions.create({
  product_cart: [
    {
      product_id: 'prod_123',
      quantity: 1
    }
  ],
  return_url: 'https://yourdomain.com/return'
});

console.log('Redirect to:', session.url);
```

### Manage Customers

Create and retrieve customer information:

```typescript  theme={null}
// Create a customer
const customer = await client.customers.create({
  email: 'customer@example.com',
  name: 'John Doe',
  metadata: {
    user_id: '12345'
  }
});

// Retrieve customer
const retrieved = await client.customers.retrieve('cus_123');
console.log(`Customer: ${retrieved.name} (${retrieved.email})`);
```

### Handle Subscriptions

Create and manage recurring subscriptions:

```typescript  theme={null}
// Create a subscription
const subscription = await client.subscriptions.create({
  customer_id: 'cus_123',
  product_id: 'prod_456',
  price_id: 'price_789'
});

// Retrieve subscription usage history
const usageHistory = await client.subscriptions.retrieveUsageHistory('sub_123', {
  start_date: '2024-01-01T00:00:00Z',
  end_date: '2024-03-31T23:59:59Z'
});
```

## Usage-Based Billing

### Ingest Usage Events

Track custom events for usage-based billing:

```typescript  theme={null}
await client.usageEvents.ingest({
  events: [
    {
      event_id: 'api_call_12345',
      customer_id: 'cus_abc123',
      event_name: 'api_request',
      timestamp: '2024-01-15T10:30:00Z',
      metadata: {
        endpoint: '/api/v1/users',
        method: 'GET',
        tokens_used: '150'
      }
    }
  ]
});
```

<Info>
  Events must have unique `event_id` values for idempotency. Duplicate IDs within the same request are rejected, and subsequent requests with existing IDs are ignored.
</Info>

### Retrieve Usage Events

Fetch detailed information about usage events:

```typescript  theme={null}
// Get a specific event
const event = await client.usageEvents.retrieve('api_call_12345');

// List events with filtering
const events = await client.usageEvents.list({
  customer_id: 'cus_abc123',
  event_name: 'api_request',
  start: '2024-01-14T10:30:00Z',
  end: '2024-01-15T10:30:00Z'
});
```

## Proxy Configuration

Configure proxy settings for different runtimes:

### Node.js (using undici)

```typescript  theme={null}
import DodoPayments from 'dodopayments';
import * as undici from 'undici';

const proxyAgent = new undici.ProxyAgent('http://localhost:8888');
const client = new DodoPayments({
  fetchOptions: {
    dispatcher: proxyAgent,
  },
});
```

### Bun

```typescript  theme={null}
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  fetchOptions: {
    proxy: 'http://localhost:8888',
  },
});
```

### Deno

```typescript  theme={null}
import DodoPayments from 'npm:dodopayments';

const httpClient = Deno.createHttpClient({ proxy: { url: 'http://localhost:8888' } });
const client = new DodoPayments({
  fetchOptions: {
    client: httpClient,
  },
});
```

## Logging

Control log verbosity using environment variables or client options:

```typescript  theme={null}
// Via client option
const client = new DodoPayments({
  logLevel: 'debug', // Show all log messages
});
```

```bash  theme={null}
# Via environment variable
export DODO_PAYMENTS_LOG=debug
```

**Available log levels:**

* `'debug'` - Show debug messages, info, warnings, and errors
* `'info'` - Show info messages, warnings, and errors
* `'warn'` - Show warnings and errors (default)
* `'error'` - Show only errors
* `'off'` - Disable all logging

<Warning>
  At the debug level, all HTTP requests and responses are logged, including headers and bodies. Some authentication headers are redacted, but sensitive data in bodies may still be visible.
</Warning>

## Migration from Node.js SDK

If you're upgrading from the legacy Node.js SDK, the TypeScript SDK offers improved type safety and features:

<Card title="View Migration Guide" icon="arrow-right" href="https://github.com/dodopayments/dodopayments-typescript/blob/main/MIGRATION.md">
  Learn how to migrate from the Node.js SDK to the TypeScript SDK
</Card>

## Resources

<CardGroup cols={2}>
  <Card title="GitHub Repository" icon="github" href="https://github.com/dodopayments/dodopayments-typescript">
    View source code and contribute
  </Card>

  <Card title="API Reference" icon="book" href="/api-reference/introduction">
    Complete API documentation
  </Card>

  <Card title="Discord Community" icon="discord" href="https://discord.gg/bYqAp4ayYh">
    Get help and connect with developers
  </Card>

  <Card title="Report Issues" icon="bug" href="https://github.com/dodopayments/dodopayments-typescript/issues">
    Report bugs or request features
  </Card>
</CardGroup>

## Support

Need help with the TypeScript SDK?

* **Discord**: Join our [community server](https://discord.gg/bYqAp4ayYh) for real-time support
* **Email**: Contact us at [support@dodopayments.com](mailto:support@dodopayments.com)
* **GitHub**: Open an issue on the [repository](https://github.com/dodopayments/dodopayments-typescript)

## Contributing

We welcome contributions! Check the [contributing guidelines](https://github.com/dodopayments/dodopayments-typescript/blob/main/CONTRIBUTING.md) to get started.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.dodopayments.com/llms.txt



----------------------------

# Express Adaptor

> Learn how to integrate Dodo Payments with your Express App Router project using our Express Adaptor. Covers checkout, customer portal, webhooks, and secure environment setup.

<CardGroup cols={2}>
  <Card title="Checkout Handler" icon="cart-shopping" href="#checkout-route-handler">
    Integrate Dodo Payments checkout into your Express app.
  </Card>

  <Card title="Customer Portal" icon="user" href="#customer-portal-route-handler">
    Allow customers to manage subscriptions and details.
  </Card>

  <Card title="Webhooks" icon="bell" href="#webhook-route-handler">
    Receive and process Dodo Payments webhook events.
  </Card>
</CardGroup>

## Installation

<Steps>
  <Step title="Install the package">
    Run the following command in your project root:

    ```bash  theme={null}
    npm install @dodopayments/express
    ```
  </Step>

  <Step title="Set up environment variables">
    Create a <code>.env</code> file in your project root:

    ```env expandable theme={null}
    DODO_PAYMENTS_API_KEY=your-api-key
    DODO_PAYMENTS_WEBHOOK_KEY=your-webhook-secret
    DODO_PAYMENTS_ENVIRONMENT="test_mode" or "live_mode"
    DODO_PAYMENTS_RETURN_URL=your-return-url
    ```

    <Warning>
      Never commit your <code>.env</code> file or secrets to version control.
    </Warning>
  </Step>
</Steps>

## Route Handler Examples

<Tabs>
  <Tab title="Checkout Handler">
    <Info>
      Use this handler to integrate Dodo Payments checkout into your Express app. Supports static (GET), dynamic (POST), and session (POST) payment flows.
    </Info>

    <CodeGroup>
      ```typescript Express Route Handler expandable theme={null}
      import { checkoutHandler } from '@dodopayments/express';

      app.get('/api/checkout', checkoutHandler({
          bearerToken: process.env.DODO_PAYMENTS_API_KEY,
          returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
          environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
          type: "static"
      }))

      app.post('/api/checkout', checkoutHandler({
          bearerToken: process.env.DODO_PAYMENTS_API_KEY,
          returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
          environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
          type: "dynamic"
      }))

      app.post('/api/checkout', checkoutHandler({
          bearerToken: process.env.DODO_PAYMENTS_API_KEY,
          returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
          environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
          type: "session"
      }))
      ```
    </CodeGroup>

    <CodeGroup>
      ```curl Static Checkout Curl example expandable theme={null}
      curl --request GET \
      --url 'https://example.com/api/checkout?productId=pdt_fqJhl7pxKWiLhwQR042rh' \
      --header 'User-Agent: insomnia/11.2.0' \
      --cookie mode=test
      ```
    </CodeGroup>

    <CodeGroup>
      ```curl Dynamic Checkout Curl example expandable theme={null}
      curl --request POST \
      --url https://example.com/api/checkout \
      --header 'Content-Type: application/json' \
      --header 'User-Agent: insomnia/11.2.0' \
      --cookie mode=test \
      --data '{
      "billing": {
        "city": "Texas",
        "country": "US",
        "state": "Texas",
        "street": "56, hhh",
        "zipcode": "560000"
      },
      "customer": {
        "email": "test@example.com",
        	"name": "test"
      },
      "metadata": {},
      "payment_link": true,
        "product_id": "pdt_QMDuvLkbVzCRWRQjLNcs",
        "quantity": 1,
        "billing_currency": "USD",
        "discount_code": "IKHZ23M9GQ",
        "return_url": "https://example.com",
        "trial_period_days": 10
      }'
      ```
    </CodeGroup>

    <CodeGroup>
      ```curl Checkout Session Curl example expandable theme={null}
      curl --request POST \
      --url https://example.com/api/checkout \
      --header 'Content-Type: application/json' \
      --header 'User-Agent: insomnia/11.2.0' \
      --cookie mode=test \
      --data '{
      "product_cart": [
        {
          "product_id": "pdt_QMDuvLkbVzCRWRQjLNcs",
          "quantity": 1
        }
      ],
      "customer": {
        "email": "test@example.com",
        "name": "test"
      },
      "return_url": "https://example.com/success"
      }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Customer Portal Handler">
    <Info>
      Use this handler to allow customers to manage their subscriptions and details via the Dodo Payments customer portal.
    </Info>

    <CodeGroup>
      ```typescript Express Route Handler expandable theme={null}
      import { CustomerPortal } from "@dodopayments/express";

      app.get('/api/customer-portal', CustomerPortal({
          bearerToken: process.env.DODO_PAYMENTS_API_KEY,
          environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
      }))
      ```
    </CodeGroup>

    <CodeGroup>
      ```curl Customer Portal Curl example expandable theme={null}
      curl --request GET \
      --url 'https://example.com/api/customer-portal?customer_id=cus_9VuW4K7O3GHwasENg31m&send_email=true' \
      --header 'User-Agent: insomnia/11.2.0' \
      --cookie mode=test
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Webhook Handler">
    <Info>
      Use this handler to receive and process Dodo Payments webhook events securely in your Express app.
    </Info>

    <CodeGroup>
      ```typescript Express Route Handler expandable theme={null}
      import { Webhooks } from "@dodopayments/express";

      app.post('/api/webhook',Webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
          onPayload: async (payload) => {
              // handle the payload
          },
          // ... other event handlers for granular control
      }))
      ```
    </CodeGroup>
  </Tab>
</Tabs>

## Checkout Route Handler

<Info>
  Dodo Payments supports three types of payment flows for integrating payments into your website, this adaptor supports all types of payment flows.
</Info>

* **Static Payment Links:** Instantly shareable URLs for quick, no-code payment collection.
* **Dynamic Payment Links:** Programmatically generate payment links with custom details using the API or SDKs.
* **Checkout Sessions:** Create secure, customizable checkout experiences with pre-configured product carts and customer details.

<AccordionGroup>
  <Accordion title="Static Checkout (GET)">
    ### Supported Query Parameters

    <ParamField query="productId" type="string" required>
      Product identifier (e.g., <code>?productId=pdt\_nZuwz45WAs64n3l07zpQR</code>).
    </ParamField>

    <ParamField query="quantity" type="integer">
      Quantity of the product.
    </ParamField>

    <ParamField query="fullName" type="string">
      Customer's full name.
    </ParamField>

    <ParamField query="firstName" type="string">
      Customer's first name.
    </ParamField>

    <ParamField query="lastName" type="string">
      Customer's last name.
    </ParamField>

    <ParamField query="email" type="string">
      Customer's email address.
    </ParamField>

    <ParamField query="country" type="string">
      Customer's country.
    </ParamField>

    <ParamField query="addressLine" type="string">
      Customer's address line.
    </ParamField>

    <ParamField query="city" type="string">
      Customer's city.
    </ParamField>

    <ParamField query="state" type="string">
      Customer's state/province.
    </ParamField>

    <ParamField query="zipCode" type="string">
      Customer's zip/postal code.
    </ParamField>

    <ParamField query="disableFullName" type="boolean">
      Disable full name field.
    </ParamField>

    <ParamField query="disableFirstName" type="boolean">
      Disable first name field.
    </ParamField>

    <ParamField query="disableLastName" type="boolean">
      Disable last name field.
    </ParamField>

    <ParamField query="disableEmail" type="boolean">
      Disable email field.
    </ParamField>

    <ParamField query="disableCountry" type="boolean">
      Disable country field.
    </ParamField>

    <ParamField query="disableAddressLine" type="boolean">
      Disable address line field.
    </ParamField>

    <ParamField query="disableCity" type="boolean">
      Disable city field.
    </ParamField>

    <ParamField query="disableState" type="boolean">
      Disable state field.
    </ParamField>

    <ParamField query="disableZipCode" type="boolean">
      Disable zip code field.
    </ParamField>

    <ParamField query="paymentCurrency" type="string">
      Specify the payment currency (e.g., <code>USD</code>).
    </ParamField>

    <ParamField query="showCurrencySelector" type="boolean">
      Show currency selector.
    </ParamField>

    <ParamField query="paymentAmount" type="integer">
      Specify the payment amount (e.g., <code>1000</code> for \$10.00).
    </ParamField>

    <ParamField query="showDiscounts" type="boolean">
      Show discount fields.
    </ParamField>

    <ParamField query="metadata_*" type="string">
      Any query parameter starting with <code>metadata\_</code> will be passed as metadata.
    </ParamField>

    <Warning>
      If <code>productId</code> is missing, the handler returns a 400 response. Invalid query parameters also result in a 400 response.
    </Warning>

    ### Response Format

    Static checkout returns a JSON response with the checkout URL:

    ```json  theme={null}
    {
      "checkout_url": "https://checkout.dodopayments.com/..."
    }
    ```
  </Accordion>

  <Accordion title="Dynamic Checkout (POST)">
    * Send parameters as a JSON body in a POST request.
    * Supports both one-time and recurring payments.
    * For a complete list of supported POST body fields, refer to:
      * [Request body for a One Time Payment Product](https://docs.dodopayments.com/api-reference/payments/post-payments)
      * [Request body for a Subscription Product](https://docs.dodopayments.com/api-reference/subscriptions/post-subscriptions)

    ### Response Format

    Dynamic checkout returns a JSON response with the checkout URL:

    ```json  theme={null}
    {
      "checkout_url": "https://checkout.dodopayments.com/..."
    }
    ```
  </Accordion>

  <Accordion title="Checkout Sessions (POST)">
    Checkout sessions provide a more secure, hosted checkout experience that handles the complete payment flow for both one-time purchases and subscriptions with full customization control.

    Refer to [Checkout Sessions Integration Guide](https://docs.dodopayments.com/developer-resources/checkout-session) for more details and a complete list of supported fields.

    ### Response Format

    Checkout sessions return a JSON response with the checkout URL:

    ```json  theme={null}
    {
      "checkout_url": "https://checkout.dodopayments.com/session/..."
    }
    ```
  </Accordion>
</AccordionGroup>

## Customer Portal Route Handler

The Customer Portal Route Handler enables you to seamlessly integrate the Dodo Payments customer portal into your Express application.

### Query Parameters

<ParamField query="customer_id" type="string" required>
  The customer ID for the portal session (e.g., <code>?customer\_id=cus\_123</code>).
</ParamField>

<ParamField query="send_email" type="boolean">
  If set to <code>true</code>, sends an email to the customer with the portal link.
</ParamField>

<Warning>
  Returns 400 if <code>customer\_id</code> is missing.
</Warning>

## Webhook Route Handler

* **Method:** Only POST requests are supported. Other methods return 405.
* **Signature Verification:** Verifies the webhook signature using <code>webhookKey</code>. Returns 401 if verification fails.
* **Payload Validation:** Validated with Zod. Returns 400 for invalid payloads.
* **Error Handling:**
  * 401: Invalid signature
  * 400: Invalid payload
  * 500: Internal error during verification
* **Event Routing:** Calls the appropriate event handler based on the payload type.

### Supported Webhook Event Handlers

<CodeGroup>
  ```typescript Typescript expandable theme={null}
  onPayload?: (payload: WebhookPayload) => Promise<void>;
  onPaymentSucceeded?: (payload: WebhookPayload) => Promise<void>;
  onPaymentFailed?: (payload: WebhookPayload) => Promise<void>;
  onPaymentProcessing?: (payload: WebhookPayload) => Promise<void>;
  onPaymentCancelled?: (payload: WebhookPayload) => Promise<void>;
  onRefundSucceeded?: (payload: WebhookPayload) => Promise<void>;
  onRefundFailed?: (payload: WebhookPayload) => Promise<void>;
  onDisputeOpened?: (payload: WebhookPayload) => Promise<void>;
  onDisputeExpired?: (payload: WebhookPayload) => Promise<void>;
  onDisputeAccepted?: (payload: WebhookPayload) => Promise<void>;
  onDisputeCancelled?: (payload: WebhookPayload) => Promise<void>;
  onDisputeChallenged?: (payload: WebhookPayload) => Promise<void>;
  onDisputeWon?: (payload: WebhookPayload) => Promise<void>;
  onDisputeLost?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionActive?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionOnHold?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionRenewed?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionPlanChanged?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionCancelled?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionFailed?: (payload: WebhookPayload) => Promise<void>;
  onSubscriptionExpired?: (payload: WebhookPayload) => Promise<void>;
  onLicenseKeyCreated?: (payload: WebhookPayload) => Promise<void>;
  ```
</CodeGroup>

***

## Prompt for LLM

```
You are an expert Express.js developer assistant. Your task is to guide a user through integrating the @dodopayments/express adapter into their existing Express.js project.

The @dodopayments/express adapter provides route handlers for Dodo Payments' Checkout, Customer Portal, and Webhook functionalities, designed to plug directly into an Express app.

First, install the necessary package. Use the package manager appropriate for the user's project (npm, yarn, or bun):

npm install @dodopayments/express

---

Here's how you should structure your response:

1. Ask the user which functionalities they want to integrate.

"Which parts of the @dodopayments/express adapter would you like to integrate into your project? You can choose one or more of the following:

- Checkout Route Handler (for handling product checkouts)
- Customer Portal Route Handler (for managing customer subscriptions/details)
- Webhook Route Handler (for receiving Dodo Payments webhook events)
- All (integrate all three)"

---

2. Based on the user's selection, provide detailed integration steps for each chosen functionality.

---

**If Checkout Route Handler is selected:**

**Purpose**: This handler manages different types of checkout flows. All checkout types (static, dynamic, and sessions) return JSON responses with checkout URLs for programmatic handling.

**Integration**:
Create routes in your Express app for static (GET), dynamic (POST), and checkout sessions (POST).


import { checkoutHandler } from '@dodopayments/express';

app.get('/api/checkout', checkoutHandler({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
  type: "static"
}));

app.post('/api/checkout', checkoutHandler({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
  type: "dynamic"
}));

// For checkout sessions
app.post('/api/checkout', checkoutHandler({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  returnUrl: process.env.DODO_PAYMENTS_RETURN_URL,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
  type: "session"
}));

Config Options:

    bearerToken: Your Dodo Payments API key (recommended to be stored in DODO_PAYMENTS_API_KEY env variable).

    returnUrl (optional): URL to redirect the user after successful checkout.

    environment: "test_mode" or "live_mode"

    type: "static" (GET), "dynamic" (POST), or "session" (POST)

GET (static checkout) expects query parameters:

    productId (required)

    quantity, customer fields (fullName, email, etc.), and metadata (metadata_*) are optional.

    Returns: {"checkout_url": "https://checkout.dodopayments.com/..."}

POST (dynamic checkout) expects a JSON body with payment details (one-time or subscription). Reference the docs for the full POST schema:

    One-time payments: https://docs.dodopayments.com/api-reference/payments/post-payments

    Subscriptions: https://docs.dodopayments.com/api-reference/subscriptions/post-subscriptions

    Returns: {"checkout_url": "https://checkout.dodopayments.com/..."}


POST (checkout sessions) - (Recommended) A more customizable checkout experience. Returns JSON with checkout_url: Parameters are sent as a JSON body. Supports both one-time and recurring payments. Returns: {"checkout_url": "https://checkout.dodopayments.com/session/..."}. For a complete list of supported fields, refer to:

  Checkout Sessions Integration Guide: https://docs.dodopayments.com/developer-resources/checkout-session

If Customer Portal Route Handler is selected:

Purpose: This route allows customers to manage their subscriptions via the Dodo Payments portal.

Integration:

import { CustomerPortal } from "@dodopayments/express";

app.get('/api/customer-portal', CustomerPortal({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
}));

Query Parameters:

    customer_id (required): e.g., ?customer_id=cus_123

    send_email (optional): if true, customer is emailed the portal link

Returns 400 if customer_id is missing.

If Webhook Route Handler is selected:

Purpose: Processes incoming webhook events from Dodo Payments to trigger events in your app.

Integration:

import { Webhooks } from "@dodopayments/express";

app.post('/api/webhook', Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
  onPayload: async (payload) => {
    // Handle generic payload
  },
  // You can also provide fine-grained handlers for each event type below
}));

Features:

    Only POST method is allowed — others return 405

    Signature verification is performed using webhookKey. Returns 401 if invalid.

    Zod-based payload validation. Returns 400 if invalid schema.

    All handlers are async functions.

Supported Webhook Event Handlers:

You may pass in any of the following handlers:

    onPayload

    onPaymentSucceeded

    onPaymentFailed

    onPaymentProcessing

    onPaymentCancelled

    onRefundSucceeded

    onRefundFailed

    onDisputeOpened, onDisputeExpired, onDisputeAccepted, onDisputeCancelled, onDisputeChallenged, onDisputeWon, onDisputeLost

    onSubscriptionActive, onSubscriptionOnHold, onSubscriptionRenewed, onSubscriptionPlanChanged, onSubscriptionCancelled, onSubscriptionFailed, onSubscriptionExpired

    onLicenseKeyCreated

Environment Variable Setup:

Make sure to define these environment variables in your project:

DODO_PAYMENTS_API_KEY=your-api-key
DODO_PAYMENTS_WEBHOOK_KEY=your-webhook-secret
DODO_PAYMENTS_ENVIRONMENT="test_mode" or "live_mode"
DODO_PAYMENTS_RETURN_URL=your-return-url

Use these inside your code as:

process.env.DODO_PAYMENTS_API_KEY
process.env.DODO_PAYMENTS_WEBHOOK_SECRET

Security Note: Do NOT commit secrets to version control. Use .env files locally and secrets managers in deployment environments (e.g., AWS, Vercel, Heroku, etc.).
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.dodopayments.com/llms.txt


---------


