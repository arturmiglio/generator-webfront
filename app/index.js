'use strict';

var fs = require('fs'),
    generators = require('yeoman-generator'),
    _ = require('lodash');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        // arguments passed in during initialization (yo threshold [appname])
        this.argument('appname', {type: String, required: true});

        this.appname = _.kebabCase(this.appname);
    },

    prompting: function() {
        var done = this.async();

        this.prompt([
            {
                type: 'input',
                name: 'client',
                message: 'Client name'
            },
            {
                type: 'input',
                name: 'title',
                message: 'Project name'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Project description'
            },
            {
                type: 'input',
                name: 'git',
                message: 'Project Git repo'
            },
            {
                type: 'input',
                name: 'name',
                message: 'Your name',
                default: 'Artur Miglio'
            },
            {
                type: 'input',
                name: 'email',
                message: 'Your email',
                default: 'arturmiglio@gmail.com'
            },
            {
                type: 'input',
                name: 'site',
                message: 'Your site URL',
                default: 'http://www.arturmiglio.com'
            },
            {
                type: 'list',
                name: 'esv',
                message: 'ECMAScript version?',
                choices: [
                    'ES5',
                    'ES6'
                ],
                default: 'ES5'
            },
            {
                type: 'confirm',
                name: 'browserify',
                message: 'Use Browserify? (Required if ES >= 6)',
                default: true
            },
            {
                type: 'confirm',
                name: 'jquery',
                message: 'Use jQuery?',
                default: false
            },
            {
                type: 'confirm',
                name: 'backbone',
                message: 'Use Backbone? (Includes jQuery and Marionette)',
                default: false
            },
            {
                type: 'confirm',
                name: 'react',
                message: 'Use React?',
                default: false
            },
            {
                type: 'confirm',
                name: 'sprites',
                message: 'Use CSS sprites?',
                default: false
            },
            {
                type: 'confirm',
                name: 'icons',
                message: 'Use icon font?',
                default: true
            },
            {
                type: 'confirm',
                name: 'jpgm',
                message: 'Use JPEGmini during image minification?',
                default: false
            },
            {
                type: 'list',
                name: 'deploy',
                message: 'Use deploy automation?',
                choices: [
                    'None',
                    'FTP',
                    'SSH',
                    'Firebase'
                ],
                default: 'Firebase'
            }
        ], function(answers) {
            this.client = answers.client;
            this.title = answers.title;
            this.path_slug = answers.title.split(' ').join('-').toLowerCase();
            this.description = answers.description;
            this.git = answers.git;
            this.name = answers.name;
            this.email = answers.email;
            this.site = answers.site;
            this.license = 'MIT';
            this.esv = answers.esv.toLowerCase();
            this.useBrowserify = answers.browserify;
            this.usejQuery = answers.jquery;
            this.useBackbone = answers.backbone;
            this.useReact = answers.react;
            this.useSprites = answers.sprites;
            this.useIconFont = answers.icons;
            this.useJPEGmini = answers.jpgm;
            this.useBabel = false;
            this.useDeploy = answers.deploy.toLowerCase();

            if(this.useDeploy !== 'firebase') {
                this.useFirebase = false;
            } else {
                this.useFirebase = true;
            }

            if (this.esv !== 'es5') {
                this.useBrowserify = true;
                this.useBabel = true;
            }

            if (this.useBackbone) {
                this.usejQuery = true;
            }

            done();
        }.bind(this));
    },

    writing: function() {
        var config = {
                client: this.client,
                title: this.title,
                slug: this.appname,
                path_slug: this.path_slug,
                description: this.description,
                git: this.git,
                year: new Date().getFullYear(),
                name: this.name,
                email: this.email,
                site: this.site,
                license: this.license,
                esv: this.esv,
                useBrowserify: this.useBrowserify,
                useBabel: this.useBabel,
                usejQuery: this.usejQuery,
                useBackbone: this.useBackbone,
                useReact: this.useReact,
                useSprites: this.useSprites,
                useIconFont: this.useIconFont,
                useJPEGmini: this.useJPEGmini,
                useDeploy: this.useDeploy,
                useFirebase: this.useFirebase
            };

        // general files
        this.fs.copyTpl(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'), config);
        this.fs.copyTpl(this.templatePath('gitignore'), this.destinationPath('.gitignore'), config);
        this.fs.copyTpl(this.templatePath('htaccess'), this.destinationPath('.htaccess'));
        this.fs.copyTpl(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'), config);
        this.fs.copyTpl(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'), config);
        this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('index.html'), config);
        this.fs.copyTpl(this.templatePath('licenses/' + this.license), this.destinationPath('LICENSE'), config);
        this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), config);
        this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), config);

        if (!fs.existsSync(this.destinationPath('images'))) { fs.mkdir(this.destinationPath('images')); }

        // gulp
        this.fs.copy(this.templatePath('gulp/utils'), this.destinationPath('gulp/utils'));
        this.fs.copyTpl(this.templatePath('gulp/index.js'), this.destinationPath('gulp/index.js'));
        this.fs.copyTpl(this.templatePath('gulp/config.json'), this.destinationPath('gulp/config.json'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/_build.js'), this.destinationPath('gulp/tasks/_build.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/_default.js'), this.destinationPath('gulp/tasks/_default.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/_deploy.js'), this.destinationPath('gulp/tasks/_deploy.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/_serve-build.js'), this.destinationPath('gulp/tasks/_serve-build.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/_serve-dev.js'), this.destinationPath('gulp/tasks/_serve-dev.js'), config);
        // this.fs.copyTpl(this.templatePath('gulp/tasks/browser-sync.js'), this.destinationPath('gulp/tasks/browser-sync.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/clean.js'), this.destinationPath('gulp/tasks/clean.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/copy.js'), this.destinationPath('gulp/tasks/copy.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/imagemin.js'), this.destinationPath('gulp/tasks/imagemin.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/lint.js'), this.destinationPath('gulp/tasks/lint.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/sass.js'), this.destinationPath('gulp/tasks/sass.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/usemin.js'), this.destinationPath('gulp/tasks/usemin.js'), config);
        this.fs.copyTpl(this.templatePath('gulp/tasks/watch.js'), this.destinationPath('gulp/tasks/watch.js'), config);

        if (this.useBrowserify) {
            this.fs.copyTpl(this.templatePath('gulp/tasks/browserify.js'), this.destinationPath('gulp/tasks/browserify.js'), config);
        }

        // sass
        this.fs.copy(this.templatePath('sass'), this.destinationPath('sass'));

        // javascript
        if (this.useBackbone) {
            this.fs.copy(this.templatePath('backbone/' + this.esv + '/app.js'), this.destinationPath('js/app.js'));
            this.fs.copy(this.templatePath('backbone/' + this.esv + '/collections'), this.destinationPath('js/collections'));
            this.fs.copy(this.templatePath('backbone/' + this.esv + '/models'), this.destinationPath('js/models'));
            this.fs.copy(this.templatePath('backbone/' + this.esv + '/routers'), this.destinationPath('js/routers'));
            this.fs.copy(this.templatePath('backbone/' + this.esv + '/views'), this.destinationPath('js/views'));
            this.fs.copy(this.templatePath('backbone/' + this.esv + '/utils'), this.destinationPath('js/utils'));

            // TODO translate new files to ES6

            this.fs.copy(this.templatePath('backbone/templates/root'), this.destinationPath('templates/root'));
            this.fs.copy(this.templatePath('backbone/json'), this.destinationPath('js/json'));
        } else if (this.useReact) {
            this.fs.copy(this.templatePath('react/' + this.esv + '/app.js'), this.destinationPath('js/app.js'));
            this.fs.copy(this.templatePath('react/' + this.esv + '/components'), this.destinationPath('js/components'));

            if (!this.useBabel) {
                this.fs.copy(this.templatePath('react/' + this.esv + '/routers'), this.destinationPath('js/routers'));
            }
        } else {
            var jsFile = (this.useBrowserify) ? 'app.js' : 'main.js';

            this.fs.copy(this.templatePath('js/' + jsFile), this.destinationPath('js/' + jsFile));
        }

        // sprites
        if (this.useSprites) {
            if (!fs.existsSync(this.destinationPath('sprites'))) { fs.mkdir(this.destinationPath('sprites')); }
            if (!fs.existsSync(this.destinationPath('sprites/source-2x'))) { fs.mkdir(this.destinationPath('sprites/source-2x')); }

            this.fs.copyTpl(this.templatePath('gulp/tasks/sprites.js'), this.destinationPath('gulp/tasks/sprites.js'));
            this.fs.copyTpl(this.templatePath('gulp/tasks/resize-sprites.js'), this.destinationPath('gulp/tasks/resize-sprites.js'));
        }

        // icon font
        if (this.useIconFont) {
            if (!fs.existsSync(this.destinationPath('fonts'))) { fs.mkdir(this.destinationPath('fonts')); }
            if (!fs.existsSync(this.destinationPath('fonts/icomoon'))) { fs.mkdir(this.destinationPath('fonts/icomoon')); }

            this.fs.copyTpl(this.templatePath('gulp/tasks/icons.js'), this.destinationPath('gulp/tasks/icons.js'), config);
        }
    },

    installDependencies: function() {
        var devDependencies = [
                'autoprefixer',
                'browser-sync',
                'del',
                'gulp',
                'gulp-clean-css',
                'gulp-eslint',
                'gulp-filter',
                'gulp-if',
                'gulp-jspm',
                'gulp-notify',
                'gulp-postcss',
                'gulp-rename',
                'gulp-replace',
                'gulp-sass',
                'gulp-shell',
                'gulp-sourcemaps',
                'gulp-uglify',
                'gulp-usemin',
                'gulp-util',
                'gulp-wrap',
                'imageoptim-cli',
                'jshint-stylish',
                'merge-stream',
                'pretty-hrtime',
                'require-dir',
                'run-sequence',
                'vinyl-ftp',
                'yargs'
            ],
            dependencies = [];

        if (this.useBrowserify) {
            devDependencies.push(
                'browserify',
                'vinyl-buffer',
                'vinyl-source-stream',
                'watchify'
            );
            dependencies.push(
                'lodash',
                'browserify-jst',
                'browserify-require-async'
            );

            if (this.usejQuery || this.useBackbone) {
                devDependencies.push('browserify-shim');
            }
        }

        if (this.useBabel) {
            devDependencies.push(
                'babelify'
            );
        }

        if (this.usejQuery) {
            dependencies.push('jquery');
        }

        if (this.useBackbone) {
            devDependencies.push(
                'node-underscorify',
                'eslint-plugin-backbone'
            );
            dependencies.push(
                'backbone',
                'backbone.marionette',
                'lodash'
            );
        }

        if (this.useReact) {
            devDependencies.push(
                'babelify',
                'eslint-plugin-react'
            );
            dependencies.push(
                'classnames',
                'react',
                'react-router'
            );
        }

        if (this.useSprites) {
            devDependencies.push(
                'gulp-image-resize',
                'gulp-rename',
                'gulp.spritesmith',
                'merge-stream'
            );
        }

        if (this.useIconFont) {
            devDependencies.push(
                'gulp-replace',
                'gulp-rename'
            );
        }

        this.npmInstall(_.uniq(devDependencies), {saveDev: true});
        this.npmInstall(_.uniq(dependencies), {save: true});
    }
});
