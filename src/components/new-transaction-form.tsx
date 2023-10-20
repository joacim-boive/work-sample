'use client';

import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useRefresh } from '@/context/refresh-context';
import { addTransactionSchema } from '@/schemas/transaction-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, set, useForm } from 'react-hook-form';
import { z } from 'zod';
import Spinner from './ui/spinner';

type Option = {
  value: string;
  label: string;
};

type FormData = z.infer<typeof addTransactionSchema>;

function NewTransactionForm({
  existingAccountIds,
}: {
  existingAccountIds: string[];
}) {
  const form = useForm<FormData>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      existingAccountId: '',
      accountId: '',
      // @ts-expect-error
      amount: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form;

  const { toast } = useToast();
  const { triggerRefresh } = useRefresh();
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const existingAccountId = watch('existingAccountId');
  const accountId = watch('accountId');

  const resetExistingAccountId = useCallback(() => {
    setValue('existingAccountId', '');
    setResetKey((resetKey) => resetKey + 1); // Increment the reset key to force a re-render of the combobox.
  }, [setValue]);

  const options: Option[] = existingAccountIds?.map((id) => ({
    value: id,
    label: id,
  }));

  // Handle so that just either of the two fields can be filled out.
  useEffect(() => {
    if (!!accountId) resetExistingAccountId();
  }, [accountId, setValue, resetExistingAccountId]);
  useEffect(() => {
    if (!!existingAccountId) setValue('accountId', '');
  }, [existingAccountId, setValue]);

  const onSubmit = async (data: FormData) => {
    const { existingAccountId, ...rest } = data;
    const newData = {
      ...rest,
      accountId: existingAccountId || data.accountId,
    };

    try {
      setIsLoading(true);
      await axios.post('/api/transactions', newData);

      triggerRefresh(); // Refresh the list of transactions
      reset(); // Reset the form
      resetExistingAccountId(); // Reset the combobox
      setIsLoading(false);

      toast({
        description: 'Transaction submitted successfully.',
      });
    } catch (error) {
      setIsLoading(false);
      console.error(error);

      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:
          'There was a problem submitting your transaction, please try again.',
      });
    }
  };

  return (
    <ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <form
        role="form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2"
      >
        <Controller
          name="existingAccountId"
          control={control}
          render={({ field }) => (
            <>
              <Label className="text-sm font-semibold">
                Select an account
                {/* TODO: Fix bug with lowercase account IDs. IDs become lowercase when they are selected from the list, creating duplicates. */}
                <Combobox options={options} field={field} key={resetKey} />
              </Label>
              {errors.existingAccountId && (
                <p>{errors.existingAccountId.message}</p>
              )}
            </>
          )}
        />
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <>
              <Label htmlFor="account-id" className="text-sm font-semibold">
                Create new account
              </Label>
              <Input
                id="account-id"
                type="text"
                placeholder="Enter new account ID"
                data-type="account-id"
                className="w-full"
                {...field}
              />
              {errors.accountId && (
                <p className="text-sm text-red-300 ml-1 p-1">
                  {errors.accountId.message}
                </p>
              )}
            </>
          )}
        />
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <>
              <Label htmlFor="amount" className="text-sm font-semibold mt-4">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                data-type="amount"
                className="w-full"
                {...field}
              />
              {errors.amount && (
                <p className="text-sm text-red-300 ml-1 p-1">
                  {errors.amount.message}
                </p>
              )}
            </>
          )}
        />
        <Button
          data-type="transaction-submit"
          type="submit"
          role="button"
          className="ml-auto"
        >
          {isLoading && <Spinner />}Submit
        </Button>
      </form>
    </ErrorBoundary>
  );
}

export default NewTransactionForm;
