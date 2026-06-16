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
  // Default to sandbox if isSandbox is not specified (or check both cases)
  const isSandbox = formData.isSandbox ?? formData.IsSandbox ?? true;
  const checkoutUrl = isSandbox
    ? CHECKOUT_URLS.sandbox
    : CHECKOUT_URLS.production;

  // Field order is CRITICAL — must match the backend HMAC signing order
  const fieldOrder = [
    { key: 'order_amount',         value: formData.orderAmount },
    { key: 'merchant',             value: formData.merchant },
    { key: 'currency',             value: formData.currency },
    { key: 'operation',            value: formData.operation },
    { key: 'order_description',    value: formData.orderDescription },
    { key: 'order_invoice_number', value: formData.orderInvoiceNumber },
    { key: 'customer_id',          value: formData.customerId },
    { key: 'payment_method',       value: formData.paymentMethod },
    { key: 'success_url',          value: formData.successUrl },
    { key: 'error_url',            value: formData.errorUrl },
    { key: 'cancel_url',           value: formData.cancelUrl },
    { key: 'signature',            value: formData.signature },
  ];

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
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
