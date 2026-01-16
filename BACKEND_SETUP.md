# Backend Setup for Paystack Integration

To make the "Pay with Card" button work, your backend database needs to recognize "Paystack" as a valid payment method.

## ⚠️ The Problem
The frontend says: *"I want to create an order using Payment Method ID #X (Paystack)"*.
The backend allows methods like OPay (ID #1), but it doesn't know what "Paystack" is yet, so it rejects or fails to provide an ID.

## ✅ The Solution
You need to insert a record into your `payment_methods` (or equivalent) table in your database.

### Option 1: Run this SQL Command
If you have access to your database (PostgreSQL, MySQL, SQLite), run this:

```sql
INSERT INTO payment_methods (name, provider, is_active, created_at)
VALUES ('Pay with Card', 'paystack', true, NOW());
```
*(Adjust the table/column names if your schema is different)*

### Option 2: Use your Admin Panel
If you have a Superadmin panel implemented:
1.  Log in as Superadmin.
2.  Navigate to **Settings** or **Payment Methods**.
3.  Click **"Add New Method"**.
4.  Enter:
    -   **Name**: Pay with Card
    -   **Provider**: paystack  <-- *Critical: Must be "paystack"*
    -   **Account Number**: (Leave empty or put N/A)
5.  Save.

### Option 3: Python/Django Shell (If locally running)
If this is a Django backend:
```python
from apps.payment.models import PaymentMethod
PaymentMethod.objects.create(name="Pay with Card", provider="paystack", is_active=True)
```

## 🔄 Verification
Once added:
1.  Refresh your frontend app.
2.  The "Pay with Card" button will now automatically find this new ID.
3.  The Checkout Flow will properly redirect to the Paystack payment page.
