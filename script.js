// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2412-FTB-ET-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;
const playerContainer = document.querySelector("#players");

//state//

const state = {
	players: [],
	singlePlayer: [],
};

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
	try {
		// step 1: fetch data from endpoint specified above in the variable API_URL
		const response = await fetch(`${API_URL}/players`);
		const json = await response.json();
		//step two update the players key in the state object above
		state.players = json.data.players;
		console.log(state);
	} catch (err) {
		console.error("Uh oh, trouble fetching players!", err);
	}
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
	try {
		//get API endpoint for specific player
		const response = await fetch(`${API_URL}/players/${playerId}`);
		const json = await response.json();
		state.singlePlayer = json.data.player;
		return json;
	} catch (err) {
		console.error(
			`Oh no, trouble fetching player #${playerId}!`,
			err
		);
	}
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
	try {
		const response = await fetch(`${API_URL}/players`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(playerObj),
		});
		const newPlayer = await response.json();
		return newPlayer;
	} catch (err) {
		console.error(
			"Oops, something went wrong with adding that player!",
			err
		);
	}
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
	try {
		const response = await fetch(`${API_URL}/players/${playerId}`, {
			method: "DELETE",
		});
		const result = await response.json();
		console.log(result);
	} catch (err) {
		console.error(
			`Whoops, trouble removing player #${playerId} from the roster!`,
			err
		);
	}
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = () => {
	// TODO
	if (!state.players.length) {
		playerContainer.innerHTML = `<p> sorry no a players </p>`;
		return;
	}
	const playerCards = state.players.map((player) => {
		const newCard = document.createElement("li");

		newCard.innerHTML = `<div class="puppyCard"><h2>Player: ${player.name}</h2>
    <p>ID: ${player.id}</p>
    <img src="${player.imageUrl}" alt="picture of${player.name}" />
    <div class="buttons"><button type ="button" class="infoButton" data-id="${player.id}">Info</button>
    <button type ="button" class="deleteButton" data-id="${player.id}">Delete</button></div></div>`;
		return newCard;
	});

	playerContainer.replaceChildren(...playerCards);
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = () => {
	// TODO
	playerContainer.replaceChildren();
	const player = state.singlePlayer;
	const newCard = document.createElement("li");
	newCard.classList.add("puppyCard2");
	newCard.innerHTML = `
  <h2>Player: ${player.name}</h2>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <img src="${player.imageUrl}" alt="picture of${player.name}" />
    <button type ="button" class="allButton" data-id="${player.id}">Back to All Players</button>
    <button type ="button" class="deleteButton" data-id="${player.id}">Delete</button>`;
	playerContainer.replaceChildren(newCard);
};

playerContainer.addEventListener("click", async (e) => {
	if (e.target.classList.contains("deleteButton")) {
		const id = e.target.dataset.id;
		await removePlayer(id);
		// renderAllPlayers();
		init();
	} else if (e.target.classList.contains("infoButton")) {
		const id = e.target.dataset.id;
		await fetchSinglePlayer(id);
		renderSinglePlayer(id);
	} else if (e.target.classList.contains("allButton")) {
		// const id = e.target.dataset.id;
		await renderAllPlayers();
		// init();
	}
});

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const form = document.getElementById("new-player-form");

const renderNewPlayerForm = () => {
	try {
		// TODO
		form.innerHTML = `
    <label> Name <input type="text" name="name" /></label>
    <label> Breed <input type="text" name="breed" /></label> 
    <label> Image URL <input type="text" name="imageUrl" /></label>
    <button type= "submit">Add Puppy</button>`;
	} catch (err) {
		console.error(
			"Uh oh, trouble rendering the new player form!",
			err
		);
	}
};

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const newPup = {
		name: form.name.value,
		breed: form.breed.value,
		imageUrl: form.imageUrl.value,
	};
	await addNewPlayer(newPup);
	await fetchAllPlayers();
	renderAllPlayers();
});

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
	await fetchAllPlayers();
	renderAllPlayers();
	renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
	module.exports = {
		fetchAllPlayers,
		fetchSinglePlayer,
		addNewPlayer,
		removePlayer,
		renderAllPlayers,
		renderSinglePlayer,
		renderNewPlayerForm,
	};
} else {
	init();
}
