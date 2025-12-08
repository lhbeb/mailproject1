import nodemailer from 'nodemailer';

// Email Accounts Configuration
// Add as many accounts as you need here
const emailAccounts = [
  {
    user: 'contacthappydeel@gmail.com',
    pass: 'pqdc drxx ltlo xapr', // App Password
  },
  {
    // Example of using environment variables for a second account
    user: process.env.GMAIL_USER_2 || 'heyhappydeel@gmail.com',
    pass: process.env.GMAIL_PASS_2 || 'chck bnjm qisf seay',
  },
  // Add more accounts here...
];

/**
 * Selects a random email account from the configured list.
 * @returns {Object} An object containing user and pass.
 */
export function getRandomAccount() {
  const validAccounts = emailAccounts.filter(account =>
    account.user && account.pass &&
    !account.user.includes('example.com') &&
    !account.user.includes('another.email')
  );

  if (validAccounts.length === 0) {
    // Fallback to the first one even if it looks like a placeholder, 
    // or return null to handle error upstream
    console.warn('No valid email accounts found in configuration. Using default/first account.');
    return emailAccounts[0];
  }

  const randomIndex = Math.floor(Math.random() * validAccounts.length);
  return validAccounts[randomIndex];
}

/**
 * Creates a Nodemailer transporter for a specific account.
 * @param {Object} account - The account object with user and pass.
 * @returns {Object} Nodemailer transporter.
 */
export function createTransporter(account) {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
}

/**
 * Returns a list available email accounts (user only, no passwords).
 * @returns {Array} Array of account objects with user property.
 */
export function getPublicAccounts() {
  return emailAccounts
    .filter(account => account.user && account.pass) // Only valid accounts
    .map(account => ({ user: account.user }));
}

/**
 * Retrieves a specific account by user email.
 * @param {string} email - The email address to look for.
 * @returns {Object|null} The account object or null if not found.
 */
export function getAccountByUser(email) {
  if (!email) return null;
  return emailAccounts.find(account => account.user === email) || null;
}
