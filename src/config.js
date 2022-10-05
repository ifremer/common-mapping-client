/**
 * Copyright 2017 California Institute of Technology.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**************/
/* App Config */
/**************/

/*
Add configuration entries to this that should be editable
in operations (i.e. after build). This config file is loaded
directly in index.html, without going through webpack.

see `src/constants/appConfig.js` for all configuration options

Note that configuration settings that are not expected to change
during deployment should be made in `src/constants/appConfig.js` directly

EXAMPLE:
The following configuration will change the display title for
the application.
```
APPLICATION_CONFIG = {
	APP_TITLE: "New Title"
};
```

*/

/* DEFAULT */
APPLICATION_CONFIG = {};

/* EOSC */
// APPLICATION_CONFIG = {
//     APP_TITLE: "Argo Marine data discovery",
//     APP_LOGO: "img/eosc-future.svg",
//     URLS: {
//         layerConfig: [
//             {
//                 url: "default-data/_core_default-data/capabilities.xml",
//                 type: "wmts/xml"
//             },
//             {
//                 url: "default-data/eosc-data/layers.json",
//                 type: "json"
//             }
//         ],
//         paletteConfig: "default-data/eosc-data/palettes.json"
//     }
// };

/* IFREMER */
// APPLICATION_CONFIG = {
//     APP_TITLE: "Ifremer various marine data discovery",
//     APP_LOGO: "img/logo_Ifremer.svg",
//     URLS: {
//         layerConfig: [
//             {
//                 url: "default-data/_core_default-data/capabilities.xml",
//                 type: "wmts/xml"
//             },
//             {
//                 url: "default-data/ifremer-data/layers.json",
//                 type: "json"
//             }
//         ],
//         paletteConfig: "default-data/ifremer-data/palettes.json"
//     }
// };
