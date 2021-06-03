/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
 let toolazyStringToHTML = function (str) {
	var dom = document.createElement('template');
	dom.innerHTML = str;
	return dom.content;
};

let isGutenbergActive = function () {
	// return wp.data !== undefined;
	return document.body.classList.contains( 'block-editor-page' );
}