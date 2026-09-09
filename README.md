# PackersMart_Coders-Technologies
The company matching system relies on a two-tier approach: a **Lead Scoring Formula** to calculate the lead's quality tier, followed by a **4-Step Matching Algorithm** to assign the optimal company.


## 🚀 How to Run the Application

Ensure you have [Node.js](https://nodejs.org/) installed on your machine before proceeding.

---

### 1. Backend Server

Navigate to the backend project directory, install dependencies, and start the server using Nodemon:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
nodemon app.js

------------------------------------------------------------------------------------------------------------------------------------------------------------------------
### 1. Client frontend

# Navigate to client frontend directory
cd client

# Install dependencies
npm install

# Start client app
npm run dev

------------------------------------------------------------------------------------------------------------------------------------------------------------------------
### 1. Admin frontend

# Navigate to admin frontend directory
cd admin

# Install dependencies
npm install

# Start admin portal
npm run dev

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 1. Lead Scoring Formula

A lead's quality tier determines which level of logistics provider gets priority.

$$\text{Lead Score} = \text{Urgency Score} + \text{Distance Score} + \text{Property Score}$$

#### **A. Urgency Score (Max 40 Points)**

Calculated using the number of days until the move date ($\Delta \text{Days} = \text{MovingDate} - \text{Today}$):

* **$\le 7$ days:** $40$ points
* **$8 - 30$ days:** $20$ points
* **$> 30$ days:** $5$ points

#### **B. Value Score (Max 40 Points)**

* **Distance Category:**
* $\text{Long Distance} > 50\text{ km}$: $20$ points
* $\text{Short Distance} \le 50\text{ km}$: $10$ points


* **Property Type:**
* $\text{Commercial}$: $20$ points
* $\text{Domestic}$: $10$ points



#### **C. Quality Categorization**

* **Hot Lead:** $\text{Score} \ge 70$
* **Warm Lead:** $40 \le \text{Score} < 70$
* **Cold Lead:** $\text{Score} < 40$

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 2. Company Matching Algorithm

When a search or match request is made (`getMatchingCompanies` / `confirmMatch`), the engine executes the following logic:

#### **Step 1: Verification Check**

The lead's status is validated. Matching proceeds **only** if:


$$\text{Lead.status} == \text{"Verified"}$$

#### **Step 2: Hard Database Filtering**

The MongoDB query filters active companies that fulfill both location and property constraints:

```javascript
{
  isActive: true,
  coverageAreas: { $all: [lead.pickUp, lead.dropOff] },
  serviceTypes: { $in: [lead.propertyType] }
}

```

* **Coverage Match:** Company must service **both** `pickUp` AND `dropOff` cities.
* **Service Match:** Company must support the lead's `propertyType` (Domestic or Commercial).

#### **Step 3: Quality Ranking**

All eligible matching companies are sorted by rating in descending order:


$$\text{Sort Order}: \text{rating (descending)} \rightarrow \text{\_id (ascending)}$$

#### **Step 4: Priority Routing (`suggestedMatch`)**

To reserve premium logistics providers for high-value leads:

* **Hot Leads ($\text{Score} \ge 70$):** Matched directly to the **#1 top-rated** company (`matchingCompanies[0]`).
* **Warm / Cold Leads ($\text{Score} < 70$):** Matched to the **#2 second-highest rated** company (`matchingCompanies[1]`), falling back to #1 if only one company matches the route.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## API routes

leadsRoutes
    POST ->   /lead/createlead     ( CreateLead )
    POST ->   /lead/:id/verify-otp ( verifyOtp)

 AdminRoutes
    GET ->  /admin/leads           (GetAll leads)
    GET -> /admin/leads/stats    (getLeadStats)
    GET -> /admin/leads/verified  (getVerifiedLeads)
    GET -> /admin/leads/pending  (getPendingLeads)
    GET -> /admin/leads/fake     (getFakeLeads)
    GET -> admin/leads/matched  (getMatchedLeads)
    GET -> admin/leads/:id         (getFakeLeads)
    GET -> admin/leads/matched  (getMatchedLeads)
    GET -> admin/leads/:id         (getLeadById)

Company & Matching Routes 
     GET= -> company/matched/:lead_id 
    POST -> company/Matched/:lead_id/:compnay_id
    
------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## 🗄️ Database Schemas & Models

All MongoDB schemas use standard Mongoose timestamps (`createdAt`, `updatedAt`).

---

### 1. Lead Model (`Lead`)

Stores customer moving requests, automated scoring metrics, and lifecycle statuses.

| Field | Type | Validation / Options | Description |
| --- | --- | --- | --- |
| `firstName` | String | Required, `minLength: 3`, `maxLength: 15` | Customer's first name |
| `lastName` | String | Required, `minLength: 3`, `maxLength: 15` | Customer's last name |
| `phone` | Number | Required, Exactly 10 digits | Mobile contact number |
| `email` | String | Required, Valid Email, Lowercase, Trim | Customer's email address |
| `pickUp` | String | Required, Enum: `['Mumbai', 'Pune', 'Nashik', 'Thane', 'Raigad']` | Origin city |
| `dropOff` | String | Required, Enum: `['Mumbai', 'Pune', 'Nashik', 'Thane', 'Raigad']` | Destination city |
| `propertyType` | String | Required, Enum: `['Domestic', 'Commercial']` | Move category |
| `distanceCategory` | String | Required, Enum: `['Short', 'Long']` | Auto-calculated (>50 km is Long) |
| `movingDate` | Date | Required | Target date of moving |
| `movingSize` | String | Required, Enum: `['Small', 'Medium', 'Large']` | Inventory volume |
| `additionalInformation` | String | Optional, Default: `""` | Extra customer notes or instructions |
| `status` | String | Default: `'Pending'`<br>

<br>Enum: `['Pending', 'Verified', 'Fake', 'Duplicate', 'Re-attempt', 'Matched']` | Current lead lifecycle state |
| `lead_score` | Number | Default: `0`, `min: 0`, `max: 100` | Calculated quality score |
| `lead_quality` | String | Enum: `['Hot', 'Warm', 'Cold']` | Assigned tier based on score |

---

### 2. Company Model (`Company`)

Stores logistics vendor profiles, operating coverage, and quality ratings.

| Field | Type | Validation / Options | Description |
| --- | --- | --- | --- |
| `name` | String | Required, Trim | Logistics company name |
| `email` | String | Required, Unique, Lowercase | Business email address |
| `phone` | Number | Required | Business phone number |
| `coverageAreas` | Array [String] | Enum: `['Mumbai', 'Pune', 'Nashik', 'Thane', 'Raigad']` | Operational cities served |
| `serviceTypes` | Array [String] | Enum: `['Domestic', 'Commercial']` | Supported move types |
| `rating` | Number | Default: `0`, `min: 0`, `max: 5` | Company rating score |
| `isActive` | Boolean | Default: `true` | Availability status for matching |

---

### 3. Match Model (`Match`)

Links verified leads directly to assigned logistics companies.

| Field | Type | Validation / Options | Description |
| --- | --- | --- | --- |
| `lead_id` | ObjectId | Required, Unique, Ref: `'Lead'` | Reference to the matched Lead document |
| `company_id` | ObjectId | Required, Ref: `'Company'` | Reference to the assigned Company document |

---

### 4. OTP Verification Model (`OtpVerification`)

Manages temporary one-time passwords for mobile verification.

| Field | Type | Validation / Options | Description |
| --- | --- | --- | --- |
| `lead_id` | ObjectId | Required, Ref: `'Lead'` | Reference to the unverified Lead document |
| `otp` | String | Required | Generated 6-digit numeric verification code |
| `expires_at` | Date | Required | Expiration timestamp (5-minute TTL) |