// Toasts.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToasts } from '../hooks/useToasts';
import { ToastsContainer } from './Toasts';

const TestWrapper = () => {
    const { addToast } = useToasts();
    return (
        <div>
            <button
                onClick={() =>
                    addToast({
                        message: 'Mensagem de sucesso',
                        time: 1,
                        type: 'success',
                    })
                }
            >
                Add Success
            </button>
            <button
                onClick={() =>
                    addToast({
                        message: 'Mensagem de erro',
                        time: 1,
                        type: 'error',
                    })
                }
            >
                Add Error
            </button>
            <ToastsContainer />
        </div>
    );
};

describe('Toasts', () => {
    vi.useFakeTimers();

    it('renderiza toast ao chamar addToast', () => {
        render(
            <ToastProvider>
                <TestWrapper />
            </ToastProvider>,
        );

        fireEvent.click(screen.getByText('Add Success'));

        expect(screen.getByText('Mensagem de sucesso')).toBeInTheDocument();
    });

    it('remove toast ao clicar no botão X', () => {
        render(
            <ToastProvider>
                <TestWrapper />
            </ToastProvider>,
        );

        fireEvent.click(screen.getByText('Add Success'));
        const closeBtn = screen.getByRole('button', { name: /x/i });

        act(() => {
            fireEvent.click(closeBtn);
            vi.advanceTimersByTime(500);
        });

        expect(
            screen.queryByText('Mensagem de sucesso'),
        ).not.toBeInTheDocument();
    });

    it('remove toast automaticamente após tempo definido', () => {
        vi.useFakeTimers();
        render(
            <ToastProvider>
                <TestWrapper />
            </ToastProvider>,
        );

        fireEvent.click(screen.getByText('Add Success'));

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        expect(
            screen.queryByText('Mensagem de sucesso'),
        ).not.toBeInTheDocument();
        vi.useRealTimers();
    });

    it('aplica cor de fundo correta de acordo com o tipo', () => {
        render(
            <ToastProvider>
                <TestWrapper />
            </ToastProvider>,
        );

        fireEvent.click(screen.getByText('Add Error'));

        const toast = screen.getByText('Mensagem de erro').closest('.toast');
        expect(toast).toHaveStyle('background-color: #800000');
    });
});
