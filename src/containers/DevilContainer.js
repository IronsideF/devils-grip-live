import styled from "styled-components";
import React, { useState, useEffect } from "react";
import DevilGrid from "../components/DevilGrid.js";
import StockSection from "../components/StockSection.js";
import Instructions from "../components/Instructions.js";
import { checkIfStackable } from "../services/GameLogic.js";
import PlayButton from "../components/PlayButton.js";
import EndButton from "../components/EndButton.js";
import {
	drawFromDeck,
	resetDeck,
	getScores,
} from "../services/DevilService.js";
import GameOverScreen from "../components/GameOverScreen.js";
import HelperNode from "../components/HelperNode.js";
// import Leaderboard from "../components/Leaderboard.js";

const DevilContainer = () => {
	const [deck, setDeck] = useState(null);
	const [gridCards, setGridCards] = useState(null);
	const [scores, setScores] = useState([]);
	const [talon, setTalon] = useState([]);
	const [deckAtZero, setDeckAtZero] = useState(false);
	const [cardTopX, setCardTopX] = useState("");
	const [cardTopY, setCardTopY] = useState("");
	const [cardBotX, setCardBotX] = useState("");
	const [cardBotY, setCardBotY] = useState("");
	const [score, setScore] = useState(null);
	const [cardArrays, setCardArrays] = useState(null);
	const [gameOver, setGameOver] = useState(false);
	const [selectedCard, setSelectedCard] = useState(null);
	const [difficulty, setDifficulty] = useState("Normal");

	// url to create the custom deck
	const deckUrl =
		"https://www.deckofcardsapi.com/api/deck/new/shuffle/?cards=2S,3S,4S,5S,6S,7S,8S,9S,0S,JS,QS,KS,2C,3C,4C,5C,6C,7C,8C,9C,0C,JC,QC,KC,2D,3D,4D,5D,6D,7D,8D,9D,0D,JD,QD,KD,2H,3H,4H,5H,6H,7H,8H,9H,0H,JH,QH,KH,2S,3S,4S,5S,6S,7S,8S,9S,0S,JS,QS,KS,2C,3C,4C,5C,6C,7C,8C,9C,0C,JC,QC,KC,2D,3D,4D,5D,6D,7D,8D,9D,0D,JD,QD,KD,2H,3H,4H,5H,6H,7H,8H,9H,0H,JH,QH,KH";

	// creates custom deck and draws 24 cards
	const getDeck = () => {
		return fetch(deckUrl)
			.then((res) => res.json())
			.then((result) => {
				setDeck(result);
				console.log(result.deck_id);
				return fetch(
					"https://www.deckofcardsapi.com/api/deck/" +
						result.deck_id +
						"/draw/?count=24"
				);
			})
			.then((res) => res.json())
			.then((cards) => {
				setGrid(cards.cards);
				setScore(72);
			});
	};

	const drawThreeFromStock = () => {
		setCardTopX("");
		setCardTopY("");
		setSelectedCard(null);
		drawFromDeck(deck.deck_id, 3)
			.then((data) => {
				const copyTalon = [...talon].concat(data.cards);
				setTalon(copyTalon);
				return data.remaining;
			})
			.then((deckCount) => {
				if (deckCount === 0) {
					setDeckAtZero(true);
				}
			});
	};

	const stackFromTalon = () => {
		const copyGridCards = [...gridCards];
		copyGridCards[cardBotX][cardBotY].push(cardTopX);
		setGridCards(copyGridCards);
		takeFromTalon();
	};
	const takeFromTalon = () => {
		const copyTalon = [...talon];
		copyTalon.pop();
		setTalon(copyTalon);
		setScore(score - 1);
	};
	const resetStock = () => {
		resetDeck(talon).then((newDeck) => setDeck(newDeck));
		setTalon([]);
		setDeckAtZero(false);
		setCardTopX("");
		setCardTopY("");
		setSelectedCard(null);
	};
	const setCard = (x, y) => {
		if (cardTopX === "") {
			setCardTopX(x);
			setCardTopY(y);
			console.log(cardTopX);
		} else if (cardBotX === "") {
			setCardBotX(x);
			setCardBotY(y);
		} else {
			console.log("no free slots");
		}
	};

	const setFromTalon = (object) => {
		setCardTopX(object);
	};

	const swapGridCards = () => {
		const copyGridCards = [...gridCards];
		const card1 = gridCards[cardTopX][cardTopY];
		const card2 = gridCards[cardBotX][cardBotY];
		copyGridCards[cardTopX][cardTopY] = card2;
		copyGridCards[cardBotX][cardBotY] = card1;
		setGridCards(copyGridCards);
	};
	const stackGridCards = () => {
		if (!deckAtZero) {
			const copyGridCards = [...gridCards];
			const card1 = gridCards[cardTopX][cardTopY];
			copyGridCards[cardBotX][cardBotY] =
				copyGridCards[cardBotX][cardBotY].concat(card1);
			drawFromDeck(deck.deck_id, 1).then((data) => {
				copyGridCards[cardTopX][cardTopY] = data.cards;
				setGridCards(copyGridCards);
				setScore(score - 1);
				if (data.remaining === 0) {
					setDeckAtZero(true);
				}
			});
		} else {
			const copyGridCards = [...gridCards];
			const card1 = gridCards[cardTopX][cardTopY];
			copyGridCards[cardBotX][cardBotY] =
				copyGridCards[cardBotX][cardBotY].concat(card1);
			resetDeck(talon)
				.then((newDeck) => {
					setDeck(newDeck);
					setTalon([]);
					setDeckAtZero(false);
					return newDeck.deck_id;
				})
				.then((deckID) => {
					drawFromDeck(deckID, 1).then((data) => {
						copyGridCards[cardTopX][cardTopY] = data.cards;
						setGridCards(copyGridCards);
						setScore(score - 1);
						if (data.remaining === 0) {
							setDeckAtZero(true);
						}
					});
				});
		}
	};

	const setGrid = (cards) => {
		let count = 0;
		let temp = [
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
			[[[]], [[]], [[]]],
		];
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 3; y++) {
				temp[x][y][0] = cards[count];
				count++;
			}
		}
		setGridCards(temp);
	};
	const getCardArrays = () => {
		let temp = [];
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 8; x++) {
				temp.push({
					cards: gridCards[x][y],
					positionX: x,
					positionY: y,
				});
			}
		}
		setCardArrays(temp);
	};

	const endGame = () => {
		setDeck(null);
		setGridCards(null);
		setTalon([]);
		setDeckAtZero(false);
		setCardTopX("");
		setCardTopY("");
		setCardBotX("");
		setCardBotY("");
		setCardArrays(null);
		setSelectedCard(null);
		setGameOver(true);
	};

	const exitGameOver = () => {
		setGameOver(false);
		setScore(null);
		setDifficulty("Normal");
	};

	// const addScore = (score) => {
	// 	console.log(score);
	// 	let temp = [...scores];
	// 	temp.push(score);
	// 	let sorted = sortScores(temp);
	// 	setScores(sorted);
	// };

	useEffect(() => {
		if (!(cardBotX === "") && !cardTopX.code) {
			const canStack = checkIfStackable(
				gridCards[cardTopX][cardTopY],
				gridCards[cardBotX][cardBotY],
				difficulty
			);
			if (canStack) {
				stackGridCards();
				setCardTopX("");
				setCardTopY("");
				setCardBotX("");
				setCardBotY("");
				setSelectedCard(null);
			} else {
				swapGridCards();
				setCardTopX("");
				setCardTopY("");
				setCardBotX("");
				setCardBotY("");
				setSelectedCard(null);
			}
		} else if (!(cardBotX === "")) {
			const canStack = checkIfStackable(
				[cardTopX],
				gridCards[cardBotX][cardBotY],
				difficulty
			);
			if (canStack) {
				stackFromTalon();
				setCardTopX("");
				setCardBotX("");
				setCardBotY("");
				setSelectedCard(null);
			} else {
				setCardTopX("");
				setCardTopY("");
				setCardBotX("");
				setCardBotY("");
				setSelectedCard(null);
			}
		}
	}, [cardBotX]);

	// const sortScores = (scores) => {
	// 	let sortedScores = scores;
	// 	for (let x = 0; x < sortedScores.length; x++) {
	// 		for (let y = 0; y < sortedScores.length - 1; y++) {
	// 			if (sortedScores[y].score > sortedScores[y + 1].score) {
	// 				let temp = sortedScores[y];
	// 				sortedScores[y] = sortedScores[y + 1];
	// 				sortedScores[y + 1] = temp;
	// 			}
	// 		}
	// 	}
	// 	return sortedScores;
	// };

	const changeDifficulty = (event) => {
		setDifficulty(event.target.value);
	};

	useEffect(() => {
		if (gridCards) {
			getCardArrays();
		}
	}, [gridCards]);

	// useEffect(() => {
	// 	getScores().then((data) => {
	// 		let sortedScores = sortScores(data);
	// 		setScores(sortedScores);
	// 	});
	// }, []);

	return (
		<Wrapper>
			<Title>Devil's Grip</Title>
			{gameOver ? (
				<GameOverScreen
					score={score}
					exitGameOver={exitGameOver}
					// addScore={addScore}
					difficulty={difficulty}
				/>
			) : (
				<>
					{cardArrays ? (
						<>
							<HeadAboveGrid>
								<Score>Difficulty: {difficulty}</Score>

								<EndButton endGame={endGame} />
								<HelperNode />
								<Score id="score">Current Score: {score}</Score>
							</HeadAboveGrid>
							<DevilGrid
								cardArrays={cardArrays}
								setCard={setCard}
								setSelectedCard={setSelectedCard}
								selectedCard={selectedCard}
								setCardTopX={setCardTopX}
								setCardTopY={setCardTopY}
							/>
						</>
					) : (
						<>
							<PlayButton getDeck={getDeck} />
							<DifficultyLabel HTMLfor="difficulty">
								Choose a difficulty:
							</DifficultyLabel>
							<DifficultySelect
								name="difficulty"
								id="difficulty"
								onChange={changeDifficulty}
							>
								<option defaultValue="Normal">
									Normal Rules
								</option>
								<option value="Colours">
									Matching Colours
								</option>
							</DifficultySelect>
						</>
					)}
					{deck ? (
						<StockSection
							talon={talon}
							drawThreeFromStock={drawThreeFromStock}
							setFromTalon={setFromTalon}
							resetStock={resetStock}
							deckAtZero={deckAtZero}
							setSelectedCard={setSelectedCard}
							selectedCard={selectedCard}
						/>
					) : null}
				</>
			)}
			{gameOver ? null : <Instructions />}
		</Wrapper>
	);
};
// CSS styling for container
const Wrapper = styled("div")`
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const HeadAboveGrid = styled("div")`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;
const Score = styled("h4")`
	margin: 1% 0;
	width: max-content;
	font-size: 3vh;
	font-weight: bold;
	color: white;
`;

const Title = styled("h1")`
	font-family: Gypsy;
	font-size: 15vh;
	margin: 0;
	color: red;
`;

const DifficultyLabel = styled("label")`
	font-size: 3vh;
	font-weight: bold;
	color: white;
`;

const DifficultySelect = styled("select")`
	border-radius: 10px;
	background-color: red;
	width: 18%;
	font-size: 3vh;
	font-weight: bold;
	padding: 0.5%;
	margin-bottom: 2%;
	text-align: center;
`;

export default DevilContainer;
