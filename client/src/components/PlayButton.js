import React from "react";
import styled from "styled-components";

const PlayButton = ({ getDeck }) => {
	const handleStart = () => {
		getDeck();
	};

	return (
		<StartButton name="" onClick={handleStart}>
			Start Game
		</StartButton>
	);
};

const StartButton = styled("div")`
	text-align: center;
	font-size: 1.5rem;
	font-weight: bold;
	margin: 1%;
	width: 10%;
	height: 30px;
	margin: 1%;
	border: 2px solid black;
	border-radius: 10px;
	background-color: green;
	padding: 0.5%;
	box-shadow: 5px 5px 3px;
	&:hover {
		cursor: pointer;

		box-shadow: 5px 5px 5px yellow;
	}
`;
export default PlayButton;
