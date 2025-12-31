import { AuthService } from './services/auth.service';

const seed = async () => {
    const authService = new AuthService();
    // Default credentials: admin / Admin1234
    await authService.seedAdminUser();
};

export default seed;

