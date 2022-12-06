module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js']
    },
	uglify: {
	  my_target: {
	    files: {
	      'dist/lwPopups.min.js': ['src/lwPopups.js', 'src/lwPopupsUtilities.js']
		}
	  }
	},
    jasmine: {
      options: {
          version: '3.8.0',
          noSandbox: true
      },
      myTest001: {
        src: 'src/**/*.js',
        options: {
          specs: 'test/*.test.js'
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jshint', 'uglify', 'jasmine']);

};