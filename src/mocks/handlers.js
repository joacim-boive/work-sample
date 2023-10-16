import { rest } from 'msw';

export const handlers = [
  rest.get('/api/get-all-account-ids', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          success: true,
          accountIds: ['MSW-123'],
        },
      })
    );
  }),
  rest.get('/api/all-transactions', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: {
          success: true,
          transactions: [
            {
              id: 1,
              accountId: 'MSW-123',
              amount: 100,
              timestamp: 1697225421610,
              action: 'deposit',
              newBalance: 200,
            },
          ],
        },
      })
    );
  }),
];
