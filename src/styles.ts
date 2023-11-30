/* eslint-disable @typescript-eslint/no-explicit-any */
export const selectStyles = {
	option: (provided: any, state: any) => ({
		...provided,
		color: state.isSelected ? "white" : "black",
	}),
	container: (provided: any) => ({
		...provided,
		width: "100%",
		flex: 1,
	}),
}

export const buttonStyles = {
	display: "flex",
	gap: "0.5em",
	padding: "0.5em",
	marginBottom: "1em",
	border: "1px solid",
	borderRadius: "0.5em",
	color: "white",
	borderColor: "white",
	cursor: "pointer",
}
