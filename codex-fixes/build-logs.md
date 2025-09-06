
> bolivia-frontend@0.1.0 build
> react-scripts build

Creating an optimized production build...
Compiled with warnings.

[eslint] 
src\components\layout\SlideOutMenu.js
  Line 15:48:  The href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value. If you cannot provide a valid href, but still need the element to resemble a link, use a button and change it with appropriate styles. Learn more: https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/anchor-is-valid.md  jsx-a11y/anchor-is-valid

src\screens\admin\ResidentManagementScreen.js
  Line 34:8:  React Hook useEffect has a missing dependency: 'fetchBills'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

src\screens\resident\CommunityScreen.js
  Line 9:24:  'currentUser' is assigned a value but never used  no-unused-vars

src\screens\resident\MaintenanceScreen.js
  Line 8:24:  'currentUser' is assigned a value but never used  no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.

File sizes after gzip:

  127.86 kB  build\static\js\main.58282da9.js
  213 B      build\static\css\main.156cfc18.css

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment

npm notice
npm notice New minor version of npm available! 11.4.2 -> 11.5.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.5.2
npm notice To update run: npm install -g npm@11.5.2
npm notice
