function openUrl(url) {
	NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
}

export function report(context) {
	openUrl("https://github.com/azhsetiawan/sketch-copycat/issues/new");
}

export function donate(context) {
	openUrl("https://www.paypal.me/asharsetiawan");
}