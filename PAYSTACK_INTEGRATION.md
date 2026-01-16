# Paystack Integration Documentation

This document serves as a comprehensive reference for the Paystack payment gateway integration in the application.

## 1. Configuration & Prerequisites

### Environment Variables
The application requires your Paystack Public Key to be configured in `.env.local`.

**File:** `.env.local`
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_09b8802ff745062dac31fd0ebfbf7e7ed19de46c
```
> **Note:** This key is safe to expose on the frontend as it can only initiate transactions, not verify them or move money.

### Dependencies
We installed the official React wrapper for Paystack:
```bash
npm install react-paystack
```

## 2. Implementation Details

### A. dedicated Payment Page
**File:** `app/payment/page.tsx`
-   **Route:** `/payment`
-   **Query Param:** `?id={order_id}`
-   **Functionality:**
    -   It fetches the order details using the `order_id`.
    -   It verifies the order status (preventing double payment).
    -   It displays a secure payment summary card.
    -   It renders the "Pay Now" button which triggers the Paystack popup.

### B. Payment Method Selection
**File:** `components/Section/Payment.tsx`
-   Added a "Pay with Paystack" suggestion card.
-   Logic: When clicked, it selects the Paystack method (dynamically found from the backend list) to ensure the order is tagged correctly.

### C. Checkout Flow Integration
**File:** `hook/queries.ts` inside `useCheckout`
-   Updated the success handler to check the selected payment method.
-   **Logic:**
    ```typescript
    if (data.payment_method.toLowerCase() === "paystack") {
      window.location.href = `/payment?id=${data.id}`;
    }
    ```
    This redirects the user to the secure payment page immediately after the order is created in the checkout.

## 3. The User Flow

1.  **Checkout**: User goes through Address and Delivery steps.
2.  **Selection**: In the Payment step, user selects **"Pay with Card" (Paystack)**.
3.  **Order Creation**: User clicks "Place Your Order". The system creates a "Pending" order in the database.
4.  **Redirect**: The user is automatically redirected to `/payment?id=123`.
5.  **Payment**: User reviews the amount and clicks **"Pay Now"**.
6.  **Completion**: The Paystack popup appears. After a successful transaction, the user receives a success toast and is redirected to the Order History page.
