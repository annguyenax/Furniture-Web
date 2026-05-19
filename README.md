# Furniture-Web — Secure E-Commerce Platform

> **Đồ án môn học: An Toàn Ứng Dụng Web**
> Học viện Công nghệ Bưu chính Viễn thông cơ sở TP.HCM
> Tác giả: **Nguyễn Văn An**

---

## Giới thiệu

**Furniture-Web** là hệ thống thương mại điện tử bán nội thất, được xây dựng với trọng tâm là **bảo mật ứng dụng web** theo các tiêu chuẩn hiện đại. Dự án không chỉ là một platform thương mại điện tử đầy đủ tính năng mà còn là minh chứng thực tế cho việc áp dụng các biện pháp bảo mật từ tầng ứng dụng đến tầng hạ tầng triển khai.

Hệ thống hỗ trợ 4 vai trò người dùng: **Admin**, **Seller/Vendor**, **Customer**, và **Shipper** — mỗi vai trò được kiểm soát truy cập chặt chẽ thông qua RBAC.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | ReactJS (Vite), Redux Toolkit, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL (Sequelize ORM) |
| Auth | JWT, OAuth 2.0 (Google) |
| Storage | Cloudinary (images), Local disk (avatars) |
| Deployment | Docker, Nginx reverse proxy, Cloudflare SSL |

---

## Security Architecture

Dưới đây là tổng quan các tầng bảo mật được triển khai:

```
[Client Browser]
      ↓ HTTPS (TLS 1.2/1.3)
[Cloudflare CDN + WAF]
      ↓
[Nginx Reverse Proxy]  ← SSL termination, HTTP→HTTPS redirect
      ↓
[Express.js API]
  ├── Helmet (security headers)
  ├── CORS whitelist
  ├── Rate Limiter
  ├── JWT Auth Middleware
  ├── RBAC Role Middleware
  └── Input Validator
      ↓
[Sequelize ORM]  ← Parameterized queries (SQL injection prevention)
      ↓
[MySQL Database]
```

---

## Chi tiết các biện pháp bảo mật

### 1. Authentication — JWT + OAuth 2.0

**JSON Web Tokens (JWT)**
- Access token: hết hạn sau **2 giờ**
- Refresh token: hết hạn sau **7–30 ngày** (tùy chọn "ghi nhớ đăng nhập")
- Phân biệt `token_type` để ngăn dùng refresh token truy cập protected routes
- Refresh token được **hash SHA-256** trước khi lưu DB — chống replay attack
- Logout invalidates token bằng cách null hóa trong DB (server-side revocation)

**Google OAuth 2.0**
- Xác thực Google ID token qua `google-auth-library`
- Bắt buộc email đã verified trước khi tạo tài khoản
- Ngăn đăng ký trùng email giữa local và Google provider

**Cookie Security**
```js
// Production
{ httpOnly: true, secure: true, sameSite: 'None' }

// Development
{ httpOnly: true, secure: false, sameSite: 'Lax' }
```

**Email Verification**
- JWT-signed token gửi qua email khi đăng ký
- Tài khoản chưa verify không thể đăng nhập

---

### 2. Authorization — RBAC (Role-Based Access Control)

Hệ thống định nghĩa 4 roles: `admin`, `vendor`, `customer`, `shipper`.

```
POST /api/v1/admin/users/ban        → [admin only]
POST /api/v1/vendor/products        → [vendor only]
GET  /api/v1/orders/user            → [authenticated]
DELETE /api/v1/products/:id         → [admin, vendor]
```

- Middleware `roleMiddleware.js` xác thực role trước mỗi request vào protected route
- Resource ownership validation: người dùng chỉ được sửa/xóa đánh giá của **chính mình**
- Admin có thể ban/unban tài khoản (`status: active | inactive | banned`)

---

### 3. Password Security

**Bcrypt Hashing**
- Salt rounds: **10** — chống tấn công brute-force và GPU cracking
- So sánh constant-time với `bcrypt.compare()` — chống timing attack

**Yêu cầu độ mạnh mật khẩu** (`passwordValidator.js`)
- Tối thiểu 8 ký tự, tối đa 128 ký tự (giới hạn trên ngăn DoS)
- Bắt buộc: chữ hoa, chữ thường, số, ký tự đặc biệt
- Từ chối mật khẩu phổ biến: `password`, `12345678`, `qwerty123`, v.v.
- Từ chối mật khẩu chứa username hoặc email prefix

**Password Reset Flow**
- Token ngẫu nhiên mật mã học: `crypto.randomBytes(32).toString('hex')`
- Hash SHA-256 trước khi lưu DB — token trong email khác token trong DB
- Hiệu lực: **1 giờ**
- Invalidated ngay sau khi sử dụng
- Reset đồng thời unlock tài khoản bị khóa

---

### 4. Brute Force & Rate Limiting Protection

**IP-based Rate Limiting** (`rateLimiter.js`)
- Login: tối đa **20 attempts / 15 phút** per IP
- File upload: tối đa **5 uploads / 1 phút** per IP
- Trả về HTTP `429 Too Many Requests`

**Account Lockout Mechanism**
```
MAX_LOGIN_ATTEMPTS = 5
LOCK_TIME          = 15 phút
ATTEMPT_WINDOW     = 5 phút (reset counter nếu khoảng cách vượt quá)
```
- Theo dõi: `login_attempts`, `locked_until`, `last_failed_login`
- Hiển thị thời gian còn lại đến khi mở khóa

**Timing Attack Mitigation**
- Thêm random delay **500–800ms** sau failed login
- Thêm random delay **400–700ms** trên forgot password endpoint
- Ngăn attacker suy luận qua thời gian phản hồi

**Google reCAPTCHA v3**
- Kích hoạt sau **3 lần** đăng nhập sai liên tiếp
- Score threshold > 0.5 mới được tiếp tục
- Xác minh server-side qua Google API

---

### 5. HTTPS & Transport Security (Nginx + Cloudflare)

```nginx
# nginx/default.conf

# Force HTTPS redirect
server {
    listen 80;
    return 301 https://$host$request_uri;
}

# TLS configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_certificate     /etc/nginx/ssl/cloudflare.pem;
ssl_certificate_key /etc/nginx/ssl/cloudflare.key;

# Block sensitive paths
location ~* ^/(src|config|scripts)/ { return 403; }
```

- Chỉ chấp nhận **TLS 1.2 và TLS 1.3**
- Chứng chỉ SSL từ **Cloudflare** (tự động renew)
- HTTP → HTTPS redirect tuyệt đối
- Chặn truy cập các đường dẫn nội bộ nhạy cảm

---

### 6. Security Headers (Helmet.js)

```js
// Back-end/src/app.js
app.use(helmet({
  hidePoweredBy: true,           // Xóa header X-Powered-By
  noSniff: true,                 // X-Content-Type-Options: nosniff
  frameguard: { action: 'sameorigin' },  // Chống clickjacking
  xssFilter: true,               // X-XSS-Protection
  hsts: { maxAge: 31536000 },    // HSTS 1 năm
}));
```

| Header | Giá trị | Mục đích |
|--------|---------|---------|
| X-Powered-By | (removed) | Ẩn framework backend |
| X-Content-Type-Options | nosniff | Ngăn MIME sniffing |
| X-Frame-Options | SAMEORIGIN | Chống Clickjacking |
| X-XSS-Protection | 1; mode=block | Bộ lọc XSS trình duyệt |
| Strict-Transport-Security | max-age=31536000 | Bắt buộc HTTPS 1 năm |

---

### 7. CORS (Cross-Origin Resource Sharing)

Cấu hình whitelist-based, từ chối mọi origin không nằm trong danh sách:

```js
// Back-end/src/config/cors.js
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://noithatstore.site',
  'https://api.noithatstore.site',
  'https://furniture-c1t.pages.dev',
  process.env.CLIENT_URL,
];
```

- Credentials: `true` (cho phép gửi cookies cross-origin)
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Preflight (OPTIONS) được xử lý đúng chuẩn

---

### 8. Input Validation & SQL Injection Prevention

**Express Validator** — kiểm tra toàn bộ input trước khi vào controller:
```js
// Routes validation ví dụ (orderRoutes.js)
body('order_items.*.product_id').isInt(),
body('order_items.*.quantity').isInt({ min: 1 }),
body('order_items.*.price').isFloat({ min: 0 }),
body('payment_method').isIn(['cod', 'momo', 'vnpay', 'bank_transfer']),
```

**Sequelize ORM** — toàn bộ query dùng parameterized statements, không có string concatenation trực tiếp vào SQL. Ngăn hoàn toàn **SQL Injection**.

**Request body limit**: 10MB (JSON + URL-encoded) — chống DoS qua large payload.

---

### 9. File Upload Security

| Property | Avatar | Product Image |
|---------|--------|--------------|
| Allowed types | jpg, jpeg, png, gif | jpg, jpeg, png, gif, webp |
| Max size | 5MB | 5MB (3MB variants) |
| Storage | Local disk | Cloudinary CDN |
| Filename | Randomized | Auto-versioned |
| Validation | MIME type regex | Multer filter |

- Filename được randomize: `fieldname-timestamp-random.ext` — ngăn path traversal
- Cloudinary auto-resize: sản phẩm 1000×1000px, biến thể 800×800px
- Upload rate limit: 5 requests/phút/IP

---

### 10. Docker & Infrastructure Security

**Minimal Docker image** (`node:20-alpine`)
- Alpine Linux: attack surface nhỏ hơn đáng kể so với Ubuntu/Debian
- Chỉ cài `--production` dependencies
- `.dockerignore` loại trừ `.env`, `node_modules`, `uploads`, `logs`

**Network Isolation** (docker-compose)
```yaml
networks:
  app-network:
    driver: bridge
```
- Backend chỉ expose nội bộ trên port 5000
- Nginx là điểm tiếp xúc duy nhất với internet (ports 80/443)
- Database không expose ra ngoài

**Secrets Management**
- Tất cả credentials trong `.env` / `docker.env`
- `.gitignore` loại trừ: `*.env`, `docker.env`, `nginx/ssl/`
- Không hardcode bất kỳ secret nào trong source code

---

### 11. XSS & CSRF Mitigation

- **HttpOnly cookies**: JavaScript không thể đọc auth cookie
- **SameSite=None (Strict mode)**: Giảm nguy cơ CSRF
- **Helmet xssFilter**: Kích hoạt bộ lọc XSS tích hợp trong trình duyệt
- **Origin validation**: CORS + cookie SameSite kết hợp làm CSRF mitigation layer

---

## Cài đặt & Chạy thử

### Prerequisites
- Node.js >= 18
- MySQL 8.x
- Docker & Docker Compose (khuyến nghị)

### Với Docker (Production-like)

```bash
# Clone repo
git clone https://github.com/annguyenax/Furniture-Web.git
cd Furniture-Web

# Tạo file cấu hình môi trường
cp Back-end/.env.example Back-end/.env
# Điền các giá trị: DB_*, JWT_SECRET, GOOGLE_CLIENT_ID, ...

# Build và chạy toàn bộ stack
docker-compose build
docker-compose up -d

# Chạy migration và seed
docker exec -it furniture_backend npx sequelize-cli db:migrate
docker exec -it furniture_backend npx sequelize-cli db:seed:all
```

### Chạy local (Development)

```bash
# Backend
cd Back-end
npm install
npm run dev   # http://localhost:5000

# Frontend
cd Front-end
npm install
npm run dev   # http://localhost:5173
```

---

## Cấu trúc dự án

```
Furniture-Web/
├── Back-end/
│   ├── src/
│   │   ├── config/         # CORS, DB, JWT, Cloudinary config
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, RBAC, rate limiter, upload
│   │   ├── models/         # Sequelize models (25+ tables)
│   │   ├── routes/         # API routes với validation
│   │   ├── services/       # Auth service, business services
│   │   └── utils/          # bcrypt, captcha, email, validator
│   └── Dockerfile
├── Front-end/
│   └── src/
├── nginx/
│   └── default.conf        # TLS, security headers, proxy config
├── docker-compose.yml
└── README.md
```

---

## Mapping OWASP Top 10 → Biện pháp đã triển khai

| OWASP 2021 | Biện pháp trong dự án |
|-----------|----------------------|
| A01 – Broken Access Control | RBAC middleware, resource ownership check |
| A02 – Cryptographic Failures | HTTPS/TLS, bcrypt, SHA-256 token hash, HttpOnly |
| A03 – Injection | Sequelize ORM (parameterized queries) |
| A04 – Insecure Design | Lockout, rate limiting, token revocation |
| A05 – Security Misconfiguration | Helmet headers, CORS whitelist, Docker isolation |
| A06 – Vulnerable Components | Alpine image, production-only deps |
| A07 – Identification & Auth Failures | JWT validation, lockout, CAPTCHA, email verify |
| A08 – Software & Data Integrity | Docker image pinning, .gitignore secrets |
| A09 – Logging & Monitoring | Morgan request logging |
| A10 – SSRF | Environment-controlled external service URLs |

---

## Tác giả

**Nguyễn Văn An** — Sinh viên An toàn thông tin, PTIT TP.HCM


---

*Đồ án môn: An Toàn Ứng Dụng Web — Học viện Công nghệ Bưu chính Viễn thông cơ sở TP.HCM*
