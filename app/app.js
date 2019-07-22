// Generating content based on the template
var template = "<article>\n\
	<img src='data/img_entries/SLUG.jpg'>\n\
	<h3>#POS. NAME</h3>\n\
	<ul>\n\
	<li><span>Author:</span> <strong>AUTHOR</strong></li>\n\
	<li><span>Twitter:</span> <a href='https://twitter.com/TWITTER'>@TWITTER</a></li>\n\
	<li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>\n\
	<li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>\n\
	<li><span>More:</span> <a href='https://github.com/wes-o/pwa/SLUG'>github.com/wes-o/pwa</a></li>\n\
	</ul>\n\
</article>";
var content = '';
for(var i=0; i<entries.length; i++) {
	var entry = template.replace(/POS/g,(i+1))
		.replace(/SLUG/g,entries[i].slug)
		.replace(/NAME/g,entries[i].name)
		.replace(/AUTHOR/g,entries[i].author)
		.replace(/TWITTER/g,entries[i].twitter)
		.replace(/WEBSITE/g,entries[i].website)
		.replace(/GITHUB/g,entries[i].github);
	content += entry;
};
document.getElementById('content').innerHTML = content;


// Registering Service Worker
if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js');
};

// Requesting permission for Notifications
Notification.requestPermission().then(function(result) {
	if(result === 'granted') {
		randomNotification();
	}
});

// Setting up random Notification
function randomNotification() {
	var randomItem = Math.floor(Math.random()*entries.length);
	var notifTitle = entries[randomItem].name;
	var notifBody = 'Created by '+ entries[randomItem].author+'.';
	var notifImg = 'data/img_entries/'+ entries[randomItem].slug+'.jpg';
	var options = {
		body: notifBody,
		icon: notifImg
	}
	var notif = new Notification(notifTitle, options);
	setTimeout(randomNotification, 30000);
}