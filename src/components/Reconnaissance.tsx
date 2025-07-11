
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Reconnaissance = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reconnaissance</CardTitle>
          <CardDescription>
            Gather information about targets and networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Reconnaissance functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reconnaissance;
