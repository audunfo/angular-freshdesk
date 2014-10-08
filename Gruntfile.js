'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    /* Meta information */
    pkg: grunt.file.readJSON('bower.json'),
    dir: {
      src: 'src',
      build: 'dist',
      docs: 'docs'
    },
    meta: {
      banner: '/*!\n' +
              ' * <%= pkg.name %> v<%= pkg.version %>\n' +
              ' *\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> Shareworks Solutions B.V.\n' +
              ' *\n' +
              ' * @license <%= pkg.license %>\n' +
              ' */\n'
    },
    /* Source quality control */
    jshint: {
      options: {
        jshintrc: true
      },
      all: [
        'Gruntfile.js',
        '<%= dir.src %>/*.js'
      ]
    },
    /* Build tasks */
    concat: {
      core: {
        src: '<%= dir.src %/*.js',
        dest: '<%= dir.build %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      core: {
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
      build: ['<%= dir.build %>']
    },
    /* Release tasks */
    bump: {
      filepaths: ['package.json', 'bower.json'],
      syncVersion: true,
      tagPrerelease: true
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

  grunt.registerTask('build', ['concat:core', 'uglify:core']);
  grunt.registerTask('dist', ['clean:build', 'build']);
  grunt.registerTask('default', ['jshint', 'build']);
};