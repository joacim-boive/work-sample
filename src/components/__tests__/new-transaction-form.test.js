import NewTransactionForm from '@/components/new-transaction-form';
import * as refreshContext from '@/context/refresh-context';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { RefreshProvider } = refreshContext;

describe('NewTransactionForm', () => {
  it('should submit transaction with existing account ID and valid amount', async () => {
    const { getByLabelText, debug } = render(
      <RefreshProvider>
        <NewTransactionForm existingAccountIds={['123', '456', '789']} />
      </RefreshProvider>
    );

    // Assert that the combobox was rendered
    expect(screen.getByLabelText('Select an account')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: '123' })).toBeInTheDocument();

    // Fill in the form fields
    await userEvent.type(
      screen.getByLabelText('Create new account'),
      'Jest Test'
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
    const { getByLabelText, debug } = render(
      <RefreshProvider>
        <NewTransactionForm existingAccountIds={[]} />
      </RefreshProvider>
    );

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Form should be reset after successful submit
    await waitFor(async () => {
      expect(
        screen.getByText(/Either select account or create a new one./i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Amount cannot be zero/i)).toBeInTheDocument();
    });
  });
});
