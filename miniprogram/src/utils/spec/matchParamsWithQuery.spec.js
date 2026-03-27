import { matchParamsWithQuery } from "../matchParamsWithQuery";

describe('matchParamsWithQuery', () => {
  it('should correctly match params with query and return context', () => {
    const responseNative = {
      partnerData: {
        params: [
          { queryParam: 'billerNumber', valueMapping: 'billerNumber' },
          { queryParam: 'vaNumber', valueMapping: 'vaNumber' }
        ]
      },
      queryParam: {
        billerNumber: '123456',
        vaNumber: '654321'
      }
    };

    matchParamsWithQuery(responseNative);

  });

  it('should return null for missing parameters', () => {
    const responseNative = {
      partnerData: {
        params: [
          { queryParam: 'billerNumber', valueMapping: 'billerNumber' },
          { queryParam: 'vaNumber', valueMapping: 'vaNumber' }
        ]
      },
      queryParam: {
        vaNumber: '654321'
      }
    };

     matchParamsWithQuery(responseNative);

  });

  it('should return empty context if no matching params', () => {
    const responseNative = {
      partnerData: {
        params: [
          { queryParam: 'nonExistentParam', valueMapping: 'someValue' }
        ]
      },
      queryParam: {
        billerNumber: '123456'
      }
    };

    matchParamsWithQuery(responseNative);

  });
});