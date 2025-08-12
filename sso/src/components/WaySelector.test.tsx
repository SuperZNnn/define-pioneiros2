import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WaySelector from './WaySelector';
import type { User } from '../types/users';
import { useToasts } from '../hooks/useToasts';
import { UsersEvents } from '../services/api';

vi.mock('../hooks/useToasts');
vi.mock('../services/api');

const mockUser: User = {
    id: 1,
    fullname: 'John Doe',
    email: 'john@example.com',
    email_responsavel: 'parent@example.com',
    telefone: '11999999999',
    nascimento: new Date('1990-01-01'),
    funcao: 'developer',
    genero: 'male',
    reg: 123,
    status: 1,
    pix: 'john@example.com',
};
const mockAxiosResponse = {
  data: {  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
};

describe('WaySelector Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.mocked(useToasts).mockReturnValue({
            toasts: [], // Adicione esta linha
            addToast: vi.fn(),
            removeToast: vi.fn(),
        });
    });

    it('renders correctly with all options', () => {
        render(<WaySelector user={mockUser} />);

        expect(screen.getByText('Whatsapp')).toBeInTheDocument();
        expect(screen.getByText('seu E-mail')).toBeInTheDocument();
        expect(
            screen.getByText('E-mail do seu responsável'),
        ).toBeInTheDocument();
    });

    it('renders only whatsapp option when no emails are provided', () => {
        const userWithoutEmails = {
            ...mockUser,
            email: undefined,
            email_responsavel: undefined,
        };
        render(<WaySelector user={userWithoutEmails} />);

        expect(screen.getByText('Whatsapp')).toBeInTheDocument();
        expect(screen.queryByText('seu E-mail')).not.toBeInTheDocument();
        expect(
            screen.queryByText('E-mail do seu responsável'),
        ).not.toBeInTheDocument();
    });

    it('opens whatsapp link with correct message for registration', () => {
        render(<WaySelector user={mockUser} />);

        const whatsappLink = screen.getByText('Whatsapp').closest('a');
        expect(whatsappLink).toHaveAttribute('href');
        expect(whatsappLink?.getAttribute('href')).toContain(
            encodeURIComponent(
                'Olá, gostaria de continuar o registro de *John Doe*',
            ),
        );
        expect(whatsappLink).toHaveAttribute('target', 'blank');
    });

    it('opens whatsapp link with correct message for password recovery', () => {
        render(<WaySelector user={mockUser} to='recover' />);

        const whatsappLink = screen.getByText('Whatsapp').closest('a');
        expect(whatsappLink?.getAttribute('href')).toContain(
            encodeURIComponent(
                'Olá, gostaria de recuperar a senha de *John Doe*',
            ),
        );
    });

    it('handles email button click for registration', async () => {
        vi.mocked(UsersEvents.sendRegisterEmail).mockResolvedValue(undefined);

        render(<WaySelector user={mockUser} />);
        const emailButton = screen.getByRole('button', { name: /seu E-mail/i });

        fireEvent.click(emailButton);

        expect(emailButton).toBeDisabled();
        expect(UsersEvents.sendRegisterEmail).toHaveBeenCalledWith(
            mockUser.id,
            false,
        );

        await waitFor(() => {
            expect(emailButton).not.toBeDisabled();
            expect(useToasts().addToast).toHaveBeenCalledWith({
                message:
                    'E-mail enviado! Verifique sua caixa de entrada e spam',
                time: 3,
                type: 'success',
            });
        });
    });

    it('handles email button click for password recovery', async () => {
        vi.mocked(UsersEvents.sendResetPasswordEmail).mockResolvedValue(
            undefined,
        );

        render(<WaySelector user={mockUser} to='recover' />);
        const emailButton = screen.getByRole('button', { name: /seu E-mail/i });

        fireEvent.click(emailButton);

        expect(emailButton).toBeDisabled();
        expect(UsersEvents.sendResetPasswordEmail).toHaveBeenCalledWith(
            mockUser.id,
            false,
        );

        await waitFor(() => {
            expect(emailButton).not.toBeDisabled();
        });
    });

    it('shows warning toast when email was already sent (registration)', async () => {
        const error = { status: 400 };
        vi.mocked(UsersEvents.sendRegisterEmail).mockRejectedValue(error);

        render(<WaySelector user={mockUser} />);
        fireEvent.click(screen.getByText('seu E-mail'));

        await waitFor(() => {
            expect(useToasts().addToast).toHaveBeenCalledWith({
                message:
                    'E-mail já enviado! Verifique sua caixa de entrada e spam',
                time: 3,
                type: 'warn',
            });
        });
    });

    it('shows warning toast when email was already sent (recovery)', async () => {
        const error = { status: 400 };
        vi.mocked(UsersEvents.sendResetPasswordEmail).mockRejectedValue(error);

        render(<WaySelector user={mockUser} to='recover' />);
        fireEvent.click(screen.getByText('seu E-mail'));

        await waitFor(() => {
            expect(useToasts().addToast).toHaveBeenCalledWith({
                message:
                    'E-mail já enviado! Verifique sua caixa de entrada e spam',
                time: 3,
                type: 'warn',
            });
        });
    });

    it('shows error toast when email sending fails', async () => {
        vi.mocked(UsersEvents.sendRegisterEmail).mockRejectedValue(
            new Error('API error'),
        );

        render(<WaySelector user={mockUser} />);
        fireEvent.click(screen.getByText('seu E-mail'));

        await waitFor(() => {
            expect(useToasts().addToast).toHaveBeenCalledWith({
                message: 'Erro ao enviar e-mail! Por favor tente novamente',
                time: 3,
                type: 'error',
            });
        });
    });

    it('disables button during API call and re-enables after', async () => {
        let resolvePromise: () => void;
        const promise = new Promise<void>((resolve) => {
            resolvePromise = resolve;
        });

        vi.mocked(UsersEvents.sendRegisterEmail).mockImplementation(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(mockAxiosResponse);
                        resolvePromise();
                    }, 100);
                }),
        );

        render(<WaySelector user={mockUser} />);
        const emailButton = screen.getByRole('button', { name: /seu E-mail/i });

        fireEvent.click(emailButton);
        expect(emailButton).toBeDisabled();

        await promise;
        await waitFor(() => {
            expect(emailButton).not.toBeDisabled();
        });
    });
});
