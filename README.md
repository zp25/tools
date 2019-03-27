# tools

[![Build Status](https://travis-ci.org/zp25/tools.svg?branch=master)](https://travis-ci.org/zp25/tools)

克隆并进入目录

~~~bash
npm install
npm link
~~~

获取帮助

~~~bash
tools -h
~~~

base64编码/解码

~~~bash
tools base64 encode <string>
tools base64 decode <string> --encoding=utf8

# 获取帮助
tools base64 -h
~~~

encoding可选'utf8'(默认), 'utf16le'

图片优化

~~~bash
tools imagemin webp --input=./src --output=./dest
tools imagemin compress --quality=70 --optipng

# 获取帮助
tools imagemin -h
~~~

选择输出webp或压缩。默认pngquant有损，可选optipng无损

## 文档

使用jsdoc导出文档

~~~bash
npm run jsdoc
~~~

进入docs/目录查看

## 资源

+ [imagemin](https://github.com/imagemin/imagemin "imagemin")
+ [imagemin-webp](https://github.com/imagemin/imagemin-webp "imagemin-webp")
+ [imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg "imagemin-mozjpeg")
+ [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran "imagemin-jpegtran")
+ [Experimenting with mozjpeg 2.0](https://blog.cloudflare.com/experimenting-with-mozjpeg-2-0/ "Experimenting with mozjpeg 2.0")
+ [imagemin-optipng lossless](https://github.com/imagemin/imagemin-optipng "imagemin-optipng")
+ [imagemin-pngquant lossy](https://github.com/imagemin/imagemin-pngquant "imagemin-pngquant")
+ [imagemin-svgo](https://github.com/imagemin/imagemin-svgo "imagemin-svgo")
