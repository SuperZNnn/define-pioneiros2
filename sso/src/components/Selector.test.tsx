// Selector.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import Selector from './Selector';
import type { User } from '../types/users';

const makeUser = (overrides?: Partial<User>): User => ({
    id: 1,
    fullname: 'João da Silva',
    nascimento: new Date('2000-08-10'),
    funcao: 'desbravador',
    genero: 'm',
    reg: 0,
    status: 1,
    pix: '10',
    ...overrides,
});

describe('Selector component', () => {
    const fixedDate = new Date('2025-08-12');
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(fixedDate);
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it("renderiza a opção inicial 'Quem é você?'", () => {
        render(<Selector users={[]} setSelectedUser={() => {}} />);

        expect(screen.getByText('Quem é você?')).toBeInTheDocument();
    });

    it('renderiza apenas usuários com reg === 0', () => {
        const users = [
            makeUser({ id: 1, fullname: 'Ativo' }),
            makeUser({ id: 2, fullname: 'Inativo', reg: 1 }),
        ];

        render(<Selector users={users} setSelectedUser={() => {}} />);

        expect(screen.getByText(/ATIVO -/)).toBeInTheDocument();
        expect(screen.queryByText(/INATIVO -/)).not.toBeInTheDocument();
    });

    it('calcula corretamente a idade', () => {
        const user = makeUser({ id: 3, fullname: 'Maria' });

        render(<Selector users={[user]} setSelectedUser={() => {}} />);

        expect(
            screen.getByText('MARIA - 25 anos - desbravador'),
        ).toBeInTheDocument();
    });

    it('marca como selecionado quando selected é passado', () => {
        const user = makeUser({ id: 5, fullname: 'Carlos' });

        render(
            <Selector users={[user]} selected={5} setSelectedUser={() => {}} />,
        );

        const option = screen.getByRole('option', {
            name: /CARLOS -/,
        }) as HTMLOptionElement;
        expect(option.selected).toBe(true);
    });

    it('chama setSelectedUser com o valor correto ao mudar a seleção', () => {
        const user = makeUser({ id: 7, fullname: 'Ana' });
        const setSelectedUser = vi.fn();

        render(<Selector users={[user]} setSelectedUser={setSelectedUser} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '7' } });

        expect(setSelectedUser).toHaveBeenCalledWith(7);
    });
});
