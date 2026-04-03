import { Link } from "react-router-dom";
import { Sparkles, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-sm md:text-base text-foreground">SnapCut AI</span>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-3 md:mb-4">
              Remove image backgrounds instantly with AI. Built for creators, designers, and businesses.
            </p>
            <div className="flex gap-2 md:gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Product", links: ["Background Remover", "Pricing", "API Access", "Changelog"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Legal", links: [
              { name: "Privacy Policy", path: "/privacy-policy" },
              { name: "Refund and Cancellation", path: "/refund-cancellation" },
              { name: "Contact Us", path: "/contact-us" },
              { name: "Shipping & Delivery", path: "/shipping-delivery" },
              { name: "Terms and Conditions", path: "/terms-and-conditions" },
            ] },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-foreground mb-3 md:mb-4 text-xs md:text-sm">{section.title}</h4>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.path ? (
                      <Link to={link.path} className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </Link>
                    ) : (
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {link}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">© 2026 SnapCut AI. All rights reserved.</p>
          <p className="text-xs text-muted-foreground text-center md:text-right">Made with AI • No images stored permanently</p>
        </div>
      </div>
    </footer>
  );
}
