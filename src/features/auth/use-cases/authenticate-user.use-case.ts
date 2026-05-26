import { AuthRepository } from "../repositories/auth.repository";

interface AuthenticateUserResponse {
  id: string;
  email: string;
  name: string;
  role: "PATIENT" | "MEDIC" | "SECRETARY";
}

export class AuthenticateUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, passwordPlain: string): Promise<AuthenticateUserResponse | null> {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      return null;
    }

    // Verificação em Plain Text (conforme solicitado explicitamente)
    if (user.password !== passwordPlain) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
