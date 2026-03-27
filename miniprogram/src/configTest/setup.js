import { afterAll, vi } from 'vitest';

globalThis.jest = vi;

globalThis.componentCoverage = [];

afterAll(() => {
    globalThis.componentCoverage?.map((o) => {
        globalThis['__VITEST_COVERAGE__'] = Object.assign(
            globalThis['__VITEST_COVERAGE__'] ?? {},
            o['__MPAAS_APP_']
        );
    });
});
