"use client";

import { motion } from "framer-motion";
import { Sparkles, FileCode, Sun, Moon, Star } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const fetchStarts = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/repos/KompallyAkhil/NexScreen",
        );
        setStars(response.data.stargazers_count);
        console.log(response.data.stargazers_count);
      } catch (error) {
        console.error("Error fetching stars:", error);
      }
    };
    fetchStarts();
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(var(--surface-rgb, 26, 29, 39), 0.85)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        backgroundColor: "color-mix(in srgb, var(--surface) 85%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Sparkles size={15} className="text-white" />
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            NexScreen
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Source link */}
          <Link
            href="https://github.com/KompallyAkhil/NexScreen"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--foreground)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <FileCode size={14} />
            Source
          </Link>

          <Link
            href="https://github.com/KompallyAkhil/NexScreen"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--foreground)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            <Star size={14} />
            {stars}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--foreground)";
              e.currentTarget.style.borderColor = "var(--muted-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </motion.div>
          </button>

          {/* Auth buttons */}
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal" appearance={{ baseTheme: dark }}>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--muted-light)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal" appearance={{ baseTheme: dark }}>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 active:scale-95"
                  style={{ background: "var(--accent)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Get Started
                </button>
              </SignUpButton>
            </>
          ) : (
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: { avatarBox: "w-9 h-9" },
              }}
            />
          )}
        </div>
      </div>
    </motion.nav>
  );
}
