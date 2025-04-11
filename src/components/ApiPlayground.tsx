
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlayCircle, Bug, Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ApiPlayground = () => {
  const [method, setMethod] = useState<string>("GET");
  const [endpoint, setEndpoint] = useState<string>("/api/users");
  const [requestBody, setRequestBody] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse("");
    setStatusCode(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (method !== "GET" && method !== "DELETE" && requestBody) {
        try {
          options.body = requestBody;
        } catch (e) {
          setError("Invalid JSON in request body");
          setLoading(false);
          return;
        }
      }

      const apiUrl = `http://localhost:3001${endpoint}`;
      
      // Simulate API call with a mock response for demo purposes
      const mockResponses: Record<string, any> = {
        "/api/users": [
          { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", role: "user" },
        ],
        "/api/users/1": { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
        "/api/products": [
          { id: 1, name: "Laptop", price: 999.99, category: "Electronics" },
          { id: 2, name: "Smartphone", price: 699.99, category: "Electronics" },
        ],
      };

      // Fake API response for demo
      setTimeout(() => {
        let mockResponse;
        let status = 200;

        if (mockResponses[endpoint]) {
          mockResponse = mockResponses[endpoint];
        } else if (endpoint.startsWith("/api/users/") && method === "GET") {
          const id = endpoint.split("/").pop();
          mockResponse = { id: Number(id), name: "User " + id, email: `user${id}@example.com`, role: "user" };
        } else if (method === "POST" && endpoint === "/api/users") {
          try {
            const body = JSON.parse(requestBody);
            mockResponse = { id: 3, ...body };
            status = 201;
          } catch (e) {
            mockResponse = { error: "Invalid request body" };
            status = 400;
          }
        } else if (method === "PUT" && endpoint.startsWith("/api/users/")) {
          try {
            const id = endpoint.split("/").pop();
            const body = JSON.parse(requestBody);
            mockResponse = { id: Number(id), ...body };
          } catch (e) {
            mockResponse = { error: "Invalid request body" };
            status = 400;
          }
        } else if (method === "DELETE" && endpoint.startsWith("/api/users/")) {
          const id = endpoint.split("/").pop();
          mockResponse = { id: Number(id), name: "Deleted User", message: "User deleted successfully" };
        } else {
          mockResponse = { error: "Not found" };
          status = 404;
        }

        setResponse(JSON.stringify(mockResponse, null, 2));
        setStatusCode(status);
        setLoading(false);

        if (status >= 400) {
          toast({
            title: "Request Failed",
            description: `Status ${status}: ${mockResponse.error || "Unknown error"}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Request Successful",
            description: `Status ${status}: The API request completed successfully.`,
          });
        }
      }, 1000);
    } catch (err) {
      setError("Error connecting to API server");
      setLoading(false);
      toast({
        title: "Connection Error",
        description: "Could not connect to the API server.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return "bg-gray-200 dark:bg-gray-700";
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (status >= 400) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  };

  return (
    <div id="playground" className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            API Playground
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground">
            Test API endpoints and see responses in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-scale-in">
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
              <CardDescription>Configure your API request</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-1/3">
                    <label htmlFor="method" className="block text-sm font-medium text-muted-foreground mb-1">
                      Method
                    </label>
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger id="method" className={`w-full api-method-${method.toLowerCase()}`}>
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET" className="api-method-get">GET</SelectItem>
                        <SelectItem value="POST" className="api-method-post">POST</SelectItem>
                        <SelectItem value="PUT" className="api-method-put">PUT</SelectItem>
                        <SelectItem value="DELETE" className="api-method-delete">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-2/3">
                    <label htmlFor="endpoint" className="block text-sm font-medium text-muted-foreground mb-1">
                      Endpoint
                    </label>
                    <Select value={endpoint} onValueChange={setEndpoint}>
                      <SelectTrigger id="endpoint">
                        <SelectValue placeholder="Endpoint" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/api/users">/api/users</SelectItem>
                        <SelectItem value="/api/users/1">/api/users/1</SelectItem>
                        <SelectItem value="/api/users/2">/api/users/2</SelectItem>
                        <SelectItem value="/api/products">/api/products</SelectItem>
                        <SelectItem value="/api/products/1">/api/products/1</SelectItem>
                        <SelectItem value="/api/auth/login">/api/auth/login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(method === "POST" || method === "PUT") && (
                  <div>
                    <label htmlFor="requestBody" className="block text-sm font-medium text-muted-foreground mb-1">
                      Request Body (JSON)
                    </label>
                    <Textarea
                      id="requestBody"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder={`{\n  "name": "New User",\n  "email": "user@example.com",\n  "role": "user"\n}`}
                      className="h-40 font-mono"
                    />
                  </div>
                )}

                <Button 
                  onClick={handleSendRequest} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Response</CardTitle>
                <CardDescription>API response will appear here</CardDescription>
              </div>
              {statusCode && (
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(statusCode)}`}>
                  Status: {statusCode}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="bg-destructive/10 border border-destructive rounded-md p-4 text-destructive flex items-start">
                  <Bug className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <div className="text-center">
                    <Loader className="h-8 w-8 mx-auto animate-spin text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Waiting for response...</p>
                  </div>
                </div>
              ) : response ? (
                <pre className="code-block h-64 overflow-auto">{response}</pre>
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                  <div className="text-center text-muted-foreground">
                    <p>Send a request to see the response</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiPlayground;
