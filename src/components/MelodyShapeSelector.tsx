import { useEffect, useState } from "react"
import { MelodyShape, MelodyStep, } from "../wfc/constraints/concepts/MelodyShape"

interface MelodyStepTileProps {
	step: MelodyStep
	setStep: (step: MelodyStep) => void
}

function MelodyStepTile({ step, setStep }: MelodyStepTileProps) {
	const stepToSymbol = (step: MelodyStep) => {
		switch (step) {
			case "wildcard": return "*"
			case "ascend": return "↗"
			case "stagnate": return "→"
			case "descend": return "↘"
		}
	}

	const handleChange = () => {
		switch (step) {
			case "wildcard": setStep("ascend"); break
			case "ascend": setStep("stagnate"); break
			case "stagnate": setStep("descend"); break
			case "descend": setStep("wildcard"); break
		}
	}

	return <button onClick={handleChange}>{stepToSymbol(step)}</button>
}

interface MelodyShapeSelectorProps {
	size: number
	setResult: (shape: MelodyShape) => void
	startValue?: MelodyShape
}

export function MelodyShapeSelector({ size, setResult, startValue }: MelodyShapeSelectorProps) {
	const wildcard: MelodyStep = "wildcard"
	const [shape, setShape] = useState<MelodyShape>(startValue || Array(size).fill(wildcard))

	useEffect(() => {
		setResult(shape)
	}, [])

	useEffect(() => {
		if (size === shape.length) return
		if (size > shape.length) setShape([...shape, ...Array(size - shape.length).fill(wildcard)])
		else setShape(shape.slice(0, size))
	}, [size])

	const setStep = (index: number, step: MelodyStep) => {
		const newShape = [...shape]
		newShape[index] = step
		setShape(newShape)
		setResult(newShape)
	}

	return <div style={{ paddingBottom: "0.5em" }}>
		{shape.map((step, index) => <MelodyStepTile key={index} step={step} setStep={(step) => setStep(index, step)} />)}
	</div>
}