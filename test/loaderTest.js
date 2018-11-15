require('should');

const loader = require('../index');

// TODO remove this disable after tests are finished
/* eslint-disable max-len */

describe('loader', () => {
  it('should convert to requires', () => {
    const loaderOutput = loader.call({}, 'Text <img src = "image.png" > <img src = "~bootstrap-img" > Text');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":["Text ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./image.png") + "","t":13,"g":1}]}," ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("bootstrap-img") + "","t":13,"g":1}]}," Text"]}');
  });

  it('should accept attrs from query', () => {
    const loaderOutput = loader.call({
      query: '?attrs=script:src',
    }, 'Text <script src="script.js"><img src="image.png">');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":["Text ",{"t":7,"e":"script","m":[{"n":"src","f":"" + require("./script.js") + "","t":13,"g":1}],"f":["<img src=\\"image.png\\">"]}]}');
  });

  it('should accept attrs from query (space separated)', () => {
    const loaderOutput = loader.call({
      query: '?attrs=script:src img:src',
    }, 'Text <script src="script.js"><img src="image.png">');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":["Text ",{"t":7,"e":"script","m":[{"n":"src","f":"" + require("./script.js") + "","t":13,"g":1}],"f":["<img src=\\"" + require("./image.png") + "\\">"]}]}');
  });

  // it("should accept attrs from query (multiple)", function() {
  // loader.call({
  // query: "?attrs[]=script:src&attrs[]=img:src"
  // }, 'Text <script src="script.js"><img src="image.png">').should.be.eql(
  // 'module.exports = "Text <script src=\\"" + require("./script.js") + "\\"><img src=\\"" + require("./image.png") + "\\">";'
  // );
  // });

  // it("should accept :attribute (empty tag) from query", function() {
  // loader.call({
  // query: "?attrs[]=:custom-src"
  // }, 'Text <custom-element custom-src="image1.png"><custom-img custom-src="image2.png"/></custom-element>').should.be.eql(
  // 'module.exports = "Text <custom-element custom-src=\\"" + require("./image1.png") + "\\"><custom-img custom-src=\\"" + require("./image2.png") + "\\"/></custom-element>";'
  // );
  // });

  // it("should accept :attribute (empty tag) from query and not collide with similar attributes", function() {
  // loader.call({
  // query: "?attrs[]=:custom-src"
  // }, 'Text <custom-element custom-src="image1.png" custom-src-other="other.png"><custom-img custom-src="image2.png"/></custom-element>').should.be.eql(
  // 'module.exports = "Text <custom-element custom-src=\\"" + require("./image1.png") + "\\" custom-src-other=\\"other.png\\"><custom-img custom-src=\\"" + require("./image2.png") + "\\"/></custom-element>";'
  // );
  // });

  // it("should not make bad things with templates", function() {
  // loader.call({}, '<h3>#{number} {customer}</h3>\n<p>   {title}   </p>').should.be.eql(
  // 'module.exports = "<h3>#{number} {customer}</h3>\\n<p>   {title}   </p>";'
  // );
  // });

  it('should not translate root-relative urls (without root query)', () => {
    const loaderOutput = loader.call({}, 'Text <img src="/image.png">');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":["Text ",{"t":7,"e":"img","m":[{"n":"src","f":"/image.png","t":13,"g":1}]}]}');
  });

  it('should ignore hash fragments in URLs', () => {
    const loaderOutput = loader.call({}, '<img src="icons.svg#hash">');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":[{"t":7,"e":"img","m":[{"n":"src","f":"" + require("./icons.svg") + "#hash","t":13,"g":1}]}]}');
  });

  it("should ignore anchor with 'mailto:' in the href attribute", () => {
    const loaderOutput = loader.call({}, '<a href="mailto:username@exampledomain.com"></a>');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":[{"t":7,"e":"a","m":[{"n":"href","f":"mailto:username@exampledomain.com","t":13,"g":1}]}]}');
  });

  it('should accept root from query', () => {
    const loaderOutput = loader.call({
      query: '?root=/test',
    }, 'Text <img src="/image.png">');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":["Text ",{"t":7,"e":"img","m":[{"n":"src","f":"" + require("/test/image.png") + "","t":13,"g":1}]}]}');
  });

  it('shouldn\'t produces functions when `csp` parserOperions is not set', () => {
    const loaderOutput = loader.call({
      options: {
        htmlLoader: {
          parserOptions: {
            csp: false,
          },
        },
      },
    }, '<div>{{test + 1}}</div>');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":[{"t":7,"e":"div","f":[{"t":2,"x":{"r":["test"],"s":"_0+1"}}]}]}');
  });

  it('should produces functions when `csp` parserOperions is set', () => {
    const loaderOutput = loader.call({
      options: {
        htmlLoader: {
          parserOptions: {
            csp: true,
          },
        },
      },
    }, '<div>{{test + 1}}</div>');

    loaderOutput.should.be.eql('module.exports = {"v":4,"t":[{"t":7,"e":"div","f":[{"t":2,"x":{"r":["test"],"s":"_0+1"}}]}],"e":{"_0+1":function (_0){return(_0+1);}}}');
  });

  it('should account for `templateSpace` option', () => {
    const loaderOutput = loader.call({
      options: {
        htmlLoader: {
          templateSpace: 1,
        },
      },
    }, '<div>Text</div>');

    loaderOutput.should.be.eql('module.exports = {\n "v": 4,\n "t": [\n  {\n   "t": 7,\n   "e": "div",\n   "f": [\n    "Text"\n   ]\n  }\n ]\n}');
  });
});

describe('loader – minimize', () => {
  // it("should minimize", function() {
  // loader.call({
  // minimize: true
  // }, '<!-- comment --><h3 customAttr="">#{number} {customer}</h3>\n<p>   {title}   </p>\n\t <!-- comment --> <img src="image.png" />').should.be.eql(
  // 'module.exports = "<h3 customattr=\\"\\">#{number} {customer}</h3> <p> {title} </p> <img src=\" + require("./image.png") + \" />";'
  // );
  // });
  // // https://github.com/webpack/webpack/issues/752
  // it("should not remove attributes by default", function() {
  // loader.call({
  // minimize: true
  // }, '<input type="text" />').should.be.eql(
  // 'module.exports = "<input type=text />";'
  // );
  // });
  // it("should preserve comments", function() {
  // loader.call({
  // minimize: true,
  // query: "?-removeComments"
  // }, '<!-- comment --><h3 customAttr="">#{number} {customer}</h3><p>{title}</p><!-- comment --><img src="image.png" />').should.be.eql(
  // 'module.exports = "<!-- comment --><h3 customattr=\\"\\">#{number} {customer}</h3><p>{title}</p><!-- comment --><img src=\" + require("./image.png") + \" />";'
  // );
  // });
  // it("should preserve escaped quotes", function() {
  // loader.call({}, '<script>{"json": "with \\"quotes\\" in value"}</script>').should.be.eql(
  // 'module.exports = "<script>{\\\"json\\\": \\\"with \\\\\\\"quotes\\\\\\\" in value\\\"}</script>";'
  // );
  // })

  // it("should preserve comments and white spaces when minimizing (via webpack config property)", function() {
  // loader.call({
  // minimize: true,
  // options: {
  // htmlLoader: {
  // removeComments: false,
  // collapseWhitespace: false
  // }
  // }
  // }, '<!-- comment --><h3 customAttr="">#{number} {customer}</h3><p>{title}</p>    <!-- comment -->    <img src="image.png" />').should.be.eql(
  // 'module.exports = "<!-- comment --><h3 customattr=\\"\\">#{number} {customer}</h3><p>{title}</p>    <!-- comment -->    <img src=\" + require("./image.png") + \" />";'
  // );
  // });

  // it("should preserve comments and white spaces when minizing (via webpack config property)", function() {
  // loader.call({
  // options: {
  // htmlLoader: {
  // minimize: true,
  // removeComments: false,
  // collapseWhitespace: false
  // }
  // }
  // }, '<!-- comment --><h3 customAttr="">#{number} {customer}</h3><p>{title}</p>    <!-- comment -->    <img src="image.png" />').should.be.eql(
  // 'module.exports = "<!-- comment --><h3 customattr=\\"\\">#{number} {customer}</h3><p>{title}</p>    <!-- comment -->    <img src=\" + require("./image.png") + \" />";'
  // );
  // });

  // it("should treat attributes as case sensitive", function() {
  // loader.call({
  // minimize: true,
  // query: "?caseSensitive"
  // }, '<!-- comment --><h3 customAttr="">#{number} {customer}</h3><p>{title}</p><!-- comment --><img src="image.png" />').should.be.eql(
  // 'module.exports = "<h3 customAttr=\\"\\">#{number} {customer}</h3><p>{title}</p><img src=\" + require("./image.png") + \" />";'
  // );
  // });

  // it("should accept complex options via a webpack config property", function() {
  // loader.call({
  // minimize: true,
  // options: {
  // htmlLoader: {
  // ignoreCustomFragments: [/\{\{.*?}}/]
  // }
  // }
  // }, '<h3>{{ count <= 1 ? "foo" : "bar" }}</h3>').should.be.eql(
  // 'module.exports = "<h3>{{ count <= 1 ? \\"foo\\" : \\"bar\\" }}</h3>";'
  // );
  // });

  // it("should allow the webpack config property name to be configured", function() {
  // loader.call({
  // minimize: true,
  // options: {
  // htmlLoaderSuperSpecialConfig: {
  // ignoreCustomFragments: [/\{\{.*?}}/]
  // }
  // },
  // query: '?config=htmlLoaderSuperSpecialConfig'
  // }, '<h3>{{ count <= 1 ? "foo" : "bar" }}</h3>').should.be.eql(
  // 'module.exports = "<h3>{{ count <= 1 ? \\"foo\\" : \\"bar\\" }}</h3>";'
  // );
  // });
});

describe('loader – interpolate', () => {
  // it("should ignore interpolations by default", function() {
  // loader.call({}, '<img src="${"Hello " + (1+1)}">').should.be.eql(
  // 'module.exports = "<img src=\\"${\\"Hello \\" + (1+1)}\\">";'
  // );
  // });

  // it("should enable interpolations when using interpolate flag", function() {
  // loader.call({
  // query: "?interpolate"
  // }, '<img src="${"Hello " + (1+1)}">').should.be.eql(
  // 'module.exports = "<img src=\\"" + ("Hello " + (1 + 1)) + "\\">";'
  // );
  // });

  // it("should not change handling of quotes when interpolation is enabled", function() {
  // loader.call({
  // query: "?interpolate"
  // }, '<script>{"json": "with \\"quotes\\" in value"}</script>').should.be.eql(
  // 'module.exports = "<script>{\\\"json\\\": \\\"with \\\\\\\"quotes\\\\\\\" in value\\\"}</script>";'
  // );
  // })

  // it("should enable interpolations when using interpolate=require flag and only require function to be translate", function() {
  // loader.call({
  // query: "?interpolate=require"
  // }, '<a href="${list.href}"><img src="${require("./test.jpg")}" /></a>').should.be.eql(
  // 'module.exports = "<a href=\\"${list.href}\\"><img src=\\"" + require("./test.jpg") + "\\" /></a>";'
  // );
  // });
});

describe('loader – esport ES', () => {
  it('should export as default export for es6to5 transpilation', () => {
    const loaderOutput = loader.call({
      query: '?exportAsDefault',
    }, '<p>Hello world!</p>');

    loaderOutput.should.be.eql('exports.default = {"v":4,"t":[{"t":7,"e":"p","f":["Hello world!"]}]}');
  });

  it('should export as es6 default export', () => {
    const loaderOutput = loader.call({
      query: '?exportAsEs6Default',
    }, '<p>Hello world!</p>');

    loaderOutput.should.be.eql('export default {"v":4,"t":[{"t":7,"e":"p","f":["Hello world!"]}]}');
  });
});
