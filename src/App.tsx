import "./App.css"
import { AppProvider } from "./AppState"
import { Output } from "./components/Output"
import { GlobalSettings } from "./components/GlobalSettings"
import { ChordConstraints } from "./components/ChordConstraints"
import { ChordTiles } from "./components/ChordTiles"
import { NoteConstraints } from "./components/NoteConstraints"
import { NoteTiles } from "./components/NoteTiles"
import TabComponent from "./components/TabComponent"
import { ChordPrototypesPage } from "./components/ChordPrototypesPage"
import { SectionsPage } from "./components/SectionsPage"
import { SectionTiles } from "./components/SectionTiles"
import { Configs } from "./components/Configs"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Results } from "./results/Results"
import { Tutorial } from "./components/Tutorial"

function App() {

	const tabs = [
		{
			title: "Main",
			content: <>
				<div className="main-div">
					<GlobalSettings />
					<div className="main-column">
						<SectionTiles />
					</div>
					<div className="main-column">
						<ChordTiles />
						<ChordConstraints />
					</div>
					<div className="main-column">
						<NoteTiles />
						<NoteConstraints />
					</div>
				</div>
			</>
		},
		{
			title: "Sections",
			content: <SectionsPage />
		},
		{
			title: "Chord prototypes",
			content: <ChordPrototypesPage />
		},
		{
			title: "Configs",
			content: <Configs />
		},
		{
			title: "Tutorial",
			content: <Tutorial />
		}
	]

	const PLApp = () => 
		<AppProvider>
			<TabComponent tabs={tabs} />
			<Output/>
		</AppProvider>

	return (
		<BrowserRouter basename="/proceduraliszt/">
			<Routes>
				<Route index path="" element={<PLApp/>} />
				<Route path="results" element={<Results/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App