import path from 'path';
import del from 'del';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import bg from 'gulp-bg';
import shell from 'gulp-shell';
import runSequence from 'run-sequence';
import dotenv from 'dotenv';
import yargs from 'yargs';

const args = yargs
  .alias('p', 'production')
  .argv;

gulp.task('env', () => {
  dotenv.load();
  process.env.NODE_ENV = process.env.NODE_ENV || (
    args.production ? 'production' : 'development'
  );
});

gulp.task('clean', () => del('build/'));
gulp.task('bleach', ['clean'], () => del([
  'dump.rdb', 'webpack-assets.json'
]));

gulp.task('build', ['env'], done =>
  require('./webpack/build')(done)
);

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

gulp.task('server', ['env'], done =>
  args.production
    ? runSequence('clean', 'build', 'server:node', done)
    : runSequence('server:hot', 'server:nodemon', done)
);

gulp.task('default', ['server']);
