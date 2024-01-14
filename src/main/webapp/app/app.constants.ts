// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;

export const OPT_SY = { code: 'SY', size: 100 };
export const OPT_GRADE_LEVEL = { code: 'GRADE_LEVEL', size: 100 };
export const OPT_GENDER = { code: 'GENDER', size: 100 };
