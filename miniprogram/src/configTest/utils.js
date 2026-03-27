const esbuild = require('esbuild');
const fs = require('fs');
const {
  createInstrumenter
} = require('istanbul-lib-instrument');
const os = require('os');
const path = require('path');
const shallowequal = require('shallowequal');
const vm = require('vm');


function createInstance(config, props) {
  const component2 =
    typeof my !== 'undefined' &&
    typeof (my).canIUse === 'function' &&
    (my).canIUse('component2');
  const onInit = [];
  const didMount = [];
  const didUpdate = [];
  const didUnmount = [];
  const deriveDataFromProps = [];

  const instance = {
    ...config,
    ...config.methods,
    props: {
      ...config.props,
      ...props,
    },
    data: {
      ...(typeof config.data === 'function' ? config.data() : config.data),
    },
    methods: {
      ...config.methods,
    },
    setData(data, callback) {
      if (shallowequal(data, instance.data)) {
        return;
      }
      const prevData = {
        ...instance.data,
      };
      Object.assign(instance.data, data);
      const prevProps = instance.props;
      if (component2) {
        deriveDataFromProps.forEach((item) =>
          item.call(instance, instance.props)
        );
      }
      didUpdate.forEach((item) => item.call(instance, prevProps, prevData));
      callback && callback.call(instance);
    },
  };

  if (instance.mixins) {
    instance.mixins.forEach((item) => {
      Object.assign(instance, item.methods);
      Object.assign(instance.methods, item.methods);
      if (item.onInit) {
        onInit.push(item.onInit);
      }
      if (item.deriveDataFromProps) {
        deriveDataFromProps.push(item.deriveDataFromProps);
      }
      if (item.didMount) {
        didMount.push(item.didMount);
      }
      if (item.didUpdate) {
        didUpdate.push(item.didUpdate);
      }
      if (item.didUnmount) {
        didUnmount.push(item.didUnmount);
      }
      if (item.data) {
        instance.data = {
          ...item.data,
          ...instance.data,
        };
      }
    });
  }

  if (instance.onInit) {
    onInit.push(instance.onInit);
  }
  if (instance.deriveDataFromProps) {
    deriveDataFromProps.push(instance.deriveDataFromProps);
  }
  if (instance.didUpdate) {
    didUpdate.push(instance.didUpdate);
  }
  if (instance.didMount) {
    didMount.push(instance.didMount);
  }
  if (instance.didUnmount) {
    didUnmount.push(instance.didUnmount);
  }

  if (component2) {
    onInit.forEach((item) => item.call(instance));
    deriveDataFromProps.forEach((item) => item.call(instance, instance.props));
  }
  didMount.forEach((item) => item.call(instance));

  return {
    getData() {
      return JSON.parse(JSON.stringify(instance.data));
    },
    setProps(props) {
      if (shallowequal(props, instance.props)) {
        return;
      }
      if (component2) {
        deriveDataFromProps.forEach((item) =>
          item.call(instance, {
            ...instance.props,
            ...props,
          })
        );
      }
      const prevProps = {
        ...instance.props,
      };
      const prevData = instance.data;
      Object.assign(instance.props, props);
      didUpdate.forEach((item) => item.call(instance, prevProps, prevData));
    },
    callMethod(name, ...args) {
      return instance.methods[name].call(instance, ...args);
    },
    unMount() {
      didUnmount.forEach((item) => item.call(instance));
    },
  };
}

function component2Patch(originalMy) {
  if (typeof originalMy !== 'undefined') {
    const originalCanIUse = originalMy.canIUse;
    originalMy.canIUse = function (name) {
      if (name === 'component2') {
        return true;
      }
      return originalCanIUse(name);
    };
    return originalMy;
  }
  return {
    canIUse() {
      return true;
    },
  };
}

function getInstanceComponents(name, props, api) {
  const expectFile = path.join(
    os.tmpdir(),
    Math.random().toString(36),
    'out.js'
  );
  const expectFileSourcemap = expectFile + '.map';

  esbuild.buildSync({
    entryPoints: [`./pages/${name.toLowerCase()}/${name.toLowerCase()}.js`],
    bundle: true,
    outfile: expectFile,
    sourcemap: true,
    external: ['fast-deep-equal'],
  });

  const instrumenter = createInstrumenter({
    produceSourceMap: true,
    autoWrap: false,
    esModules: true,
    compact: false,
    coverageVariable: '__MPAAS_APP_',
    coverageGlobalScope: 'COV',
    coverageGlobalScopeFunc: false,
  });

  const sourceCode = fs.readFileSync(expectFile, 'utf-8');

  const code = instrumenter.instrumentSync(
    sourceCode,
    expectFile,
    JSON.parse(fs.readFileSync(expectFileSourcemap, 'utf8'))
  );
  const map = instrumenter.lastSourceMap();

  fs.writeFileSync(expectFile, code);
  fs.writeFileSync(expectFileSourcemap, JSON.stringify(map));

  const script = new vm.Script(code, {
    filename: expectFile,
  });

  const appOptions = {
    globalData: {},
    onLaunch: vi.fn()
  };

  global.getApp = vi.fn(() => appOptions)

  let result;
  const cov = {};
  const context = vm.createContext({
    my: component2Patch(api),
    getApp: vi.fn(() => appOptions),
    console,
    COV: cov,
    require,
    setTimeout,
    Component: (obj) => {
      result = createInstance(obj, props, component2Patch(api));
    },
  });

  globalThis.componentCoverage.push(cov);

  script.runInContext(context);

  return result;
}

module.exports = {
  getInstanceComponents
};