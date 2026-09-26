// Reference: https://prettier.io/docs/en/options.html
module.exports = {
	// Wrap when exceeding the specified value
	printWidth: 150,
	// Tab width
	tabWidth: 2,
	// Indent with tabs
	useTabs: true,
	// No semicolon at the end of statements
	semi: false,
	// Use single quotes
	singleQuote: true,
	// Use single quotes instead of double quotes in JSX files
	jsxSingleQuote: true,
	// Whether to add a trailing comma after the last element of an object or array, optional values"[none: do not append | es5: append]
	trailingComma: 'none',
	// Add spaces between the brackets of objects and arrays and the code "{ foo: bar }"
	bracketSpacing: true,
	// Multi-line JSX elements > Place at the end of the last line instead of wrapping
	jsxBracketSameLine: true,
	//(x) => {} Whether an arrow function with a single parameter needs parentheses, optional values"[always:(x) => x | avoid: x => x]
	arrowParens: 'avoid',
	// Use the default line wrapping standard, optional values"[always|never|preserve]"
	proseWrap: 'preserve',
	// Specify the global whitespace sensitivity of HTML files, optional values"[css|strict|ignore]"
	htmlWhitespaceSensitivity: 'css',
	// Line ending at the end, default lf, optional values"[auto|lf|crlf|cr]"
	endOfLine: 'auto'
}
