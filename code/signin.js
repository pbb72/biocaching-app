function signIn(evt) {
	evt.preventDefault();

	// not using sendRequest yet, because that routine redirects to signin 
	// on authentication error, while we need to show a message instead
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("POST", api_root + "/users/sign_in", true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("X-User-Api-Key", "0b4d859e740d2978b98a13e2b9e130d8");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status >= 200 && xhr.status < 300)
				getAuthentication(JSON.parse(xhr.responseText));
			else
				alert("Authentication error. (Status " + xhr.status + ")");
		}
	}
	xhr.send(JSON.stringify({
		user : {
			email    : document.getElementById("email").value, 
			password : document.getElementById("password").value
		}
	}));
}

function getAuthentication(response) {
	localStorage.setItem("biocaching:email", response.email);
	if (response.accepted_terms_at) {
		// user has accepted terms
		localStorage.setItem("biocaching:token", response.authentication_token);
		localStorage.setItem("biocaching:user" , response.id);
		window.location.replace(document.getElementById("sign-in").action);
		// not using form submit, because that would cause the form to be stored in browse history
	} else {
		// let user accept terms before permanently storing sign in data
		sessionStorage.setItem("biocaching:token", response.authentication_token);
		sessionStorage.setItem("biocaching:user" , response.id);
		window.location.replace(new URI("terms.html").search({source: document.getElementById("sign-in").action}));
	}
}

(function() {
	var query = new URI().query(true); // URI.js

	document.getElementById("email").value = localStorage.getItem("biocaching:email");
	document.getElementById("sign-in").action = (query.source ? query.source : (window.location.origin + "/app/"));
	document.getElementById("sign-in").addEventListener("submit", signIn, false);

})();
