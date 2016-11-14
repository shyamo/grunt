module.exports = function(grunt) {
	require('load-grunt-config')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			all: ['dist/'],
			styles: {
				src: [ 'dist/styles/**/*.css', '!dist/styles/main.min.css' ]
			}
		},

		copy: {
			options: {},
			scripts: {
				expand: true,
				cwd: 'src/',
				src: ['scripts/**/*.js'],
				dest: 'dist/',
				filter: 'isFile'
			},
			html: {
				expand: true,
				cwd: 'src/',
				src: ['**/*.html', '!includes/**/*.html'],
				dest: 'dist/',
				filter: 'isFile'
			},
			images: {
				expand: true,
				cwd: 'src/',
				src: ['images/**/*.{png,jpg,gif}'],
				dest: 'dist/',
				filter: 'isFile'
			},
			develop: {
				expand: true,
				cwd: 'src/',
				src: ['**', '!styles/**/*.{less,scss,sass}'],
				dest: 'dist/',
				filter: 'isFile'
			},
			build: {
				expand: true,
				cwd: 'src/',
				src: ['**', '!styles/**/*.{less,scss,sass}', '!styles/**/*.css.map', '!scripts/**/*', '!images/*', '!includes/**/*.html'],
				dest: 'dist/',
				filter: 'isFile'
			}
		},

		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: ['Gruntfile.js', 'src/scripts/**/*.js', '!src/scripts/vendor/**/*.js']
		},

		uglify: {
			options: {},
			build: {
				files: {
				  'dist/scripts/main.min.js': ['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js']
				}
			}
		},

		concat: {
			options: {},
			build: {
				src: ['src/scripts/vendor/jquery-1.11.1.min.js', 'src/scripts/vendor/**/*.js'],
				dest: 'dist/scripts/vendor.min.js'
			}
		},

		less: {
			options: {},
			all: {
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: ['**/*.less'],
					dest: 'dist/styles',
					ext: '.css'
				}]
			}
		},

		sass: {
			options: {
				sourceMap: true
				},
			all: {
				files: [{
					expand: true,
					cwd: 'src/styles',
					src: ['**/*.{scss,sass}'],
					dest: 'dist/styles',
					ext: '.css'
				}]
			}
		},

		cssmin: {
			options: {},
			build: {
				files: {
					'dist/styles/main.min.css': 'dist/styles/**/*.css'
				}
			}
		},

		imagemin: {
			options: {},
			build: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'dist/'
				}]
			}
		},

		processhtml: {
			options: {},
			develop: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['**/*.html', '!includes/**/*.html'],
					dest: 'dist/'
				}]
			},
			build: {
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**/*.html', '!includes/**/*.html'],
					dest: 'dist/'
				}]
			}
		},

		connect: {
			options: {
				port: 4000,
				base: 'dist/',
				hostname: 'localhost',
				livereload: true
			},
			livereload: {
				options: {
					open: {
						target: 'http://localhost:4000'
					},
					base: [
						'dist/'
					]
				}
			}
		},

		watch: {
			less: {
				files: ['src/styles/**/*.less'],
				tasks: ['less', 'beep:error:*'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			sass: {
				files: ['src/styles/**/*.{scss,sass}'],
				tasks: ['sass', 'beep:error:*'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			scripts: {
				files: 'src/scripts/**/*.js',
				tasks: ['newer:jshint', 'beep:error:*', 'newer:copy:scripts'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			html: {
				files: ['src/**/*.html', '!src/includes/**/*.html'],
				tasks: ['newer:processhtml:develop'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			includes: {
				files: 'src/includes/**/*.html',
				tasks: ['processhtml:develop'],
				options: {
					livereload: true,
					nospawn: true
				}
			},

			images: {
				files: 'src/images/**/*',
				tasks: ['newer:copy:images'],
				options: {
					livereload: true,
					nospawn: true
				}
			}
		}
	});

	grunt.registerTask('develop', ['jshint', 'clean:all', 'copy:develop', 'less', 'sass', 'processhtml:develop', 'connect', 'beep:error:*', 'beep:**', 'watch']);
	grunt.registerTask('build',   ['jshint', 'clean:all', 'copy:build', 'uglify', 'concat', 'less', 'sass', 'cssmin', 'clean:styles', 'imagemin', 'processhtml:develop', 'processhtml:build', 'beep:error:*', 'beep:**']);
};
