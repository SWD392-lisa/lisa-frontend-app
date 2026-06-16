// src/utils/sePayForm.js

const CHECKOUT_URLS = {
  sandbox:    'https://pay-sandbox.sepay.vn/v1/checkout/init',
  production: 'https://pay.sepay.vn/v1/checkout/init',
};

/**
 * Create a hidden form and POST-submit to the SePay gateway.
 * Field order MUST match the HMAC signature order computed by the backend:
 *   order_amount, merchant, currency, operation, order_description,
 *   order_invoice_number, customer_id, payment_method,
 *   success_url, error_url, cancel_url, signature
 *
 * SePay verifies the signature by concatenating fields in this exact sequence,
 * so all fields (including empty optional ones) must be present.
 */
export function submitToSePay(formData) {
  console.log('📝 submitToSePay called with formData:', formData);
  
  // Default to sandbox if isSandbox is not specified (or check both cases)
  const isSandbox = formData.isSandbox ?? formData.IsSandbox ?? true;
  const checkoutUrl = isSandbox
    ? CHECKOUT_URLS.sandbox
    : CHECKOUT_URLS.production;

  console.log('🏪 Checkout URL:', checkoutUrl);

  // Field order is CRITICAL — must match the backend HMAC signing order
  // First check all possible property names (camelCase and PascalCase)
  const getVal = (camelKey, pascalKey) => {
    const val = formData[camelKey] ?? formData[pascalKey];
    console.log(`🔍 Checking ${camelKey}/${pascalKey}:`, val);
    return val;
  };

  const fieldOrder = [
    { key: 'order_amount',         value: getVal('orderAmount', 'OrderAmount') },
    { key: 'merchant',             value: getVal('merchant', 'Merchant') },
    { key: 'currency',             value: getVal('currency', 'Currency') },
    { key: 'operation',            value: getVal('operation', 'Operation') },
    { key: 'order_description',    value: getVal('orderDescription', 'OrderDescription') },
    { key: 'order_invoice_number', value: getVal('orderInvoiceNumber', 'OrderInvoiceNumber') },
    { key: 'customer_id',          value: getVal('customerId', 'CustomerId') },
    { key: 'payment_method',       value: getVal('paymentMethod', 'PaymentMethod') },
    { key: 'success_url',          value: getVal('successUrl', 'SuccessUrl') },
    { key: 'error_url',            value: getVal('errorUrl', 'ErrorUrl') },
    { key: 'cancel_url',           value: getVal('cancelUrl', 'CancelUrl') },
    { key: 'signature',            value: getVal('signature', 'Signature') },
  ];

  console.log('📋 Final field order with values:', fieldOrder);

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = checkoutUrl;
  form.style.display = 'none';

  fieldOrder.forEach(({ key, value }) => {
    // Submit all fields — even null/undefined (SePay expects the field
    // to be present with an empty value for signature verification)
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = key;
    input.value = value != null ? String(value) : '';
    console.log(`➕ Adding input: name=${key}, value=${input.value}`);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  console.log('🚀 Submitting form to:', checkoutUrl);
  form.submit();
}
