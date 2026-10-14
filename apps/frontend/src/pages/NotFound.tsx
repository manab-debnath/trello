import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="w-full flex flex-col items-center h-screen justify-center">
      <h1 className="font-bold">404 - Page Not Found</h1>
      <p className="font-medium">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" className="mt-8">
        <Button className="px-6 py-4 cursor-pointer">
          <ArrowLeft />
          Go back to Home
        </Button>
      </Link>
    </div>
  );
};
