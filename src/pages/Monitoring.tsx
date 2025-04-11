
import ApiMonitoring from "@/components/ApiMonitoring";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";

const Monitoring = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
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
