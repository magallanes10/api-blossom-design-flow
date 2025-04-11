
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Github } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                <div className="text-white font-bold text-xl">AB</div>
              </div>
              <span className="ml-2 text-xl font-bold text-foreground">API Blossom</span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <a href="#intro" className="px-3 py-2 text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#endpoints" className="px-3 py-2 text-foreground hover:text-primary transition-colors">
              Endpoints
            </a>
            <a href="#documentation" className="px-3 py-2 text-foreground hover:text-primary transition-colors">
              Documentation
            </a>
            <a href="#playground" className="px-3 py-2 text-foreground hover:text-primary transition-colors">
              Playground
            </a>
            <ThemeToggle />
            <Button variant="outline" className="ml-4">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-b animate-fade-in">
          <a
            href="#intro"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="#endpoints"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
            onClick={() => setIsMenuOpen(false)}
          >
            Endpoints
          </a>
          <a
            href="#documentation"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
            onClick={() => setIsMenuOpen(false)}
          >
            Documentation
          </a>
          <a
            href="#playground"
            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted"
            onClick={() => setIsMenuOpen(false)}
          >
            Playground
          </a>
          <Button variant="outline" className="w-full mt-4">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
