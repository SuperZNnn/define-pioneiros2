import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import MemberCard from './MemberCard';
import type { User, DisplayInfo } from '../types/users';

const makeUser = (overrides?: Partial<User>): User => ({
    id: 1,
    fullname: 'João da Silva',
    funcao: 'Desbravador',
    nascimento: new Date('2000-08-12'),
    genero: 'Masculino',
    reg: 0,
    status: 1,
    pix: '',
    ...overrides,
});

describe('MemberCard', () => {
    it('renderiza o nome do usuário', () => {
        render(<MemberCard user={makeUser()} />);
        expect(
            screen.getByRole('heading', { name: /joão da silva/i }),
        ).toBeInTheDocument();
    });

    it('calcula e exibe a idade corretamente', () => {
        const nascimento = new Date();
        nascimento.setFullYear(nascimento.getFullYear() - 25);
        const user = makeUser({ nascimento: nascimento });

        render(<MemberCard user={user} />);

        const ageText = screen.getByText(/Anos/);
        expect(ageText).toBeInTheDocument();
        expect(ageText.textContent).toMatch(/\d+\sAnos/);
    });

    it('usa a foto padrão quando não há photo', () => {
        render(<MemberCard user={makeUser({ photo: undefined })} />);
        const img = screen.getByRole('img', { name: /foto do perfil/i });
        expect(img).toHaveAttribute(
            'src',
            expect.stringContaining('default_user.jpg'),
        );
    });

    it('usa a foto base64 quando disponível', () => {
        const fakeBase64 = 'dGVzdA=='; //(teste)
        render(<MemberCard user={makeUser({ photo: fakeBase64 })} />);
        const img = screen.getByRole('img', { name: /foto do perfil/i });
        expect(img).toHaveAttribute(
            'src',
            `data:image/jpeg;base64,${fakeBase64}`,
        );
    });

    it('aplica fundo dourado para tipo 1 (Diretor)', () => {
        render(<MemberCard user={makeUser({ funcao: 'Diretor' })} />);

        const modalBg = document.querySelector(
            '.modal-background',
        ) as HTMLElement;
        expect(modalBg.style.backgroundColor).toContain('255, 215, 0, 0.2');
    });

    it('renderiza .description apenas quando userDisplay é passado', () => {
        const display: DisplayInfo = {} as DisplayInfo;

        const { rerender } = render(<MemberCard user={makeUser()} />);
        expect(screen.queryByText(/intents/i)).not.toBeInTheDocument();

        rerender(<MemberCard user={makeUser()} userDisplay={display} />);
        expect(screen.getByText(/intents/i)).toBeInTheDocument();
    });
});
