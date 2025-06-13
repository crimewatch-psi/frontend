import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      title: "Real-time Crime Data",
      description:
        "Access up-to-date crime statistics and trends in tourist destinations",
      content:
        "Monitor and analyze crime patterns with comprehensive data visualization",
    },
    {
      title: "AI-Powered Analytics",
      description:
        "Leverage artificial intelligence for predictive security insights",
      content:
        "Make informed decisions with advanced analytics and risk assessment",
    },
    {
      title: "Resource Optimization",
      description:
        "Efficiently allocate security resources based on data-driven insights",
      content:
        "Optimize security measures and response strategies for better protection",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
