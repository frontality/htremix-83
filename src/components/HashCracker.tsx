
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HashCracker = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hash Cracker</CardTitle>
          <CardDescription>
            Crack various types of hashes and passwords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hash cracking functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HashCracker;
