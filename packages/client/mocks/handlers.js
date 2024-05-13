import { graphql, HttpResponse } from 'msw';
import { data } from './data';

const ok = {ok: true};

export const handlers = [
  graphql.query('GetReport', () => HttpResponse.json({
    data: {
      report: data
    }
  })),
  graphql.query('GetEntry', ({variables}) => {
    const entry = data.entries.find(e => e.id === variables.entryId);
    const exceptions = data.exceptions.filter(e => e.entryId === variables.entryId);
    return HttpResponse.json({
      data: {
        entry: {
          ...entry,
          exceptions
        }
      }
    });
  }),
  graphql.query('GetCashAdvances', async () => {
    // Simulate a slow network request.
    await new Promise(resolve => setTimeout(resolve, 1e3));
    return HttpResponse.json({
      data: {
        report: {
          cashAdvances: data.cashAdvances
        }
      }
    });
  }),
  graphql.mutation('Reset', () => {
    data.reset();
    return HttpResponse.json({
      data: {
        status: ok
      }
    });
  }),
  graphql.mutation('UpdateEntryAmount', ({variables}) => {
    const entry = data.entries.find(e => e.id === variables.entryId);
    entry.amount += 1;
    data.totalAmount += 1;
    if (data.cashAdvances[0]) {
      data.cashAdvances[0].amount -= 1;
      if (!data.cashAdvances[0].amount) {
        data.cashAdvances = [];
      }
    }
    return HttpResponse.json({
      data: {
        status: ok
      }
    });
  }),
  graphql.mutation('UpdateEntryReceipt', ({variables}) => {
    const entry = data.entries.find(e => e.id === variables.entryId);
    if (entry.receipt) {
      entry.receipt = null;
      data.exceptions.push({entryId: variables.entryId, text: 'Missing receipt!'});
    } else {
      entry.receipt = 'https://example.com/receipt.jpg';
      const exception = data.exceptions.findIndex(e => e.entryId === variables.entryId);
      data.exceptions.splice(exception, 1);
    }
    return HttpResponse.json({
      data: {
        status: ok
      }
    });
  })
];
