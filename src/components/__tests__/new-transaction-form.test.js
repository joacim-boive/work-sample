import NewTransactionForm from '@/components/new-transaction-form';
import { Toaster } from '@/components/ui/toaster';
import { server } from '@/mocks/server';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const renderNewTransactionForm = (existingAccountIds = []) => {
  return render(
    <>
      <QueryClientProvider client={queryClient}>
        <NewTransactionForm existingAccountIds={existingAccountIds} />
      </QueryClientProvider>
      <Toaster />
    </>,
  );
};

describe('NewTransactionForm', () => {
  it('should submit transaction with existing account ID and valid amount', async () => {
    renderNewTransactionForm(['123', '456', '789']);

    // Assert that the combobox was rendered
    expect(
      screen.getByLabelText('Choose an existing account'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: '123' })).toBeInTheDocument();

    // Fill in the form fields
    await userEvent.type(
      screen.getByLabelText('Create new account'),
      'Jest Test',
    );
    await userEvent.type(screen.getByLabelText('Amount'), '100');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Form should be reset after successful submit
    await waitFor(() => {
      expect(screen.getByLabelText('Amount')).toHaveValue(null);
      expect(screen.getByLabelText('Create new account')).toHaveValue('');
    });
  });

  it('should show error messages when the form is invalid', async () => {
    renderNewTransactionForm();

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Form should be reset after successful submit
    await waitFor(async () => {
      expect(
        screen.getByText(/Either select account or create a new one./i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Amount cannot be zero/i)).toBeInTheDocument();
    });
  });

  it('should show error message when the entered amount is zero', async () => {
    // Given
    renderNewTransactionForm(['123']);

    // When
    expect(
      screen.getByLabelText('Choose an existing account'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: '123' })).toBeInTheDocument();
    await userEvent.type(
      screen.getByLabelText('Create new account'),
      'Jest Test',
    );
    await userEvent.type(screen.getByLabelText('Amount'), '0');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Then
    await waitFor(() => {
      expect(screen.getByText(/Amount cannot be zero/i)).toBeInTheDocument();
    });
  });

  it('should show error message when the mutation fails', async () => {
    server.use(
      rest.post('/api/add-transaction', (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    renderNewTransactionForm([]);

    await userEvent.type(
      screen.getByLabelText('Create new account'),
      'Jest Test',
    );
    await userEvent.type(screen.getByLabelText('Amount'), '100');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(
        screen.getByText(/Uh oh! Something went wrong./i),
      ).toBeInTheDocument();
    });
  });
});
