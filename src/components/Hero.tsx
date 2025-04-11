
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div id="intro" className="relative overflow-hidden bg-background pt-16 pb-8">
      {/* Decorative elements with improved positioning */}
      <div className="hidden sm:block sm:absolute sm:inset-0 sm:opacity-20 dark:sm:opacity-10 pointer-events-none z-0">
        <svg
          className="absolute left-0 top-0 h-full w-full"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>
          <path
            d="M650,400C650,555.23,555.23,650,400,650C244.77,650,150,555.23,150,400C150,244.77,244.77,150,400,150C555.23,150,650,244.77,650,400Z"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            className="float-animation"
          />
          <path
            d="M550,400C550,505.46,505.46,550,400,550C294.54,550,250,505.46,250,400C250,294.54,294.54,250,400,250C505.46,250,550,294.54,550,400Z"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            className="float-animation"
            style={{ animationDelay: "0.2s" }}
          />
          <path
            d="M450,400C450,455.23,455.23,450,400,450C344.77,450,350,455.23,350,400C350,344.77,344.77,350,400,350C455.23,350,450,344.77,450,400Z"
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            className="float-animation"
            style={{ animationDelay: "0.4s" }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl xl:text-7xl animate-fade-in">
            <span className="block">Beautiful REST API</span>
            <span className="block text-primary">Clean Design & Documentation</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Explore a modern, well-documented REST API with interactive examples.
            Built with Express.js and beautifully presented with animations and a responsive design.
          </p>
          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="rounded-md shadow">
              <Button size="lg" className="w-full sm:w-auto group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Zap className="mr-2 h-4 w-4" />
                View Docs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* API Stats with improved spacing */}
      <div className="bg-muted py-10 mt-12 animate-fade-in relative z-10" style={{ animationDelay: "0.3s" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">5</p>
              <p className="mt-2 text-lg font-medium text-foreground">API Endpoints</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">4</p>
              <p className="mt-2 text-lg font-medium text-foreground">HTTP Methods</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">100%</p>
              <p className="mt-2 text-lg font-medium text-foreground">Test Coverage</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">&#x221E;</p>
              <p className="mt-2 text-lg font-medium text-foreground">Possibilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
