import { useState } from "react";
import { Spinner } from "@heroui/spinner";

interface LoadingProps {
  message?: string;
}

export const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner className="wave mb-4" />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );
};

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  return {
    isLoading,
    setIsLoading,
    error,
    setError: handleError,
    startLoading,
    stopLoading,
  };
};
