// IMPORTS

// CONFIGURING FIREBASE
firebase.initializeApp(firebaseConfig);


// GETTING THE LATEST MOVEMENT
function getLatestEvent() {

	const latestCard = document.getElementById('latestCard');
	const timeText = document.createElement('p');

	const event = firebase.firestore().collection('securepi').doc('info');
	event.onSnapshot(function(doc) {

		if (doc.exists) {
			timeText.innerHTML = "";
			timeText.innerHTML = doc.data().latest_timestamp;
			latestCard.appendChild(timeText);
			console.log(doc.data().latest_timestamp);

		} else {
			timeText.innerHTML = 'No movement yet';
			console.log("No such document!");
		}
	});
}

getLatestEvent();

// GETTING ALL EVENTS OF LAST 48 HOURS
async function getDataEvents() {

	const eventlist = document.getElementById('eventlist');

	const data = firebase.firestore().collection('data');
		await data.onSnapshot(function(querySnapshot){
			eventlist.innerHTML = null;
			if(!querySnapshot.empty){
				querySnapshot.docs.forEach(doc => {
				if(doc.exists){
					const tsToday = Math.round(new Date().getTime()/1000);
					const tsYesterday = tsToday - (48 * 3600);
					console.log('verval: '+ tsYesterday);
					const spottedDate = doc.data().spottedDate;
					console.log('spotted at: ' + spottedDate);
					if (spottedDate > tsYesterday){
						const liTime = document.createElement('li');
						liTime.className = "li-small";
						liTime.innerHTML = `Movement spotted at ${doc.data().timestamp}`;
						eventlist.appendChild(liTime);
		
					} else {
						
						firebase.firestore().collection("data").doc(doc.id).delete().then(function() {
							console.log("Document successfully deleted!");
						}).catch(function(error) {
							console.error("Error removing document: ", error);
						});
					}
				} else {
					eventlist.innerHTML = null;
				}
				
			  });
			  	const discordBtn = document.createElement('button');
				discordBtn.className = "discordBtn";
				const discordLink = document.createElement('a');
				discordLink.target = '_blank';
				discordLink.href = "https://discord.com/channels/673697201121394699/710873200451387423";
				discordLink.innerText = 'Check on discord !';
			
				const emailBtn = document.createElement('button');
				emailBtn.className = "emailBtn";
				const emailLink = document.createElement('a');
				emailLink.target = '_blank';
				emailLink.href = "https://mail.google.com/mail/u/0/#search/motionEye";
				emailLink.innerText = 'Check your e-mail !';

				const buttonDiv = document.createElement('div');
				buttonDiv.className = 'buttonDiv';
				
				discordBtn.appendChild(discordLink);
				emailBtn.appendChild(emailLink);

				buttonDiv.appendChild(discordBtn);
				buttonDiv.appendChild(emailBtn);

				eventlist.appendChild(buttonDiv);
		} else {
				const liTime = document.createElement('li');
				liTime.className = "li-small";
				liTime.innerHTML = `No movement yet`;
				eventlist.appendChild(liTime);
		}
  });
};

  getDataEvents();
