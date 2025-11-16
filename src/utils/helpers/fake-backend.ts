export { fakeBackend };

interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

// interface ResponseBody {
//   id: number;
//   username: string;
//   firstName: string;
//   lastName: string;
//   token: string;
// }

function fakeBackend() {
  const users: User[] = [
    { id: 1, username: 'info@codedthemes.com', password: 'admin123', firstName: 'Codedthemes', lastName: '.com' }
  ];

  const customers = [
    {
      id: 1, firstName: 'امیر', lastName: 'جلیلی', nationalCode: '0018523897', personType: 'حقیقی',
      personRelationType: 'ویژه', customerType: 'کاسپین', address: 'تهران, ایران', postalCode: '1111111111',
      name: '021-12345678', branchName: 'تختی', branchCode: '1054'
    },
  ];

  const realFetch = window.fetch;

  window.fetch = function (url: string, opts: { method: string; headers: { [key: string]: string }; body?: string }) {
    return new Promise<Response>((resolve, reject) => {
      setTimeout(handleRoute, 500);

      function handleRoute() {
        switch (true) {
          case url.endsWith('/customers/search') && opts.method === 'POST':
            return searchCustomers();
          default:
            return realFetch(url, opts).then(resolve).catch(reject);
        }
      }

      function searchCustomers() {
        const { nationalCode, personType } = body();
        const results = customers.filter(
          (customer) =>
            (!nationalCode || customer.nationalCode.includes(nationalCode)) &&
            (!personType || customer.personType === personType)
        );
        return ok(results);
      }

      function ok(body: any): void {
        resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }


      function body() {
        return opts.body && JSON.parse(opts.body);
      }
    });
  } as typeof window.fetch;
}

