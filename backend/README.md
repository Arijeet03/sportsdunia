

A comprehensive multi-level referral and earning system with real-time updates, built with Node.js, Express, MongoDB, and Socket.io.



- **Multi-Level Referral System**: Support for up to 8 direct referrals per user
- **Real-Time Earnings**: Live updates via WebSocket connections
- **Profit Distribution**: 5% for Level 1, 1% for Level 2 referrals
- **Purchase Validation**: Minimum 1000Rs threshold for earnings
- **Secure Authentication**: JWT-based authentication system
- **Real-Time Notifications**: Instant earnings notifications
- **Analytics Dashboard**: Detailed reports and earnings breakdown




- **Direct Earnings**: 5% of profit from Level 1 users (direct referrals)
- **Indirect Earnings**: 1% of profit from Level 2 users (indirect referrals)
- **Minimum Purchase**: Earnings only apply to purchases above 1000Rs


- **Users**: User profiles, referral hierarchies, and relationships
- **Earnings**: Transaction history and earnings breakdown
- **Referrals**: Referral relationships and tree structure
- **Purchases**: Purchase records and validation



- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn



1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sportsdunia-referral-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb:
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start the server**
   ```bash
   
   npm run dev
   
   
   npm start
   ```




- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile


- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/referrals` - Get user's referral tree


- `POST /api/referrals/join` - Join using referral code
- `GET /api/referrals/tree` - Get referral tree structure
- `GET /api/referrals/stats` - Get referral statistics


- `GET /api/earnings/summary` - Get earnings summary
- `GET /api/earnings/history` - Get earnings history
- `GET /api/earnings/realtime` - Real-time earnings updates


- `POST /api/purchases/create` - Create a purchase
- `GET /api/purchases/history` - Get purchase history



The system uses Socket.io for real-time communication:

- **Live Earnings Updates**: Real-time earnings notifications
- **Referral Activity**: Live updates when referrals make purchases
- **System Notifications**: Real-time system messages




```javascript
{
  name: String,
  email: String,
  password: String,
  referralCode: String,
  referredBy: ObjectId,
  directReferrals: [ObjectId],
  totalEarnings: Number,
  isActive: Boolean,
  createdAt: Date
}
```


```javascript
{
  userId: ObjectId,
  amount: Number,
  source: String,
  level: Number,
  purchaseId: ObjectId,
  createdAt: Date
}
```



- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers




```bash
npm test
npm run test:watch
```


```
├── config/          
├── middleware/      
├── models/          
├── routes/          
├── services/        
├── socket/          
├── utils/           
└── server.js        
```



| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017/sportsdunia_referral |
| `JWT_SECRET` | JWT secret key | Required |
| `MAX_DIRECT_REFERRALS` | Maximum direct referrals per user | 8 |
| `LEVEL1_COMMISSION_PERCENTAGE` | Level 1 commission | 5 |
| `LEVEL2_COMMISSION_PERCENTAGE` | Level 2 commission | 1 |
| `MIN_PURCHASE_AMOUNT` | Minimum purchase for earnings | 1000 |



1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request



MIT License - see LICENSE file for details 