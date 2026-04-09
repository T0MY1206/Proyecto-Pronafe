import { describe, expect, it } from 'vitest';
import { getUrlPaginate, hasParentClass } from './functions';

describe('hasParentClass', () => {
    it('detecta clase en el elemento raíz', () => {
        const el = document.createElement('div');
        el.className = 'foo';
        expect(hasParentClass(['foo'], el)).toBe(true);
    });

    it('detecta clase en un ancestro', () => {
        const parent = document.createElement('div');
        parent.className = 'outer';
        const child = document.createElement('span');
        parent.appendChild(child);
        expect(hasParentClass(['outer'], child)).toBe(true);
    });

    it('devuelve false si la clase no existe en la cadena', () => {
        const el = document.createElement('div');
        expect(hasParentClass(['missing'], el)).toBe(false);
    });
});

describe('getUrlPaginate', () => {
    it('devuelve cadena vacía si url está vacía', () => {
        expect(getUrlPaginate('', { page: 1 }, 10, null)).toBe('');
    });

    it('añade limit y parámetros de opciones', () => {
        const url = 'https://example.test/items';
        const result = getUrlPaginate(url, { page: 2, search: 'x' }, 15, null);
        expect(result).toContain('limit=15');
        expect(result).toContain('page=2');
        expect(result).toContain('search=x');
    });

    it('alterna direction cuando order coincide con columnOrder', () => {
        const url = 'https://example.test/items';
        const asc = getUrlPaginate(url, { order: 'name', direction: 'asc' }, 10, 'name');
        expect(asc).toContain('direction=desc');
        const desc = getUrlPaginate(url, { order: 'name', direction: 'desc' }, 10, 'name');
        expect(desc).toContain('direction=asc');
    });
});
