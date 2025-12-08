# 📦 Happydeel Shipping Dashboard

A professional shipping confirmation email web application built with Next.js, TailwindCSS, and Gmail SMTP integration.

## 🚀 Features

- **Professional Email Templates**: Beautiful HTML email templates that look great on all devices
- **Gmail SMTP Integration**: Secure email delivery through Gmail with high deliverability rates
- **Automatic Tracking Links**: Generate tracking URLs for major shipping providers
- **Modern UI**: Clean, responsive dashboard built with TailwindCSS
- **Form Validation**: Client-side and server-side validation for all inputs
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **TypeScript Support**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 18 + TailwindCSS
- **Backend**: Next.js API Routes
- **Email Service**: Nodemailer + Gmail SMTP
- **Authentication**: Gmail App Password
- **Styling**: TailwindCSS
- **Language**: TypeScript

## 📂 Project Structure

```
/mailproject
├── /src/app/                    # App Router pages
│   ├── globals.css             # Global styles with Tailwind
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard page
├── /pages/api/                 # API routes
│   └── send-shipping-email.js  # Email sending endpoint
├── /components/                # React components
│   └── ShippingEmailForm.js    # Main form component
├── /public/                    # Static assets
├── .env.local                  # Environment variables (Gmail credentials)
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # This file
```

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd mailproject

# Install dependencies
npm install
```

### 2. Configure Gmail SMTP

#### Step 1: Enable 2-Factor Authentication
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

#### Step 2: Generate App Password
1. In Google Account settings, go to **Security**
2. Under "2-Step Verification", click **App passwords**
3. Select **Mail** as the app
4. Select **Other (Custom name)** as the device
5. Enter "Happydeel Shipping" as the name
6. Click **Generate**
7. Copy the 16-character app password (format: xxxx xxxx xxxx xxxx)

#### Step 3: Update Environment Variables
1. Open `.env.local` file in the project root
2. Replace the placeholder values:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-actual-email@gmail.com
GMAIL_PASS=your-16-character-app-password
```

**Important**: 
- Use your actual Gmail address for `GMAIL_USER`
- Use the 16-character app password (not your regular Gmail password) for `GMAIL_PASS`
- Remove spaces from the app password

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port).

## 📧 How to Use

1. **Open the Dashboard**: Navigate to the application URL in your browser
2. **Fill the Form**:
   - **Customer Email**: Enter the recipient's email address
   - **Product Name**: Enter the name of the shipped product
   - **Tracking Number**: Enter the shipping tracking number
3. **Send Email**: Click "Send Shipping Email" button
4. **Confirmation**: You'll see a success message when the email is sent

## 📬 Email Template Features

The generated emails include:

- **Professional Branding**: Happydeel branded header
- **Order Details**: Product name and customer information
- **Tracking Information**: Tracking number with clickable tracking link
- **Responsive Design**: Looks great on desktop and mobile
- **Plain Text Fallback**: For email clients that don't support HTML
- **Professional Footer**: Company information and disclaimers

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**: Push your code to a GitHub repository

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     GMAIL_USER=your-actual-email@gmail.com
     GMAIL_PASS=your-16-character-app-password
     ```

4. **Deploy**: Vercel will automatically deploy your application

### Alternative Deployment Options

- **Netlify**: Similar process to Vercel
- **Railway**: Great for full-stack applications
- **DigitalOcean App Platform**: For more control over the deployment

## 🔒 Security Best Practices

- **Environment Variables**: Never commit `.env.local` to version control
- **App Passwords**: Use Gmail App Passwords, never regular passwords
- **HTTPS**: Always use HTTPS in production
- **Rate Limiting**: Consider implementing rate limiting for the API endpoint
- **Input Validation**: All inputs are validated on both client and server side

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Adding New Features

1. **New Email Templates**: Modify the HTML template in `/pages/api/send-shipping-email.js`
2. **Form Fields**: Add new fields to `ShippingEmailForm.js` and update the API
3. **Styling**: Customize styles in `globals.css` or component files
4. **Tracking Providers**: Update tracking URL generation in the API route

## 📝 API Documentation

### POST `/api/send-shipping-email`

Sends a shipping confirmation email to the specified customer.

#### Request Body

```json
{
  "customerEmail": "customer@example.com",
  "productName": "Wireless Headphones",
  "trackingNumber": "1Z999AA1234567890"
}
```

#### Response

**Success (200)**:
```json
{
  "success": true,
  "message": "Shipping confirmation email sent successfully!",
  "messageId": "email-message-id"
}
```

**Error (400/500)**:
```json
{
  "error": "Error message describing what went wrong"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Email authentication failed"**
   - Verify your Gmail credentials in `.env.local`
   - Ensure you're using an App Password, not your regular password
   - Check that 2-Factor Authentication is enabled

2. **"Failed to connect to Gmail SMTP server"**
   - Check your internet connection
   - Verify Gmail SMTP settings (host: smtp.gmail.com, port: 465)

3. **"Invalid email format"**
   - Ensure the customer email is in valid format (user@domain.com)

4. **Development server issues**
   - Try deleting `node_modules` and running `npm install` again
   - Check if port 3000 is available or use a different port

### Getting Help

If you encounter issues:

1. Check the browser console for client-side errors
2. Check the terminal/server logs for server-side errors
3. Verify all environment variables are set correctly
4. Ensure your Gmail account has the necessary permissions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

# 🌊 Project Nexus

*Where digital currents converge.*

---

## ⚡ Initialize

```bash
npm install
npm run dev
```

## 🔮 Deploy

```bash
npm run build
```

---

*Some things are better left undiscovered.*
