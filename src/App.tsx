import React, { useEffect } from 'react';
import PackageBuilder from './components/PackageBuilder';
import SimplePackageBuilder from './components/SimplePackageBuilder';
import { usePackageBuilder } from './hooks/usePackageBuilder';

function App() {
  const packageBuilderState = usePackageBuilder();
  const [showFullForm, setShowFullForm] = React.useState(false);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        window.parent.postMessage(
          {
            type: 'resize',
            height: document.documentElement.scrollHeight,
          },
          '*'
        );
      }, 100);
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 lg:p-12">
      <div className="container mx-auto max-w-4xl lg:max-w-5xl">
        {showFullForm ? (
          <PackageBuilder {...packageBuilderState} />
        ) : (
          <SimplePackageBuilder 
            onShowFullForm={() => setShowFullForm(true)}
            selectedSize={packageBuilderState.selectedSize}
            selectedServices={packageBuilderState.selectedServices}
            totalPrice={packageBuilderState.totalPrice}
            validationErrors={packageBuilderState.validationErrors}
            handleSizeSelect={packageBuilderState.handleSizeSelect}
            handleServiceToggle={packageBuilderState.handleServiceToggle}
          />
        )}
      </div>
    </div>
  );
}

export default App;