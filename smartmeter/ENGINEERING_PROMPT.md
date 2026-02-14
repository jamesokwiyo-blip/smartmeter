# SMART METER RWANDA — PROFESSIONAL DEVELOPMENT PROMPT

## 1. DESIGN SYSTEM & COLOR PALETTE

### Primary Colors (Electricity-Themed)
- **Deep Navy**: `#0F172A` (primary background, trust, stability)
- **Electric Blue**: `#0EA5E9` (primary accents, energy, actions)
- **Emerald Green**: `#10B981` (success, confirmation, growth)
- **Warm Gold**: `#F59E0B` (alerts, highlights, energy)
- **White/Off-White**: `#F8FAFC` (backgrounds, readability)
- **Dark Slate**: `#1E293B` (text, cards, secondary elements)

### Design Principles
- Clean, minimal, sophisticated spacing
- Smooth micro-interactions and transitions (300-400ms)
- Professional typography: Use modern sans-serif (Inter, Poppins, or system fonts)
- Subtle gradients and shadows for depth
- Consistent icon system (Feather icons or similar)
- No neon or overly bright AI colors—maintain professional energy industry aesthetic

---

## 2. TECHNICAL STACK

### Frontend
- **Framework**: React + TypeScript (or Next.js for SSR)
- **Styling**: Tailwind CSS + custom CSS modules
- **State Management**: React Context API or Zustand
- **UI Components**: Shadcn/ui or custom component library
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios or Fetch API
- **Authentication**: JWT tokens (stored securely)
- **Local Storage**: For temporary UI state only

### Backend
- **Framework**: Node.js + Express (or similar)
- **Database**: SQLite (or PostgreSQL for scalability)
- **Authentication**: JWT with secure password hashing (bcrypt)
- **Validation**: Zod or Joi
- **API**: RESTful API with proper error handling

### Database Schema
```
Users Table:
- id (UUID primary key)
- fullName (string)
- email (unique)
- phoneNumber (string)
- passwordHash (bcrypt)
- createdAt (timestamp)
- updatedAt (timestamp)

Meters Table:
- id (UUID primary key)
- userId (foreign key to Users)
- meterNumber (string, unique)
- createdAt (timestamp)

Purchases Table:
- id (UUID primary key)
- userId (foreign key to Users)
- meterNumber (string)
- amountRWF (decimal)
- kwhAmount (decimal, calculated)
- paymentMethod (enum: MTN, AIRTEL, BANK, CARD)
- tokenNumber (string, unique, auto-generated)
- rechargeCode (string, auto-generated)
- status (enum: PENDING, COMPLETED, FAILED)
- createdAt (timestamp)
- updatedAt (timestamp)

Payments Table:
- id (UUID primary key)
- purchaseId (foreign key to Purchases)
- paymentMethod (string)
- mobileNumber (string, optional)
- cardLast4 (string, optional)
- transactionReference (string)
- status (enum: PENDING, COMPLETED, FAILED)
- createdAt (timestamp)
```

---

## 3. PAGE STRUCTURE & FEATURES

### A. LANDING/HOME PAGE

**Header/Navigation**
- Smart Meter Rwanda logo (left)
- Navigation menu: Home, About, Team, Login, Create Account
- Responsive hamburger menu for mobile
- Sticky navigation with subtle shadow on scroll

**Hero Section**
- Powerful background gradient (Navy to Electric Blue)
- Headline: "Smart Energy Management for Rwanda"
- Subheading: 1–2 sentence value proposition
- CTA buttons: "Create Account" (Electric Blue) + "Login" (outline)
- Subtle animated elements (floating icons, pulse effects)

**How It Works Section**
- 4 step card layout with icons:
  1. Create Account
  2. Add Your Meter
  3. Choose Payment
  4. Get Instant Power
- Smooth card hover effects

**Key Features Section**
- 6 feature cards (3 columns, responsive):
  - Fast Transactions
  - Secure Payments
  - Real-Time Tracking
  - 24/7 Support
  - Transparent Pricing
  - Mobile Friendly
- Each card with icon, title, and description

**Team Section**
- Professional section showcasing team members
- Grid layout (3–4 members per row)
- Each card displays:
  - Professional photo
  - Name
  - Role/Title
  - 2–3 sentence professional bio
  - Social media icons (LinkedIn, GitHub if applicable)
- Cards with hover effects (slight lift, shadow increase)

**Footer**
- Company info
- Quick links
- Contact details
- Social media icons
- Copyright notice

---

### B. CREATE ACCOUNT PAGE

**Form Container**
- Centered, elegant card design
- Maximum width: 450px
- Subtle background gradient

**Form Fields**
1. Full Name (text input)
2. Email (email input with validation)
3. Phone Number (tel input with country code for Rwanda)
4. Password (password input with strength indicator)
5. Confirm Password (password input)

**Validation Rules**
- Email format validation
- Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special char
- Phone number: Rwanda format (+250...)
- Real-time error display below each field

**Submit Button**
- Full width, Electric Blue background
- Loading state with spinner
- Success notification (green toast)
- Error handling with clear messages

**Link to Login**
- "Already have an account? Login here"

**Database Action**
- Store hashed password in Users table
- Validate email uniqueness
- Return JWT token on success
- Redirect to Dashboard

---

### C. LOGIN PAGE

**Form Container**
- Same elegant design as Create Account
- Centered, card-based layout

**Form Fields**
1. Email (email input)
2. Password (password input)

**Features**
- Remember me checkbox (uses localStorage)
- "Forgot Password?" link (display placeholder, no backend needed yet)
- Real-time validation feedback

**Submit Button**
- Full width, Electric Blue
- Loading state
- Error messages for invalid credentials

**Database Action**
- Query Users table by email
- Verify password hash with bcrypt
- Return JWT token on success
- Store token in localStorage + secure HTTP-only cookie
- Redirect to Dashboard

---

### D. USER DASHBOARD

**Dashboard Header**
- Welcome message: "Welcome back, [User Name]"
- User avatar (initials or icon)
- Logout button (top right)
- Profile icon (opens profile modal)

**Main Content Sections**

#### 1. Buy Electricity Section
**Design**: Card with gradient header (Navy to Electric Blue)

**Inputs**
- Meter Number (text input with validation)
- Amount in RWF (number input, min 100, max 1,000,000)

**Real-Time Conversion Display**
- Formula: 1 kWh = 125 RWF (configurable)
- Show: "X,XXX RWF = XX.XX kWh"
- Update as user types
- Display conversion in lighter text below input

**Payment Method Selection**
- 4 button options (grid layout):
  - MTN Mobile Money (with MTN icon/color)
  - Airtel Money (with Airtel icon/color)
  - Bank Transfer
  - Card Payment
- Selected method highlighted with Electric Blue border

**Conditional Input Based on Payment Method**
- **MTN/Airtel**: Input for mobile number (validation for Rwanda format)
- **Bank/Card**: 
  - Card Number (masked input, last 4 shown)
  - Expiry Date
  - CVV (3 digits)

**Purchase Button**
- Full width, Electric Blue, Large
- Loading state during processing
- Disabled until all fields filled

**Database Action**
- Create entry in Purchases table
- Create entry in Payments table
- Generate unique tokenNumber (12 alphanumeric)
- Generate rechargeCode (8-digit code)
- Set status to COMPLETED
- Return confirmation data

#### 2. Confirmation Modal (Post-Purchase)
**Design**: Centered modal with Emerald Green header

**Content**
- Success icon (checkmark animation)
- "Electricity Purchased Successfully!"
- Green badge: "COMPLETED"
- Breakdown:
  - Amount: X,XXX RWF
  - kWh: XX.XX
  - Meter Number: XXXXXXXXX
  - Token Number: XXXXXXXXXXXX (copyable with click-to-copy icon)
  - Recharge Code: XXXX-XXXX (copyable)
- "Enter Code Manually" button (just closes modal for demo)
- "Back to Dashboard" button

#### 3. Purchase History Section
**Design**: Table/List format with card-based mobile view

**Columns**
- Date (most recent first)
- Meter Number
- Amount (RWF)
- kWh
- Payment Method (with icon)
- Token Number (truncated, expandable)
- Status (badge: Completed/Pending/Failed)

**Features**
- Pagination or infinite scroll (show 10 per page)
- Search/filter by date range
- Download history as CSV (optional)
- Click on row to view details

**Database Query**
- Fetch all purchases for logged-in user
- Order by createdAt DESC
- Include payment method details

#### 4. Profile Section (Modal)
**Content**
- Full Name
- Email
- Phone Number
- Account Created Date
- Edit Profile button (opens edit form)
- Logout button (clears token, redirects to login)

**Database Action**
- Read from Users table
- Update profile if edited (validate email uniqueness)

---

## 4. AUTHENTICATION & SECURITY

**JWT Implementation**
- Token stored in HTTP-only cookie (primary)
- Token also stored in localStorage (for API headers)
- Token expiration: 7 days
- Refresh token mechanism (optional for Phase 1)

**Password Security**
- Hash with bcrypt (cost factor: 12)
- Never store plaintext passwords
- Validate on both frontend and backend

**CORS & API Security**
- Restrict API calls to same domain
- Validate all inputs server-side
- Rate limiting on authentication endpoints

**Protected Routes**
- Redirect unauthenticated users to login
- Verify JWT on every protected API call
- Clear token on logout

---

## 5. DATA PERSISTENCE

**All Data Stored in Database**
- User accounts (permanent)
- Meter information (permanent)
- Purchase history (permanent)
- Payment details (encrypted/masked)

**No Client-Side Storage for Critical Data**
- LocalStorage only for UI state (theme, sidebar toggle, etc.)
- SessionStorage for temporary session data
- All user data fetched from API

**Backup & Recovery**
- Regular database backups
- Soft deletes for user records (optional)
- Audit trail for transactions

---

## 6. PAYMENT FLOW (SIMULATED)

**Steps**
1. User selects payment method
2. User enters required details (mobile/card number)
3. Frontend validates inputs
4. Frontend sends purchase request to backend
5. Backend creates Purchase + Payment records
6. Backend generates Token + Recharge Code
7. Backend returns confirmation data
8. Frontend shows success modal with details
9. User can view purchase in history immediately
10. Backend logs transaction for audit

**Note**: Actual payment gateway integration (MTN, Airtel, bank APIs) will be Phase 2. Phase 1 simulates successful transactions.

---

## 7. RESPONSIVE DESIGN

**Breakpoints**
- Mobile: 0–640px
- Tablet: 641–1024px
- Desktop: 1025px+

**Mobile-First Approach**
- Stack all sections vertically
- Single column for forms
- Hamburger menu for navigation
- Bottom navigation for dashboard actions (optional)
- Touch-friendly buttons (min 48px)

---

## 8. ANIMATIONS & MICRO-INTERACTIONS

**Page Transitions**
- Fade-in/slide-in effects (300ms)
- Smooth color transitions

**Button Interactions**
- Hover: Slight color shift + shadow increase
- Active: Scale down (0.98)
- Disabled: Opacity 0.5

**Form Validation**
- Real-time error messages (fade in)
- Success checkmarks (green)
- Field highlighting on error

**Loading States**
- Spinner animation in buttons
- Skeleton loaders for content
- Progress indicators for multi-step forms

**Success/Error Notifications**
- Toast messages (bottom right)
- Auto-dismiss after 5 seconds
- Dismissable by user
- Green for success, Red for error, Yellow for warnings

---

## 9. ACCESSIBILITY

**WCAG 2.1 AA Compliance**
- Proper heading hierarchy (H1, H2, H3...)
- Alt text for all images
- Keyboard navigation support (Tab, Enter, Escape)
- Color contrast ratio ≥ 4.5:1
- ARIA labels for interactive elements
- Focus indicators on all buttons

---

## 10. PERFORMANCE REQUIREMENTS

**Core Web Vitals**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

**Optimization**
- Code splitting for React components
- Image optimization (WebP, lazy loading)
- Minification of CSS/JS
- Caching strategy for API responses
- Compression (gzip)

---

## 11. DEPLOYMENT

**Frontend**
- Deploy to Vercel, Netlify, or similar
- Environment variables for API URL
- CI/CD pipeline for auto-deployment

**Backend**
- Deploy to Heroku, Railway, or VPS
- Environment variables for database credentials
- Database migrations on deployment

**Database**
- SQLite for development
- PostgreSQL recommended for production
- Database backups automated

---

## 12. DELIVERABLES CHECKLIST

- [ ] Complete source code (frontend + backend)
- [ ] All pages fully designed and functional
- [ ] Database schema implemented
- [ ] User authentication (signup, login, logout)
- [ ] Dashboard with all features operational
- [ ] Purchase history with persistence
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Smooth animations and transitions
- [ ] Form validation and error handling
- [ ] Security best practices implemented
- [ ] README with setup instructions
- [ ] API documentation
- [ ] Environment configuration templates
- [ ] Production-ready code quality

---

## 13. SUCCESS METRICS

✓ Website looks premium, professional, like a $1,000,000 product
✓ All user data persists in database
✓ Fast, responsive, zero loading delays
✓ Beautiful, consistent design throughout
✓ Smooth animations enhance user experience
✓ Professional electricity industry color scheme
✓ Fully functional authentication and dashboard
✓ Purchase history accurately tracked
✓ Ready for payment gateway integration in Phase 2

---

**Ready to build something amazing for Rwanda! 🚀**
