"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, EyeOff, Eye, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormValues } from "../schemas";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setLoginError("Credenciais inválidas. Verifique seu e-mail e senha.");
        return;
      }

      // Successful login will be handled by middleware on refresh or we can router.push("/")
      // and middleware will redirect to the correct dashboard or portal.
      router.push("/");
      router.refresh();
    } catch (error) {
      setLoginError("Ocorreu um erro inesperado. Tente novamente.");
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      {loginError && (
        <div className="bg-error-container/20 text-error text-sm font-medium p-3 rounded-lg border border-error/20">
          {loginError}
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface ml-1" htmlFor="email">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="doctor@clinic.com"
          icon={<Mail size={20} />}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-error ml-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-baseline ml-1">
          <label className="text-sm font-bold text-on-surface" htmlFor="password">
            Senha
          </label>
          <a
            className="text-sm font-bold text-primary hover:text-on-primary-fixed-variant transition-colors"
            href="#"
          >
            Esqueceu a senha?
          </a>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          icon={<Lock size={20} />}
          suffix={
            <button
              type="button"
              className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer p-1"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          }
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-error ml-1">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3 ml-1 mt-1">
        <div className="relative flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="peer h-5 w-5 appearance-none rounded border border-outline-variant bg-surface checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-surface-container-lowest transition-all cursor-pointer"
            {...register("remember")}
          />
          <Check
            size={14}
            strokeWidth={3}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-on-primary pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
          />
        </div>
        <label
          className="text-sm font-medium text-on-surface-variant cursor-pointer select-none"
          htmlFor="remember"
        >
          Manter conectado
        </label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 group"
      >
        <span className="text-[15px] tracking-wide">
          {isSubmitting ? "Entrando..." : "Entrar no Painel"}
        </span>
        {!isSubmitting && (
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        )}
      </Button>
    </form>
  );
}
