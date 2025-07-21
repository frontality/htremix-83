
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SystemMonitor = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Monitor</CardTitle>
          <CardDescription>
            Monitor system resources and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">System monitoring functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitor;
