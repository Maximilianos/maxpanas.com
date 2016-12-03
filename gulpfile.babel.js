import path from 'path';
import del from 'del';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import bg from 'gulp-bg';
import shell from 'gulp-shell';
import runSequence from 'run-sequence';
import yargs from 'yargs';

import webpackBuild from './webpack/build';

const args = yargs
  .alias('p', 'production')
  .argv;

gulp.task('env', () => {
  process.env.NODE_ENV = (
    args.production ? 'production' : 'development'
  );
});

gulp.task('clean', () => del('build/*'));

gulp.task('build', ['env'], webpackBuild);

gulp.task('lint', () =>
  gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js',
    'webpack/**/*.js'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
);

gulp.task('server:node', bg('node', './src/server'));
gulp.task('server:hot', bg('node', './webpack/server'));
gulp.task('server:nodemon', shell.task(
  path.normalize('node_modules/.bin/nodemon src/server')
));

gulp.task('server', ['env'], done => {
  if (args.production) {
    runSequence('clean', 'build', 'server:node', done);
  } else {
    runSequence('server:hot', 'server:nodemon', done);
  }
});

gulp.task('default', ['server']);
