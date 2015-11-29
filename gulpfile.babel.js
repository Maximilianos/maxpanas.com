import path from 'path';
import gulp from 'gulp';
import bg from 'gulp-bg';
import shell from 'gulp-shell';
import runSequence from 'run-sequence';
import yargs from 'yargs';

const args = yargs
  .alias('p', 'production')
  .argv;

gulp.task('env', () => {
  process.env.NODE_ENV = args.production ? 'production' : 'development';
});

gulp.task('server-node', bg('node', './src/server'));
gulp.task('server-nodemon', shell.task(
  path.normalize('node_modules/.bin/nodemon src/server')
));

gulp.task('server', ['env'], done => {
  if (args.production) {
    runSequence('server-node', done);
  } else {
    runSequence('server-nodemon', done);
  }
});

gulp.task('default', ['server']);
