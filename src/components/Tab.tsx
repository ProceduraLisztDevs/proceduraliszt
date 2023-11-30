import React from "react"

interface TabProps {
	title: string;
	isActive: boolean;
	onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ title, isActive, onClick }) => {
	const baseStyle = {
		padding: "5px",
		borderTop: "1px solid",
		borderLeft: "1px solid",
		borderRight: "1px solid",
		borderRadius: "5px 5px 0 0",
		minWidth: "100px",
	}

	const activeStyle: React.CSSProperties = {
		...baseStyle,
		borderColor: "white",
		color: "white",
		cursor: "default",
	}

	const inactiveStyle = {
		...baseStyle,
		borderColor: "grey",
		color: "grey",
		marginTop: "5px",
		cursor: "pointer",
		borderBottom: "1px solid white",
	}

	return (
		<div
			style={isActive ? activeStyle : inactiveStyle}
			onClick={onClick}
		>
			{title}
		</div>
	)
}

export default Tab
