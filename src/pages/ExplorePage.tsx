import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Video,
  Music,
  Image,
  Scissors,
  Wand2,
  Sparkles,
  QrCode,
  FileText,
  Star,
  MoreHorizontal,
  ArrowRight,
  Mic,
  Paperclip,
  ChevronDown,
  Send,
  Play,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import sample1 from "@/assets/sample-1.jpg";
import sample2 from "@/assets/sample-2.jpg";
import sample3 from "@/assets/sample-3.jpg";
import sample4 from "@/assets/sample-4.jpg";
import sample5 from "@/assets/sample-5.jpg";
import sample6 from "@/assets/sample-6.jpg";
import sample7 from "@/assets/sample-7.jpg";
import sample8 from "@/assets/sample-8.jpg";
import sample9 from "@/assets/sample-9.jpg";

const tools = [
  { icon: Video, label: "Text to Video", path: "/tools/text-to-video" },
  { icon: Music, label: "Text to Audio", path: "/tools/text-to-audio" },
  { icon: Image, label: "Text to Image", path: "/tools/text-to-image" },
  {
    icon: Scissors,
    label: "Background Remover",
    path: "/upload",
    primary: true,
  },
  { icon: Wand2, label: "Photo Enhancement", path: "/tools/photo-enhancement" },
  { icon: Sparkles, label: "GIF Creator", path: "/tools/gif-creator" },
  { icon: QrCode, label: "Create QR Code", path: "/tools/qr-code" },
  { icon: FileText, label: "Text to Template", path: "/tools/text-template" },
  { icon: Star, label: "Magic AI", path: "/tools/magic-ai" },
];

const images = [
  sample1,
  sample2,
  sample3,
  sample4,
  sample5,
  sample6,
  sample7,
  sample8,
  sample9,
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-32 px-6 max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl font-display font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Explore
        </motion.h1>

        {/* Tool Chips */}
        <motion.div
          className="flex flex-wrap gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {tools.map((tool) => (
            <Link
              key={tool.label}
              to={tool.path}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all ${
                tool.primary
                  ? "border-primary/50 bg-primary/10 text-foreground hover:bg-primary/20"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <tool.icon className="w-4 h-4" />
              {tool.label}
            </Link>
          ))}
        </motion.div>

        {/* Trending Grid */}
        <h2 className="text-xl font-display font-semibold text-foreground mb-5">
          Trending Templates
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="relative group rounded-xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={src}
                alt={`Template ${i + 1}`}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {i === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-background/50 backdrop-blur rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-foreground ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 bg-background/60 backdrop-blur rounded-full flex items-center justify-center text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-primary/80 backdrop-blur rounded-full flex items-center justify-center text-primary-foreground">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Prompt Bar */}
        <motion.div
          className="fixed bottom-6 left-0 right-0 px-6 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3 card-glow">
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0">
              <Mic className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shrink-0">
              <Paperclip className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-foreground shrink-0">
              <Music className="w-3.5 h-3.5 text-primary" />
              Text to Audio
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="h-6 w-px bg-border" />
            <input
              type="text"
              placeholder="Type Prompts..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
            />
            <button className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground shrink-0 hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
