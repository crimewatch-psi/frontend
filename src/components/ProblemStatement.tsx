import { Button } from "@/components/ui/button";

export function ProblemStatement() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
          <p className="text-lg text-gray-600 mb-8">
            Based on BPS data (2021-2023), crime cases in tourist destination
            areas have increased by 23%, highlighting the urgent need for an
            effective security management system. CrimeWatch addresses this
            challenge by providing a comprehensive platform for security
            information management and strategic decision-making.
          </p>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
