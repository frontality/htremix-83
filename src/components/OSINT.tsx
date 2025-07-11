
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OSINT = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OSINT</CardTitle>
          <CardDescription>
            Open Source Intelligence gathering tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">OSINT functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OSINT;
