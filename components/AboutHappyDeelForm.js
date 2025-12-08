'use client';

import { useState, useEffect, useMemo } from 'react';

export default function AboutHappyDeelForm() {
    const [emailList, setEmailList] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [progress, setProgress] = useState({ sent: 0, total: 0, current: '' });
    const [errors, setErrors] = useState([]);

    // Fetch available email accounts on mount
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch('/api/get-accounts');
                if (response.ok) {
                    const data = await response.json();
                    setAccounts(data.accounts || []);
                }
            } catch (error) {
                console.error('Failed to fetch email accounts:', error);
            }
        };
        fetchAccounts();
    }, []);

    // Parse and validate emails from textarea
    const parsedEmails = useMemo(() => {
        return emailList
            .split('\n')
            .map(email => email.trim())
            .filter(email => email.length > 0)
            .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    }, [emailList]);

    const emailCount = parsedEmails.length;
    const isOverLimit = emailCount > 5000;

    // Random delay between 2000ms and 5000ms
    const randomDelay = () => {
        const min = 2000;
        const max = 5000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const sendSingleEmail = async (email) => {
        const response = await fetch('/api/send-about-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerEmail: email,
                senderEmail: senderEmail // Pass selected sender
            }),
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Failed to send email');
        }

        return response.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (emailCount === 0) {
            setMessage('Please enter at least one valid email address');
            setMessageType('error');
            return;
        }

        if (isOverLimit) {
            setMessage('Maximum 5000 emails allowed. Please reduce the list.');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');
        setErrors([]);
        setProgress({ sent: 0, total: emailCount, current: '' });

        const failedEmails = [];
        let successCount = 0;
        const BATCH_SIZE = 10;
        const BATCH_DELAY = 30000; // 30 seconds

        for (let i = 0; i < parsedEmails.length; i++) {
            const email = parsedEmails[i];

            // Check for batch pause
            if (i > 0 && i % BATCH_SIZE === 0) {
                setProgress(prev => ({ ...prev, current: `Pausing for safety (${BATCH_DELAY / 1000}s)...` }));
                await sleep(BATCH_DELAY);
            }

            try {
                setProgress({ sent: i, total: emailCount, current: email });
                await sendSingleEmail(email);
                successCount++;
                setProgress({ sent: i + 1, total: emailCount, current: email });

                // Add random delay between sends (except for the last one)
                if (i < parsedEmails.length - 1) {
                    await sleep(randomDelay());
                }
            } catch (error) {
                console.error(`Failed to send to ${email}:`, error);
                failedEmails.push({ email, error: error.message });
            }
        }

        setIsLoading(false);
        setErrors(failedEmails);

        // Set final message
        if (successCount === emailCount) {
            setMessage(`✅ Successfully sent ${successCount} email${successCount !== 1 ? 's' : ''}!`);
            setMessageType('success');
            setEmailList(''); // Clear the textarea
        } else if (successCount > 0) {
            setMessage(`⚠️ Sent ${successCount} of ${emailCount} emails. ${failedEmails.length} failed.`);
            setMessageType('error');
        } else {
            setMessage(`❌ Failed to send all emails. Please check the errors below.`);
            setMessageType('error');
        }

        setProgress({ sent: 0, total: 0, current: '' });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    About HappyDeel Email - Bulk Send
                </h2>
                <p className="text-gray-600 text-sm">
                    Send comprehensive business model explanation to multiple customers
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sender Email Selection */}
                <div>
                    <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Send From (Optional)
                    </label>
                    <select
                        id="senderEmail"
                        name="senderEmail"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-900 bg-white"
                        disabled={isLoading}
                    >
                        <option value="">Random (Auto-Rotate)</option>
                        {accounts.map((account, index) => (
                            <option key={index} value={account.user}>
                                {account.user}
                            </option>
                        ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">Leave as "Random" to let the system choose.</p>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="emailList" className="block text-sm font-medium text-gray-700">
                            Customer Emails (one per line) *
                        </label>
                        <span className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : emailCount > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                            {emailCount} email{emailCount !== 1 ? 's' : ''} detected
                            {isOverLimit && ' (MAX: 5000)'}
                        </span>
                    </div>
                    <textarea
                        id="emailList"
                        name="emailList"
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        required
                        disabled={isLoading}
                        rows={10}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white font-mono text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="customer1@example.com&#10;customer2@example.com&#10;customer3@example.com"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                        Enter one email address per line. Invalid emails will be automatically filtered out.
                    </p>
                </div>

                {/* Progress Bar */}
                {isLoading && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-700">
                            <span className="font-medium">Sending emails...</span>
                            <span className="font-semibold">{progress.sent} / {progress.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${(progress.sent / progress.total) * 100}%` }}
                            />
                        </div>
                        {progress.current && (
                            <p className="text-xs text-gray-600 truncate">
                                Current: {progress.current}
                            </p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || emailCount === 0 || isOverLimit}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending {progress.sent}/{progress.total}...
                        </div>
                    ) : (
                        `Send to ${emailCount} Email${emailCount !== 1 ? 's' : ''}`
                    )}
                </button>
            </form>

            {message && (
                <div className={`mt-6 p-4 rounded-lg ${messageType === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message}
                </div>
            )}

            {/* Error List */}
            {errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-sm font-semibold text-red-800 mb-2">
                        Failed Emails ({errors.length}):
                    </h3>
                    <div className="max-h-40 overflow-y-auto">
                        <ul className="text-xs text-red-700 space-y-1">
                            {errors.map((err, idx) => (
                                <li key={idx} className="font-mono">
                                    {err.email}: {err.error}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
