import sanitizeHtml from 'sanitize-html';

// Allow only a super restricted set of tags and attributes for html raw data
// coming from FT Airtable
export const sanitize = html => {
	return sanitizeHtml(html, {
		allowedTags: ['b', 'i', 'em', 'strong', 'a', 'div', 'ul', 'li', 'ol', 'p', 'hr'],
		allowedAttributes: {
			a: ['href']
		}
	});
};

export default sanitize;
