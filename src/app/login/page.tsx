import { LoginForm } from "@/features/auth/components/LoginForm";
import { Stethoscope } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-body p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary-fixed/30 to-transparent"></div>
        <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-3xl mix-blend-multiply opacity-70"></div>
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-tertiary-container/15 rounded-full blur-3xl mix-blend-multiply opacity-60"></div>
      </div>
      
      <main className="relative z-10 w-full max-w-[440px]">
        <div className="bg-surface-container-lowest rounded-[24px] p-8 sm:p-12 shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10 flex flex-col gap-10">
          <header className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-[16px] flex items-center justify-center text-primary mb-2 ring-1 ring-primary/20">
              <Stethoscope size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="font-headline font-bold text-3xl text-primary tracking-tight">
                CleanMed
              </h1>
              <p className="text-on-surface-variant mt-1.5 text-label-md">
                Bem-vindo de volta ao portal
              </p>
            </div>
          </header>

          <LoginForm />

          <footer className="text-center pt-6 border-t border-outline-variant/20">
            <p className="text-sm text-on-surface-variant font-medium">
              Novo membro?{" "}
              <a
                className="font-bold text-tertiary hover:text-on-tertiary-container transition-colors ml-1"
                href="#"
              >
                Contate o Administrador
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
