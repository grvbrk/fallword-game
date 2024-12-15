import React, { createContext, useContext, useEffect, useState } from 'react';
import { sendToDevvit } from '../utils';

type UserActivityContextProps = {
  isActive: boolean;
  lastActiveTime: Date | null;
};

const UserActivityContext = createContext<UserActivityContextProps | undefined>(undefined);

export default function UserActivityProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(true);
  const [lastActiveTime, setLastActiveTime] = useState<Date | null>(null);

  useEffect(() => {
    let inactivityTimeout: ReturnType<typeof setTimeout>;

    const handleActivity = () => {
      setIsActive(true);
      setLastActiveTime(new Date());

      // Reset inactivity timeout
      clearTimeout(inactivityTimeout);

      // Set timeout to send USER_OFFLINE event after 5 minutes of inactivity
      inactivityTimeout = setTimeout(
        () => {
          setIsActive(false);
          sendToDevvit({ type: 'USER_OFFLINE' }); // Notify Reddit Blocks
        },
        5 * 60 * 1000
      );
    };

    const handleBeforeUnload = () => {
      // Send USER_OFFLINE event when user closes or refreshes the page
      sendToDevvit({ type: 'USER_OFFLINE' });
    };

    // Listen for activity events
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    // Listen for page unload events
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      clearTimeout(inactivityTimeout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <UserActivityContext.Provider value={{ isActive, lastActiveTime }}>
      {children}
    </UserActivityContext.Provider>
  );
}

export const useUserActivity = (): UserActivityContextProps => {
  const context = useContext(UserActivityContext);
  if (!context) {
    throw new Error('useUserActivity must be used within a UserActivityProvider');
  }
  return context;
};
