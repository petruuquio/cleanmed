"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Hospital,
  Users,
  CalendarDays,
  Stethoscope,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Consultas", href: "/dashboard/consultas", icon: CalendarDays },
  { name: "Pacientes", href: "/dashboard/pacientes", icon: Users },
  { name: "Médicos", href: "/dashboard/medicos", icon: Stethoscope },
  { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { name: "Pagamentos", href: "/dashboard/pagamentos", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-on-primary-fixed dark:bg-on-primary-fixed text-primary-fixed dark:text-primary-fixed-dim font-body text-label-md tracking-wide h-screen w-64 flex flex-col sticky top-0 left-0 border-r border-outline-variant/10 shadow-xl transition-all duration-300 ease-in-out z-50">
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
          <Hospital size={32} className="text-surface-container-lowest" />
          <div>
            <h1 className="font-headline font-bold text-2xl text-surface-container-lowest">
              CleanMed
            </h1>
            <p className="text-xs text-primary-fixed-dim/80">
              Clinic Management
            </p>
          </div>
        </div>

        {/* Tabs */}
        <ul className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-3 px-4 gap-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/20 text-surface-bright font-bold"
                      : "text-surface-variant/70 hover:text-surface-bright hover:bg-primary/10"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer Tabs */}
        <ul className="space-y-2 pt-4 border-t border-surface-variant/20">
          <li>
            <Link
              href="#"
              className="text-surface-variant/70 hover:text-surface-bright flex items-center py-2 px-4 gap-3 transition-colors"
            >
              <Settings size={20} />
              Configurações
            </Link>
          </li>
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-surface-variant/70 hover:text-surface-bright flex items-center py-2 px-4 gap-3 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
