import { useState } from 'react';
import { useGetContactRequests, useSendContactRequest } from '../hooks/useContactRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { MessageSquare, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function Mentorship() {
  const { data: messages = [], isLoading } = useGetContactRequests();
  const sendMessageMutation = useSendContactRequest();
  
  const [recipientPrincipal, setRecipientPrincipal] = useState('');
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async () => {
    if (!recipientPrincipal.trim() || !messageContent.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const principal = Principal.fromText(recipientPrincipal.trim());
      await sendMessageMutation.mutateAsync({
        to: principal,
        message: messageContent.trim()
      });
      
      toast.success('Message sent successfully!');
      setRecipientPrincipal('');
      setMessageContent('');
    } catch (error: any) {
      if (error.message?.includes('Invalid principal')) {
        toast.error('Invalid Principal ID format. Please check and try again.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
      console.error('Send message error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-white">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-white">Mentorship</h1>
          <p className="text-white">Connect with mentors and industry professionals</p>
        </div>

        {/* Send Message */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Send Message</CardTitle>
            <CardDescription className="text-white">Reach out to mentors or industry partners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-white">Recipient Principal ID</Label>
              <Input
                id="recipient"
                placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                value={recipientPrincipal}
                onChange={(e) => setRecipientPrincipal(e.target.value)}
                className="text-white"
              />
              <p className="text-xs text-muted-foreground">
                You can find Principal IDs from project listings or user profiles
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="text-white"
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={sendMessageMutation.isPending}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendMessageMutation.isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </CardContent>
        </Card>

        {/* Received Messages */}
        <div>
          <h2 className="text-2xl font-display font-bold mb-4 text-white">Received Messages</h2>
          {messages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-white">No messages yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Messages from mentors and industry partners will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm text-white">
                        From: {msg.from.toString().slice(0, 30)}...
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white whitespace-pre-wrap">{msg.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
