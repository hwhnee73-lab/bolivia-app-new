
> bolivia-frontend@0.1.0 test
> react-scripts test --watchAll=false

  console.error
    Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

    [0m [90m 4 |[39m
     [90m 5 |[39m [36mexport[39m [36mconst[39m renderWithProvider [33m=[39m (ui[33m,[39m options) [33m=>[39m {
    [31m[1m>[22m[39m[90m 6 |[39m   [36mreturn[39m render([33m<[39m[33mAppProvider[39m[33m>[39m{ui}[33m<[39m[33m/[39m[33mAppProvider[39m[33m>[39m[33m,[39m options)[33m;[39m
     [90m   |[39m                [31m[1m^[22m[39m
     [90m 7 |[39m }[33m;[39m
     [90m 8 |[39m
     [90m 9 |[39m [36mexport[39m [36mconst[39m mockFetch [33m=[39m (json[33m,[39m ok [33m=[39m [36mtrue[39m[33m,[39m status [33m=[39m [35m200[39m) [33m=>[39m {[0m

      at printWarning (node_modules/react-dom/cjs/react-dom-test-utils.development.js:71:30)
      at error (node_modules/react-dom/cjs/react-dom-test-utils.development.js:45:7)
      at actWithWarning (node_modules/react-dom/cjs/react-dom-test-utils.development.js:1736:7)
      at node_modules/@testing-library/react/dist/act-compat.js:63:25
      at renderRoot (node_modules/@testing-library/react/dist/pure.js:159:26)
      at render (node_modules/@testing-library/react/dist/pure.js:246:10)
      at renderWithProvider (src/test-utils.js:6:16)
      at Object.<anonymous> (src/__tests__/App.test.jsx:8:21)
      at TestScheduler.scheduleTests (node_modules/@jest/core/build/TestScheduler.js:333:13)
      at runJest (node_modules/@jest/core/build/runJest.js:404:19)
      at _run10000 (node_modules/@jest/core/build/cli/index.js:320:7)
      at runCLI (node_modules/@jest/core/build/cli/index.js:173:3)

PASS src/__tests__/App.test.jsx
  √ renders Auth screen by default (113 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.795 s, estimated 10 s
Ran all test suites.
