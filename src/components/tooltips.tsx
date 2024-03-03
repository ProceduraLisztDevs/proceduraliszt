interface TooltipProps {
	title: string
	hint: string
	style?: React.CSSProperties
}

export function H2tooltip ({title, hint, style}: TooltipProps) {
	return <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "0.5em"}}>
		<h2 style={style}>{title}</h2>
		<img src="hint.png" title={hint} width="36px" height="36px" />
	</div>
}

export function H3tooltip ({title, hint, style}: TooltipProps) {
	return <div style={{display: "flex", flexDirection: "row", alignItems: "start", justifyContent: "center",  gap: "0.5em"}}>
		<h3 style={style}>{title}</h3>
		<img src="hint.png" title={hint} width="30px" height="30px" />
	</div>
}

export function H4tooltip ({title, hint, style}: TooltipProps) {
	return <div style={{display: "flex", flexDirection: "row", alignItems: "start", justifyContent: "center",  gap: "0.5em"}}>
		<h4 style={style}>{title}</h4>
		<img src="hint.png" title={hint} width="24px" height="24px" />
	</div>
}