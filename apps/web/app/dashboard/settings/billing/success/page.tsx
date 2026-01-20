"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function BillingSuccessPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Give webhook time to process
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <Card className="p-12 text-center">
                {loading ? (
                    <div className="space-y-4">
                        <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
                        <h1 className="text-2xl font-bold">Processing your subscription...</h1>
                        <p className="text-muted-foreground">
                            Please wait while we activate your new plan
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                            <p className="text-muted-foreground">
                                Your subscription has been activated. You can now enjoy all the features of your new plan.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                onClick={() => router.push("/dashboard/podcasts/new")}
                                size="lg"
                            >
                                Create Your First Podcast
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/dashboard/settings/billing")}
                                size="lg"
                            >
                                View Billing
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
