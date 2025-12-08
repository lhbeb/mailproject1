'use client';

import { useState, useEffect } from 'react';
import ShippingEmailForm from '../../components/ShippingEmailForm';
import OrderConfirmationForm from '../../components/OrderConfirmationForm';
import RefundEmailForm from '../../components/RefundEmailForm';
import RecoveryEmail1Form from '../../components/RecoveryEmail1Form';
import RecoveryEmail2Form from '../../components/RecoveryEmail2Form';
import RecoveryEmail3Form from '../../components/RecoveryEmail3Form';
import AboutHappyDeelForm from '../../components/AboutHappyDeelForm';
import EmailPreview from '../../components/EmailPreview';
import LoginForm from '../../components/LoginForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState('tracking');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth-check');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Transactional Emails (Order-related)
  const transactionalTabs = [
    { id: 'tracking', label: 'Tracking Number Email', icon: '📦' },
    { id: 'confirmation', label: 'Order Confirmation', icon: '✅' },
    { id: 'refund', label: 'Refund Email (TBAT)', icon: '💰' },
  ];

  // Recovery Emails
  const recoveryTabs = [
    { id: 'recovery1', label: 'Recovery 1', icon: '🛒' },
    { id: 'recovery2', label: 'Recovery 2', icon: '💚' },
    { id: 'recovery3', label: 'Recovery 3', icon: '⏰' },
  ];

  // Informational Emails (Marketing/Educational)
  const informationalTabs = [
    { id: 'about', label: 'About Us Happy Deel Email (TBAT)', icon: '🏪' },
  ];

  const allTabs = [...transactionalTabs, ...recoveryTabs, ...informationalTabs];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <img
                src="/logo.png"
                alt="Happydeel"
                className="h-10 w-auto"
              />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center animate-slide-in">
            <div className="w-full max-w-md">
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Enhanced Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl shadow-md">
                <img
                  src="/logo.png"
                  alt="Happydeel"
                  className="h-10 w-auto"
                />
              </div>

            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab(activeTab === 'preview' ? 'tracking' : 'preview')}
                className={`
                  hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${activeTab === 'preview'
                    ? 'bg-white text-blue-600 shadow-md ring-2 ring-blue-500 ring-offset-2 ring-offset-blue-600'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }
                `}
              >
                <span>{activeTab === 'preview' ? '🔙' : '👁️'}</span>
                <span>{activeTab === 'preview' ? 'Exit Preview' : 'Preview Mode'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                  {(user || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium text-sm">{user || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Modern Pill-Style Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-slide-in">
            {activeTab !== 'preview' && (
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-6 border-b border-slate-200">
                <nav className="flex flex-col gap-6" aria-label="Email Types">
                  {/* Transactional Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Transactional Emails</h3>
                    <div className="flex flex-wrap gap-2">
                      {transactionalTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`
                            flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm
                            transition-all duration-200 transform
                            ${activeTab === tab.id
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                              : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:scale-102'
                            }
                          `}
                        >
                          <span className="text-lg">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recovery Emails Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Recovery Emails</h3>
                    <div className="flex flex-wrap gap-2">
                      {recoveryTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`
                            flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm
                            transition-all duration-200 transform
                            ${activeTab === tab.id
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                              : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:scale-102'
                            }
                          `}
                        >
                          <span className="text-lg">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Informational Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Informational Emails</h3>
                    <div className="flex flex-wrap gap-2">
                      {informationalTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`
                            flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm
                            transition-all duration-200 transform
                            ${activeTab === tab.id
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                              : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md hover:scale-102'
                            }
                          `}
                        >
                          <span className="text-lg">{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            )}

            {/* Content Area */}
            <div className="p-8 bg-white animate-fade-in">
              {activeTab === 'tracking' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                      📦
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Tracking Number Email</h2>
                      <p className="text-slate-600 text-sm">Send tracking details to customers</p>
                    </div>
                  </div>
                  <ShippingEmailForm />
                </div>
              )}
              {activeTab === 'confirmation' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      ✅
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Order Confirmation</h2>
                      <p className="text-slate-600 text-sm">Confirm order placement</p>
                    </div>
                  </div>
                  <OrderConfirmationForm />
                </div>
              )}
              {activeTab === 'refund' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
                      💰
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Refund Email (TBAT)</h2>
                      <p className="text-slate-600 text-sm">Notify customers about refunds</p>
                    </div>
                  </div>
                  <RefundEmailForm />
                </div>
              )}
              {activeTab === 'recovery1' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                      🛒
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Recovery Email 1 (Urgent)</h2>
                      <p className="text-slate-600 text-sm">Create urgency with scarcity messaging</p>
                    </div>
                  </div>
                  <RecoveryEmail1Form />
                </div>
              )}
              {activeTab === 'recovery2' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      💚
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Recovery Email 2 (Friendly)</h2>
                      <p className="text-slate-600 text-sm">Helpful reminder with a friendly tone</p>
                    </div>
                  </div>
                  <RecoveryEmail2Form />
                </div>
              )}
              {activeTab === 'recovery3' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                      ⏰
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Recovery Email 3 (Last Chance)</h2>
                      <p className="text-slate-600 text-sm">Final urgent reminder with limited stock warning</p>
                    </div>
                  </div>
                  <RecoveryEmail3Form />
                </div>
              )}
              {activeTab === 'about' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                      🏪
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">About Us Happy Deel Email (TBAT)</h2>
                      <p className="text-slate-600 text-sm">Send comprehensive business model explanation</p>
                    </div>
                  </div>
                  <AboutHappyDeelForm />
                </div>
              )}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                      👁️
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Email Preview</h2>
                      <p className="text-slate-600 text-sm">Preview all email templates</p>
                    </div>
                  </div>
                  <EmailPreview />
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center text-slate-500 text-sm">
            <p>HappyDeel Email Management System • Powered by Next.js & Nodemailer</p>
          </div>
        </div>
      </div>
    </main >
  );
}
