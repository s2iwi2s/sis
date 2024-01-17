// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

import {Editor} from "tinymce";

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;

export const OPT_SY = { code: 'SY', size: 100, sort: ['priority,asc'] };
export const OPT_GRADE_LEVEL = { code: 'GRADE_LEVEL', size: 100, sort: ['priority,asc'] };
export const OPT_GENDER = { code: 'GENDER', size: 100, sort: ['priority,asc'] };

export const OPT_TINY_MCE = {
  base_url: '/tinymce',
  suffix: '.min',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | help',
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; }'
};
export const OPT_TINY_MCE_DISABLED = {
  base_url: '/tinymce',
  suffix: '.min',plugins: ['preview', 'fullscreen','help', 'wordcount'
  ],
  menubar: 'view',
  toolbar: false,
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; }',
  disabled: true,
};
