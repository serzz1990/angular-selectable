
var pkg = require('./package.json');

var gulp = require('gulp');

var webpack = require('webpack');

var webpackStream = require('webpack-stream');

var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');






gulp.task( 'build', function() {
        return gulp
            .src('./src/index.js')
            .pipe(webpackStream({
                module: {
                    loaders: [
                        // https://github.com/babel/babel-loader
                        {test: /\.js$/, loader: 'babel'}
                    ]
                },
                plugins: [

                    new ngAnnotatePlugin({
                        add: true
                    }),

                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    })

                ],
                devtool: 'source-map',
                debug: true,
                output: {
                    library: pkg.name,
                    libraryTarget: 'umd',
                    filename: pkg.name + '.min.js'
                }
            }))

            .pipe(gulp.dest('./dist'));
    }
);



gulp.task('watch', ['build'],function() {
        return gulp.watch(['./src/**/*'], ['build']);
    }
);


gulp.task('default', ['build']);