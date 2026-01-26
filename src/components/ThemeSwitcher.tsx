"use client";

import { useIsClient } from "@/hooks";
import { cn } from "@/lib/utils";
import { Moon, Sun, MonitorCog } from "lucide-react";
import { useTheme } from "next-themes";
import { ButtonGroup } from "./ui/button-group";
import { Button } from "./ui/button";

export function ThemeSwitcher() {
  const isClient = useIsClient();
  const { theme: currentTheme, themes, setTheme } = useTheme();

  return (
    <ButtonGroup>
      {themes.map((theme) => (
        <Button
          key={theme}
          className={cn({ "bg-muted-foreground": currentTheme === theme && isClient })}
          onClick={() => setTheme(theme)}
        >
          {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <MonitorCog />}
          <span className="sr-only">{theme}</span>
        </Button>
      ))}
    </ButtonGroup>
  );
}
