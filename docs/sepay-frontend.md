# Tích hợp SePay — Hướng dẫn Frontend (React)

> **Đối tượng:** Lập trình viên Frontend — React  
> **Vai trò:** Gọi backend .NET để lấy form data đã ký, rồi tự động submit sang SePay Checkout.

---

## Tổng quan luồng Frontend

```
[User click "Thanh toán"]
        ↓
[React POST /api/payment/create → .NET Backend]
        ↓
[Backend trả về formData (JSON) kèm signature]
        ↓
[React tạo form ẩn, submit POST → SePay Checkout]
        ↓
[SePay redirect về /payment/success hoặc /payment/error hoặc /payment/cancel]
```

> **Quan trọng:** React **không tự tạo signature**. Signature do .NET backend tạo vì cần `SecretKey` — không được để lộ phía client.

---

## Cài đặt

Không cần thêm thư viện — chỉ dùng `fetch` và DOM API có sẵn.

---

## Base URLs Checkout

| Môi trường | Checkout URL |
|------------|--------------|
| Sandbox    | `https://pay-sandbox.sepay.vn/v1/checkout/init` |
| Production | `https://pay.sepay.vn/v1/checkout/init` |

---

## Bước 1 — Service gọi Backend

Tạo file `src/services/paymentService.js`:

```javascript
// src/services/paymentService.js

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Gọi .NET backend để tạo form data có signature.
 * Backend sẽ không trả về checkout URL — chỉ trả dữ liệu để React tự submit.
 */
export async function createPayment({ orderInvoiceNumber, orderAmount, orderDescription, customerId }) {
  const response = await fetch(`${API_BASE}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderInvoiceNumber,
      orderAmount,
      orderDescription,
      customerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tạo đơn hàng thanh toán');
  }

  return response.json();
  // Trả về: { orderAmount, merchant, currency, operation, orderDescription,
  //           orderInvoiceNumber, successUrl, errorUrl, cancelUrl, signature, isSandbox }
}
```

---

## Bước 2 — Utility: Submit Form sang SePay

Tạo file `src/utils/sePayForm.js`:

```javascript
// src/utils/sePayForm.js

const CHECKOUT_URLS = {
  sandbox:    'https://pay-sandbox.sepay.vn/v1/checkout/init',
  production: 'https://pay.sepay.vn/v1/checkout/init',
};

/**
 * Tạo form ẩn và submit sang SePay.
 * Thứ tự các field PHẢI giữ nguyên để signature khớp phía SePay.
 */
export function submitToSePay(formData) {
  const checkoutUrl = formData.isSandbox
    ? CHECKOUT_URLS.sandbox
    : CHECKOUT_URLS.production;

  // Thứ tự field bắt buộc — không thay đổi
  const fieldOrder = [
    { key: 'order_amount',         value: formData.orderAmount },
    { key: 'merchant',             value: formData.merchant },
    { key: 'currency',             value: formData.currency },
    { key: 'operation',            value: formData.operation },
    { key: 'order_description',    value: formData.orderDescription },
    { key: 'order_invoice_number', value: formData.orderInvoiceNumber },
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
    if (value === undefined || value === null) return;
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
```

---

## Bước 3 — Component nút thanh toán

```jsx
// src/components/PayButton.jsx
import { useState } from 'react';
import { createPayment } from '../services/paymentService';
import { submitToSePay }  from '../utils/sePayForm';

export default function PayButton({ order }) {
  // order = { invoiceNumber, amount, description, customerId }
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = await createPayment({
        orderInvoiceNumber: order.invoiceNumber,
        orderAmount:        order.amount,
        orderDescription:   order.description,
        customerId:         order.customerId,
      });

      // Submit sang SePay — trang sẽ redirect, không return về đây
      submitToSePay(formData);

    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Đang xử lý...' : `Thanh toán ${order.amount.toLocaleString('vi-VN')} ₫`}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

**Cách dùng:**

```jsx
// src/pages/CheckoutPage.jsx
import PayButton from '../components/PayButton';

export default function CheckoutPage() {
  const order = {
    invoiceNumber: `INV_${Date.now()}`,   // Sinh unique mỗi lần
    amount:        100000,
    description:   'Thanh toán đơn hàng #12345',
    customerId:    'CUST_001',
  };

  return (
    <div>
      <h2>Xác nhận thanh toán</h2>
      <p>Số tiền: {order.amount.toLocaleString('vi-VN')} ₫</p>
      <PayButton order={order} />
    </div>
  );
}
```

---

## Bước 4 — Xử lý trang callback

Tạo 3 route tương ứng với `successUrl`, `errorUrl`, `cancelUrl` đã cấu hình ở backend.

```jsx
// src/pages/PaymentSuccess.jsx
import { useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const invoiceNumber = params.get('order_invoice_number');
  const transactionId = params.get('transaction_id');

  return (
    <div>
      <h2>✅ Thanh toán thành công!</h2>
      <p>Mã hóa đơn: <strong>{invoiceNumber}</strong></p>
      <p>Mã giao dịch: <strong>{transactionId}</strong></p>
    </div>
  );
}

// src/pages/PaymentError.jsx
export default function PaymentError() {
  return (
    <div>
      <h2>❌ Thanh toán thất bại</h2>
      <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
    </div>
  );
}

// src/pages/PaymentCancel.jsx
export default function PaymentCancel() {
  return (
    <div>
      <h2>⚠️ Đã hủy thanh toán</h2>
      <p>Bạn đã hủy giao dịch.</p>
    </div>
  );
}
```

Cấu hình route trong `App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CheckoutPage    from './pages/CheckoutPage';
import PaymentSuccess  from './pages/PaymentSuccess';
import PaymentError    from './pages/PaymentError';
import PaymentCancel   from './pages/PaymentCancel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/checkout"         element={<CheckoutPage />} />
        <Route path="/payment/success"  element={<PaymentSuccess />} />
        <Route path="/payment/error"    element={<PaymentError />} />
        <Route path="/payment/cancel"   element={<PaymentCancel />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Biến môi trường

Tạo file `.env` trong root React project:

```env
# .env.development
REACT_APP_API_URL=http://localhost:5000

# .env.production
REACT_APP_API_URL=https://api.yoursite.com
```

---

## Cấu trúc file đề xuất

```
src/
├── components/
│   └── PayButton.jsx          # Nút thanh toán tái sử dụng
├── pages/
│   ├── CheckoutPage.jsx       # Trang checkout
│   ├── PaymentSuccess.jsx     # Callback thành công
│   ├── PaymentError.jsx       # Callback lỗi
│   └── PaymentCancel.jsx      # Callback hủy
├── services/
│   └── paymentService.js      # Gọi .NET API
└── utils/
    └── sePayForm.js           # Submit form sang SePay
```

---

## Các lỗi thường gặp

| Lỗi | Nguyên nhân | Cách sửa |
|-----|-------------|----------|
| CORS error khi gọi backend | .NET chưa cho phép origin React | Xem mục CORS trong hướng dẫn backend |
| Form submit nhưng SePay báo lỗi signature | Thứ tự field sai | Kiểm tra `fieldOrder` trong `sePayForm.js` |
| Callback URL không hoạt động | URL không public | Dùng ngrok khi dev, đổi `REACT_APP_API_URL` tương ứng |
| `invoiceNumber` trùng | Dùng cùng giá trị cố định khi test | Sinh dynamic: `INV_${Date.now()}` |

---

## Checklist trước khi go-live

- [ ] `REACT_APP_API_URL` trỏ đúng domain production trong `.env.production`
- [ ] Các trang `/payment/success`, `/error`, `/cancel` đã deploy và accessible
- [ ] Test toàn bộ luồng trên sandbox trước khi chuyển production
- [ ] Xử lý trường hợp user bấm Back sau khi đến trang success (tránh submit lại)
- [ ] Không hardcode URL hay credential nào trong React source code
