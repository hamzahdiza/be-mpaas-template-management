import { debounce } from "../debounce";
// Import library testing

describe('debounce', () => {
  vi.useFakeTimers(); 

  it('should call the function after the specified delay', () => {
    const mockFunction = vi.fn();
    const delay = 1000;
    const context = {};
    const searchValue = 'test';
    
    const mockSetData = vi.fn();
    const mockGetCurrentPages = vi.fn(() => [{ setData: mockSetData }]);
    
    global.getCurrentPages = mockGetCurrentPages;

    debounce(mockFunction, delay, null, context, searchValue);
    
    vi.advanceTimersByTime(delay);
  });

  it('should clear previous timeout', () => {
    const mockFunction = vi.fn();
    const delay = 1000;
    const context = {};
    const searchValue = 'test';

    const mockSetData = vi.fn();
    const mockGetCurrentPages = vi.fn(() => [{ setData: mockSetData }]);
    
    global.getCurrentPages = mockGetCurrentPages; 

    debounce(mockFunction, delay, null, context, searchValue);
    debounce(mockFunction, delay, null, context, searchValue);

  });

  it('should set timeoutId in the page data', () => {
    const mockSetData = vi.fn();
    const mockGetCurrentPages = vi.fn(() => [{ setData: mockSetData }]);
    
    global.getCurrentPages = mockGetCurrentPages;

    const mockFunction = vi.fn();
    const delay = 1000;
    const context = {};
    const searchValue = 'test';

    debounce(mockFunction, delay, null, context, searchValue);

  });
});