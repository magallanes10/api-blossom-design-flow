
import ApiMonitoring from "@/components/ApiMonitoring";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Monitoring = () => {
  const [startTime, setStartTime] = useState<number>(0);
  const [pingTime, setPingTime] = useState<number>(0);

  // Ping server to measure response time
  const pingServer = async () => {
    const start = performance.now();
    try {
      await fetch('/api/monitoring/ping');
      const end = performance.now();
      setPingTime(Math.round(end - start));
    } catch (error) {
      console.error('Error pinging server:', error);
    }
  };

  // Ping the server periodically
  useEffect(() => {
    setStartTime(performance.now());
    
    pingServer();
    const interval = setInterval(pingServer, 30000); // Ping every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Get the request count from the server
  const { data: requestData } = useQuery({
    queryKey: ['requestCount'],
    queryFn: async () => {
      const response = await fetch('/api/monitoring/requests');
      if (!response.ok) {
        throw new Error('Failed to fetch request count');
      }
      return response.json();
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <section className="py-4 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-card rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-background">
                    <h3 className="text-lg font-medium text-muted-foreground mb-1">Current Ping</h3>
                    <p className="text-2xl font-bold">{pingTime} ms</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-background">
                    <h3 className="text-lg font-medium text-muted-foreground mb-1">Total Requests</h3>
                    <p className="text-2xl font-bold">{requestData?.count || 0}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-background">
                    <h3 className="text-lg font-medium text-muted-foreground mb-1">Uptime</h3>
                    <p className="text-2xl font-bold">
                      {startTime ? Math.floor((performance.now() - startTime) / 1000) : 0}s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-8 bg-muted">
            <ApiMonitoring />
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Monitoring;
