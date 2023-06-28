'use strict'

import gulp from 'gulp'
import postcss from 'gulp-postcss'
import reporter from 'postcss-reporter'
import syntax_scss from 'postcss-scss'
import stylelint from 'stylelint'
import safeImportant from 'postcss-safe-important'

gulp.task("lint:style", () => {

  var processors = [
    stylelint(),
    reporter({
      clearMessages: true,
      throwError: true
    })
    // safeImportant({
    //   selectors: 'menu-tabs__wrapper a', // you can pass a string
    //   keepcomments: false // will erase all the `no important` comments
    // })
  ];

  return gulp.src(
      ['src/scss/**/*.s+(a|c)ss', '!src/scss/core/**']
    )
    .pipe(postcss(processors, { syntax: syntax_scss }));
});
