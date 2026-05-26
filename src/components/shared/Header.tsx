"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Menu, Users, CalendarDays, Stethoscope, CreditCard, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useUIStore } from "@/store/uiStore";

export function Header() {
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Usuário";
  const userInitial = userName.charAt(0).toUpperCase();

  const getPageInfo = () => {
    if (pathname?.includes('/pacientes')) return { title: 'Pacientes', icon: Users };
    if (pathname?.includes('/consultas')) return { title: 'Consultas', icon: CalendarDays };
    if (pathname?.includes('/medicos')) return { title: 'Médicos', icon: Stethoscope };
    if (pathname?.includes('/pagamentos')) return { title: 'Pagamentos', icon: CreditCard };
    if (pathname?.includes('/agenda')) return { title: 'Agenda', icon: CalendarDays };
    return { title: 'CleanMed', icon: LayoutDashboard };
  };

  const { title, icon: Icon } = getPageInfo();

  return (
    <header className="bg-surface/80 backdrop-blur-md text-primary dark:text-primary-fixed-dim font-body text-body-md w-full h-16 sticky top-0 z-40 border-b border-outline-variant/20">
      <div className="flex items-center justify-between px-4 sm:px-8 h-full gap-4">
        {/* Mobile Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 rounded-full"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex w-8 h-8 rounded-lg bg-primary/10 text-primary items-center justify-center">
              <Icon size={18} />
            </div>
            <h1 className="font-headline font-bold text-lg text-on-surface">{title}</h1>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto sm:gap-4">
          <button className="hidden sm:block p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 rounded-full">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-outline-variant/20">
              {userInitial}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-on-surface">{userName}</p>
              <p className="text-xs text-on-surface-variant">Painel</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
