import { parseNestedJSON } from "../parsedDataNative";

describe('parseNestedJSON', () => {
  it('should return partnerData and queryParam from valid JSON string', () => {
    const jsonString = JSON.stringify({
      partnerData: {
        id: 'partner1',
        name: 'Partner One'
      },
      queryParam: {
        search: 'test'
      }
    });

    const result = parseNestedJSON(jsonString);

    expect(result).toEqual({
      partnerData: {
        id: 'partner1',
        name: 'Partner One'
      },
      queryParam: {
        search: 'test'
      }
    });
  });

  it('should throw an error for invalid JSON string', () => {
    const invalidJsonString = "{ partnerData: 'invalid data' "; // JSON tidak valid

    expect(() => parseNestedJSON(invalidJsonString)).toThrow(SyntaxError);
  });

  it('should handle empty JSON string', () => {
    const emptyJsonString = JSON.stringify({});

    const result = parseNestedJSON(emptyJsonString);

    expect(result).toEqual({
      partnerData: undefined,
      queryParam: undefined
    });
  });
});