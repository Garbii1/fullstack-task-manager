import React, { createContext, useState, useEffect, useMemo } from 'react';

        export const ThemeContext = createContext();

        export const ThemeProvider = ({ children }) => {
          // Initialize theme from localStorage or default to 'light'
          const [theme, setTheme] = useState(() => {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme ? savedTheme : 'light';
          });

          // Apply theme class to body and save to localStorage on change
          useEffect(() => {
            document.body.className = ''; // Remove previous theme classes
            document.body.classList.add(`${theme}-theme`);
            localStorage.setItem('theme', theme);
          }, [theme]);

          const toggleTheme = () => {
            setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
          };

          // Use useMemo to prevent unnecessary re-renders of context consumers
          const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

          return (
            <ThemeContext.Provider value={value}>
              {children}
            </ThemeContext.Provider>
          );
        };
