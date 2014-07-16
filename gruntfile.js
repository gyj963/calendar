/**
 * Created by Administrator on 14-3-30.
 */
module.exports = function(grunt) {
	// 项目配置(任务配置)
	grunt.initConfig({
		                 pkg: grunt.file.readJSON('package.json'),
		                 watch: {
			                 client: {
				                 files: ['public/**/**/*', 'public/*','public/**/*','views/*'],
				                 options: {
					                 livereload: true
				                 }
			                 }
		                 }
	                 });

	// 加载插件
	grunt.loadNpmTasks('grunt-contrib-watch');

	// 自定义任务
	grunt.registerTask('live', ['watch']);

};