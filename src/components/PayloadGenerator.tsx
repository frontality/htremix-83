
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PayloadGenerator = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payload Generator</CardTitle>
          <CardDescription>
            Generate various payloads for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Payload generator functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayloadGenerator;
