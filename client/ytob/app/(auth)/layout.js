// app/(auth)/layout.js
import LoadingProvider from "@/components/ui/LoadingProvider";

function AuthLayout({ children }) {
  return (
    <LoadingProvider>
      <div className="flex items-center justify-center h-full">
        {children}
      </div>
    </LoadingProvider>
  );
}

export default AuthLayout;