import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../firebase/authService';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useChat } from '../hooks/useChat';

const SideNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);
  const { chatHistory } = useChat();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // Even if logout fails, still return the user to the landing page.
      console.error('Logout failed:', err);
    } finally {
      navigate('/');
    }
  };

  useEffect(() => {
    // Keep sidebar synced with Firebase auth state.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const displayName = user?.displayName || 'User';
  const email = user?.email || '';
  const avatarInitial = useMemo(() => {
    const value = (user?.displayName || user?.email || 'U').trim();
    return value.charAt(0).toUpperCase();
  }, [user]);

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Features', path: '/#features', icon: '✨' },
    { name: 'Human Rights Reading', path: '/human-rights-reading', icon: '📚' },
    { name: 'Quiz Game', path: '/quiz-game', icon: '🧠' },
    { name: 'Audience', path: '/#audience', icon: '👥' },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 ${isOpen ? 'left-56' : 'left-4'} z-50 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-lg hover:bg-white transition-all duration-300 pointer-events-auto`}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Side Navigation Bar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-2xl z-40 transition-all duration-300 ${
          isOpen 
            ? 'w-56 translate-x-0 opacity-100 pointer-events-auto' 
            : '-translate-x-full w-0 opacity-0 pointer-events-none overflow-hidden'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-100">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LibraLearn
              </h1>
            </Link>
            <p className="text-xs text-gray-500 mt-1">AI-Powered Education</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isHashLink = item.path.startsWith('/#');
              const NavComponent = isHashLink ? 'a' : Link;
              const navProps = isHashLink 
                ? { href: item.path }
                : { to: item.path };
              
              return (
                <NavComponent
                  key={item.name}
                  {...navProps}
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </NavComponent>
              );
            })}

            {/* Divider */}
            <div className="my-3 border-t border-gray-200"></div>

            {/* Avatar Chat Section */}
            <div className="p-2 rounded-md bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Chat with Avatar</p>
                  <p className="text-xs text-gray-500">Active Session</p>
                </div>
              </div>

              <div className="mt-2">
                {chatHistory.length === 0 ? (
                  <p className="text-xs text-gray-500 mt-1">No previous chat yet.</p>
                ) : (
                  <div className="max-h-32 overflow-y-auto pr-1 mt-1 space-y-1">
                    {chatHistory
                      .slice()
                      .reverse()
                      .slice(0, 4)
                      .map((entry) => (
                        <div key={entry.id} className="bg-white/70 rounded-md border border-white p-1.5">
                          <p className="text-xs text-blue-700 font-semibold truncate">
                            Q: {entry.query}
                          </p>
                          <p className="text-xs text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
                            A: {(entry.answers || []).map((a) => a.text).join(' ')}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* User Section & Logout */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{avatarInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{email || 'Signed in'}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideNavbar;






