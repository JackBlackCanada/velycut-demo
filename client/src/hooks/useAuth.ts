import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const [hasAuthError, setHasAuthError] = useState(false);
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Don't refetch automatically
    enabled: !hasAuthError, // Disable query if we know auth failed
  });

  // Set auth error on 401 responses to prevent continuous requests
  useEffect(() => {
    if (error && error.message?.includes('401')) {
      setHasAuthError(true);
    }
  }, [error]);

  const isAuthenticated = !!user && !error && !hasAuthError;
  
  return {
    user,
    isLoading: isLoading && !hasAuthError && !error,
    isAuthenticated,
  };
}