
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Play, Square, Trash2 } from "lucide-react";

const WebhookSpammer = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [stats, setStats] = useState({ sent: 0, errors: 0 });
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const validateWebhook = (url: string) => {
    const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    return webhookRegex.test(url);
  };

  const addResult = (result: string) => {
    setResults(prev => [result, ...prev.slice(0, 99)]);
  };

  const sendWebhook = async (session: number, controller: AbortController) => {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({ content: message }),
        signal: controller.signal
      });

      if (response.ok) {
        setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
        addResult(`✅ Task ${session + 1}: Message sent successfully`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
        addResult(`❌ Task ${session + 1}: ${errorData.message || 'Unknown error'}`);
        
        if (errorData.retry_after) {
          addResult(`⏱️ Rate limited - Retry after: ${errorData.retry_after}s`);
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
        addResult(`❌ Task ${session + 1}: ${error.message}`);
      }
    }
  };

  const startSpamming = async () => {
    if (!validateWebhook(webhookUrl)) {
      toast({
        title: "Invalid Webhook",
        description: "Please enter a valid Discord webhook URL",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setResults([]);
    setStats({ sent: 0, errors: 0 });
    
    const controller = new AbortController();
    abortControllerRef.current = controller;

    addResult(`🚀 Starting webhook spam with ${tasks} tasks...`);

    const promises = Array.from({ length: tasks }, (_, i) => 
      sendWebhook(i, controller)
    );

    try {
      await Promise.all(promises);
      addResult(`✅ Completed all ${tasks} tasks`);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        addResult(`❌ Operation failed: ${error.message}`);
      }
    } finally {
      setIsRunning(false);
      abortControllerRef.current = null;
    }
  };

  const stopSpamming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      addResult(`🛑 Operation stopped by user`);
    }
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
    setStats({ sent: 0, errors: 0 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Discord Webhook Spammer
          </CardTitle>
          <CardDescription>
            Send multiple messages to Discord webhooks for testing purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              type="url"
              placeholder="https://discord.com/api/webhooks/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isRunning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message Content</Label>
            <Textarea
              id="message"
              placeholder="Enter the message to send..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isRunning}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tasks">Number of Tasks</Label>
            <Input
              id="tasks"
              type="number"
              min="1"
              max="100"
              value={tasks}
              onChange={(e) => setTasks(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              disabled={isRunning}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={startSpamming}
              disabled={isRunning || !webhookUrl || !message.trim()}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Start Spam'}
            </Button>
            
            {isRunning && (
              <Button
                variant="destructive"
                onClick={stopSpamming}
                className="flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={clearResults}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Results
              <div className="text-sm font-normal">
                <span className="text-green-600">Sent: {stats.sent}</span>
                <span className="mx-2">|</span>
                <span className="text-red-600">Errors: {stats.errors}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full rounded border p-4">
              <div className="space-y-1">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WebhookSpammer;
