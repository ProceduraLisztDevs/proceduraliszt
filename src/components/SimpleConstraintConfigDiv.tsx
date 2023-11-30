interface SimpleConstraintConfigDivProps {
	children: React.ReactNode
}

export function SimpleConstraintConfigDiv({ children }: SimpleConstraintConfigDivProps) {
	return (
		<div className="simple-constraint-config">
			{children}
		</div>
	)
}