import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryList from './CategoryList';

const mockCategories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' },
];

describe('CategoryList Component', () => {
    test('renders loading message when loading is true', () => {
        render(
            <CategoryList
                categories={[]}
                loading={true}
                error={null}
                selectedCategoryId={null}
                onCategorySelect={() => {}}
                disabled={false}
            />
        );
        expect(screen.getByText(/Loading categories.../i)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('renders error message when error is provided', () => {
        const errorMessage = 'Failed to fetch categories';
        render(
            <CategoryList
                categories={[]}
                loading={false}
                error={errorMessage}
                selectedCategoryId={null}
                onCategorySelect={() => {}}
                disabled={false}
            />
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toHaveClass('error-message');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('renders "No categories found" message when categories array is empty', () => {
        render(
            <CategoryList
                categories={[]}
                loading={false}
                error={null}
                selectedCategoryId={null}
                onCategorySelect={() => {}}
                disabled={false}
            />
        );
        expect(screen.getByText(/No categories found./i)).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    test('renders category buttons correctly', () => {
        render(
            <CategoryList
                categories={mockCategories}
                loading={false}
                error={null}
                selectedCategoryId={null}
                onCategorySelect={() => {}}
                disabled={false}
            />
        );

        expect(screen.getByRole('button', { name: /Electronics/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Books/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Clothing/i })).toBeInTheDocument();

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(mockCategories.length);
    });

    test('highlights the selected category button with "active" class', () => {
        const selectedId = 2; // Select 'Books'
        render(
            <CategoryList
                categories={mockCategories}
                loading={false}
                error={null}
                selectedCategoryId={selectedId}
                onCategorySelect={() => {}}
                disabled={false}
            />
        );

        const selectedButton = screen.getByRole('button', { name: /Books/i });
        const otherButton = screen.getByRole('button', { name: /Electronics/i });

        expect(selectedButton).toHaveClass('active');
        expect(otherButton).not.toHaveClass('active');
    });

    test('calls onCategorySelect with the correct id when a button is clicked', () => {
        const handleSelect = jest.fn(); 
        const categoryToSelect = mockCategories[1];

        render(
            <CategoryList
                categories={mockCategories}
                loading={false}
                error={null}
                selectedCategoryId={null}
                onCategorySelect={handleSelect}
                disabled={false}
            />
        );

        const buttonToClick = screen.getByRole('button', { name: categoryToSelect.name });
        fireEvent.click(buttonToClick);

        expect(handleSelect).toHaveBeenCalledTimes(1);
        expect(handleSelect).toHaveBeenCalledWith(categoryToSelect.id);
    });

    test('disables buttons when disabled prop is true', () => {
        render(
            <CategoryList
                categories={mockCategories}
                loading={false}
                error={null}
                selectedCategoryId={null}
                onCategorySelect={() => {}}
                disabled={true}
            />
        );

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
            expect(button).toBeDisabled();
        });
    });

    test('does not call onCategorySelect when a disabled button is clicked', () => {
        const handleSelect = jest.fn();
        const categoryToSelect = mockCategories[0];

        render(
            <CategoryList
                categories={mockCategories}
                loading={false}
                error={null}
                selectedCategoryId={null}
                onCategorySelect={handleSelect}
                disabled={true}
            />
        );

        const buttonToClick = screen.getByRole('button', { name: categoryToSelect.name });
        fireEvent.click(buttonToClick);

        expect(handleSelect).not.toHaveBeenCalled();
    });
});
