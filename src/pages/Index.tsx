
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ApiEndpoints from "@/components/ApiEndpoints";
import ApiPlayground from "@/components/ApiPlayground";
import Documentation from "@/components/Documentation";
import Footer from "@/components/Footer";

const Index = () => {
  // Start the mock Express server when the component mounts
  useEffect(() => {
    const startServer = async () => {
      try {
        console.log("The API server would normally start here in a real app");
        console.log("For this demo, we're using mock API responses");
      } catch (error) {
        console.error("Failed to start API server:", error);
      }
    };

    startServer();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero />
          {/* Added spacing between sections */}
          <section className="py-12">
            <ApiEndpoints />
          </section>
          <section className="py-12">
            <Documentation />
          </section>
          <section className="py-12">
            <ApiPlayground />
          </section>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
