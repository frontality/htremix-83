
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";
import { Loader2, Send, Square } from "lucide-react";
import { toast } from "sonner";

interface WebhookSpammerProps {
  className?: string;
}

const WebhookSpammer = ({ className }: WebhookSpammerProps) => {
  const { currentTheme } = useTheme();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const validateWebhookUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'discord.com' || urlObj.hostname === 'discordapp.com';
    } catch {
      return false;
    }
  };

  const sendWebhook = async (url: string, content: string, taskId: number, signal: AbortSignal): Promise<void> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        body: JSON.stringify({ content }),
        signal
      });

      if (response.ok) {
        const successMsg = `Task ${taskId + 1}: Webhook sent successfully`;
        setResults(prev => [...prev, successMsg]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = `Task ${taskId + 1}: Error ${response.status} - ${errorData.message || 'Unknown error'}`;
        if (errorData.retry_after) {
          setResults(prev => [...prev, `${errorMsg} (Retry after: ${errorData.retry_after}s)`]);
        } else {
          setResults(prev => [...prev, errorMsg]);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setResults(prev => [...prev, `Task ${taskId + 1}: Cancelled`]);
      } else {
        setResults(prev => [...prev, `Task ${taskId + 1}: Network error - ${error.message}`]);
      }
    }
  };

  const startSpamming = async () => {
    if (!validateWebhookUrl(webhookUrl)) {
      toast.error("Invalid Discord webhook URL");
      return;
    }

    if (!message.trim()) {
      toast.error("Message content cannot be empty");
      return;
    }

    if (tasks < 1 || tasks > 100) {
      toast.error("Tasks must be between 1 and 100");
      return;
    }

    setIsRunning(true);
    setResults([]);
    
    const controller = new AbortController();
    setAbortController(controller);

    const startTime = Date.now();
    toast.info(`Starting webhook spam with ${tasks} tasks...`);

    try {
      const promises = Array.from({ length: tasks }, (_, i) => 
        sendWebhook(webhookUrl, message, i, controller.signal)
      );

      await Promise.all(promises);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      toast.success(`Completed in ${duration}s`);
    } catch (error) {
      toast.error("Operation was cancelled or failed");
    } finally {
      setIsRunning(false);
      setAbortController(null);
    }
  };

  const stopSpamming = () => {
    if (abortController) {
      abortController.abort();
      toast.info("Stopping webhook spam...");
    }
  };

  return (
    <Card className={`${className} ${currentTheme.cardBg} ${currentTheme.border}`}>
      <CardHeader>
        <CardTitle className={currentTheme.text}>Discord Webhook Spammer</CardTitle>
        <CardDescription className={currentTheme.muted}>
          Send multiple messages to a Discord webhook. Use responsibly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url" className={currentTheme.text}>Webhook URL</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={isRunning}
            className={currentTheme.input}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className={currentTheme.text}>Message Content</Label>
          <Textarea
            id="message"
            placeholder="Enter your message content..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isRunning}
            className={`${currentTheme.input} min-h-[80px]`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tasks" className={currentTheme.text}>Number of Tasks (1-100)</Label>
          <Input
            id="tasks"
            type="number"
            min="1"
            max="100"
            value={tasks}
            onChange={(e) => setTasks(parseInt(e.target.value) || 1)}
            disabled={isRunning}
            className={currentTheme.input}
          />
        </div>

        <div className="flex gap-2">
          {!isRunning ? (
            <Button 
              onClick={startSpamming}
              className={`${currentTheme.primary} hover:opacity-90`}
            >
              <Send className="w-4 h-4 mr-2" />
              Start Spamming
            </Button>
          ) : (
            <Button 
              onClick={stopSpamming}
              variant="destructive"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
          
          {isRunning && (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="mt-4">
            <Label className={currentTheme.text}>Results:</Label>
            <div className={`mt-2 p-3 rounded-md ${currentTheme.secondary} max-h-40 overflow-y-auto`}>
              {results.map((result, index) => (
                <div key={index} className={`text-sm ${currentTheme.muted} mb-1`}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookSpammer;
