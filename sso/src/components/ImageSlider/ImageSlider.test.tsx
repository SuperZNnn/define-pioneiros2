import { render, screen, act } from '@testing-library/react'
import { afterEach, beforeEach, describe, vi, it, expect } from 'vitest'
import ImageSlider from './ImageSlider'
import '@testing-library/jest-dom/vitest'

describe('ImageSlider', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('deve renderizar corretamente com a primeira image', () => {
        render(<ImageSlider/>)

        act(() => {
            vi.advanceTimersByTime(5000)
        })

        const mainImage = screen.getByAltText('Imagem primária do slider')
        expect(mainImage).toHaveClass('fadeout')

        act(() => {
            vi.advanceTimersByTime(500)
        })

        expect(mainImage).not.toHaveClass('fadeout')
        expect(mainImage).toHaveAttribute('src', expect.stringContaining('2.jpg'))
    })

    it('deve voltar para a primeira imagem após a última', () => {
        const quant = 5
        render(<ImageSlider />)

        const mainImage = screen.getByAltText('Imagem primária do slider')

        act(() => {
            for (let i = 0; i < quant - 1; i++) {
            vi.advanceTimersByTime(5000)
            vi.advanceTimersByTime(500)
            }
        })

        expect(mainImage).toHaveAttribute('src', expect.stringContaining('5.jpg'))

        act(() => {
            vi.advanceTimersByTime(5000)
            vi.advanceTimersByTime(500)
        })

        expect(mainImage).toHaveAttribute('src', expect.stringContaining('1.jpg'))
    })

    it('deve limpar o intervalo ao desmonta', () => {
        const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
        const { unmount } = render(<ImageSlider/>)

        unmount()
        
        expect(clearIntervalSpy).toHaveBeenCalled()
    })

    it('deve aplicar a classe fadeout durante a transição', () => {
        render(<ImageSlider/>)
        
        act(() => {
            vi.advanceTimersByTime(5000)
        })

        const mainImage = screen.getByAltText('Imagem primária do slider')
        expect(mainImage).toHaveClass('fadeout')

        act(() => {
            vi.advanceTimersByTime(500)
        })

        expect(mainImage).not.toHaveClass('fadeout')
    })

    it('deve renderizar a imagem secundária corretamente', () => {
        render(<ImageSlider/>)

        const secondaryImage = screen.getByAltText('Imagem secundária do slider')
        expect(secondaryImage).toBeInTheDocument()
        expect(secondaryImage).toHaveStyle('position: absolute')
    })
})