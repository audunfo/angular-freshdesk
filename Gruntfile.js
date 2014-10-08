module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  var dir = {
    source: 'src',
    build: 'build',
    release: 'release',
    docs: 'docs'
  };

  grunt.initConfig({
    /* Meta information */
    pkg: grunt.file.readJSON('package.json'),
    dir: dir,
    meta: {
      banner: '/*!\n' +
              ' * @name <%= pkg.name %>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * @copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * @link <%= pkg.homepage %>\n' +
              ' * @license <%= pkg.license %>\n' +
              ' */\n'
    },
    /* Source quality control */
    jshint: {
      options: {
        jshintrc: true
      },
      source: ['<%= concat.build.src %>'],
      build: ['<%= concat.build.dest %>'],
      tools: ['Gruntfile.js']
    },
    /* Build tasks */
    concat: {
      options: {
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: '<%= dir.source %>/*.js',
        dest: '<%= dir.build %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      build: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: [{
          src: '<%= dir.build %>/<%= pkg.name %>.js',
          dest: '<%= dir.build %>/<%= pkg.name %>.min.js'
        }]
      }
    },
    clean: {
      build: ['<%= dir.build %>/*.js'],
      docs: ['<%= dir.docs %>']
    },
    /* Release tasks */
    changelog: {
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        pushTo: 'origin',
        commitFiles: ['package.json', 'bower.json', 'CHANGELOG.md'],
        commitMessage: 'chore(release): release v%VERSION%'
      }
    },
    /* Documentation */
    ngdocs: {
      options: {
        dest: '<%= dir.docs %>',
        html5Mode: false,
        title: 'Freshdesk',
        startPage: '/api/freshdesk.$freshDesk'
      },
      api: {
        src: ['<%= dir.src %>/*.js'],
        title: 'API Reference'
      }
    }
  });

  grunt.registerTask('default', ['jshint:source']);
  grunt.registerTask('build', ['concat:build', 'uglify:build']);
  grunt.registerTask('dist', ['clean:build', 'build']);
  grunt.registerTask('docs', ['clean:docs', 'ngdocs']);
  grunt.registerTask('release', ['bump-only', 'changelog', 'bump-commit']);

  grunt.registerTask('update-pages', 'Update the "gh-pages" branch with the current documentation.', function () {
    asyncTask(updatePages(), this.async());
  });

  /**
   * Update the `gh-pages` branch with the files in `docs`.
   *
   * @returns {*} A promise that will resolve when the `gh-pages` branch is up-to-date
   */
  function updatePages () {
    return isCleanMaster()
      .then(function () {
        return system('git write-tree --prefix=' + dir.docs + '/');
      })
      .then(function (result) {
        var tree = result.stdout.trim();

        return system('git commit-tree -p gh-pages -m "docs(api): automated documentation build" ' + tree);
      })
      .then(function (result) {
        var commit = result.stdout.trim();

        return system('git update-ref refs/heads/gh-pages ' + commit);
      });
  }

  // -- Internal functions ----------------------------------------------------

  var exec = require('child-process-promise').exec;

  /**
   * Execute an asynchronous task using promises.
   *
   * This awaits the resolving of `promise` and then completes the async Grunt task.
   *
   * @param {object} promise
   * @param {function} callback The function returned by `
   */
  function asyncTask (promise, callback) {
    promise
      .then(function () {
        callback();
      })
      .fail(function (error) {
        callback(error);
      });
  }

  /**
   * Execute a system command.
   *
   * @param {string} cmd The command to execute
   *
   * @returns {*} A promise that will resolve / reject with the command status
   */
  function system (cmd) {
    grunt.verbose.writeln('% ' + cmd);

    return exec(cmd)
      .then(function (result) {
        grunt.verbose.write(result.stdout);

        return result;
      })
      .fail(function (result) {
        grunt.log.write(result.stderr);

        throw new Error('Running "' + cmd + '" failed.');
      });
  }

  /**
   * Check whether the active branch is master and all changes are commited.
   *
   * @returns {*} A promise that will resolve when the current state is correct
   */
  function isCleanMaster () {
    return exec('git symbolic-ref HEAD')
      .then(function (result) {
        if (result.stdout.trim() !== 'refs/heads/master')
          throw new Error('Not on branch "master", aborting.');

        return exec('git status --porcelain');
      })
      .then(function (result) {
        if (result.stdout.trim() !== '')
          throw new Error('Branch is dirty, aborting.');
      });
  }
};
