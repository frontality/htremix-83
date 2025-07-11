
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AttackHistory = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attack History</CardTitle>
          <CardDescription>
            View logs and history of previous attacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Attack history functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttackHistory;
