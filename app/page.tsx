import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BarChart3, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8 py-4 sm:py-8 my-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Calculus</h1>
        <p className="text-muted-foreground text-lg">Mental math training.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/run" className="w-full">
          <Button size="lg" className="w-full h-20 text-xl font-semibold gap-2 shadow-sm rounded-2xl">
            <Calculator className="w-6 h-6" />
            Start Run
          </Button>
        </Link>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/stats">
            <Button variant="outline" className="w-full h-16 gap-2 rounded-2xl">
              <BarChart3 className="w-5 h-5" />
              Stats
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="w-full h-16 gap-2 rounded-2xl">
              <Settings className="w-5 h-5" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
