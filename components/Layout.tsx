
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, headerContent, footerContent }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {headerContent}
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl mx-auto w-full pb-24">
        {children}
      </main>

      {footerContent && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            {footerContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
