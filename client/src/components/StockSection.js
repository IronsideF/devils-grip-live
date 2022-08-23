import React from "react";
import StockPile from "./StockPile.js";
import TalonPile from "./TalonPile.js";
import styled from "styled-components";

const StockSection = ({
	talon,
	drawThreeFromStock,
	setFromTalon,
	resetStock,
	deckAtZero,
  selectedCard,
  setSelectedCard
}) => {
	return (
		<Wrapper>
			<StockPile
				drawThreeFromStock={drawThreeFromStock}
				resetStock={resetStock}
				deckAtZero={deckAtZero}
			/>
			<TalonPile talon={talon} setFromTalon={setFromTalon} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
		</Wrapper>
	);
};
const Wrapper = styled("div")`
	border: solid 2px black;
	border-radius: 10px;
	width: 25vw;
  height: 25vh;
	margin: 2%;
	padding: 2%;
	background-color: red;
  display: flex;
`;

export default StockSection;
