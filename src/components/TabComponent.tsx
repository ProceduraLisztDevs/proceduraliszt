import React, { useState } from "react"
import Tab from "./Tab"

interface TabItem {
	title: string;
	content: JSX.Element;
}

interface TabComponentProps {
	tabs: TabItem[];
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs }) => {
	const [activeTabIndex, setActiveTabIndex] = useState(0)

	return (
		<div style={{width: "90vw", marginBottom:"20vh", marginTop: 0}}>
			<div style={{ display: "flex" }}>
				{tabs.map((tab, index) => (
					<>
						<div key={2 * index} style={{ width: "10px", borderBottom: "1px white solid" }} />
						<Tab
							key={2 * index + 1}
							title={tab.title}
							isActive={index === activeTabIndex}
							onClick={() => setActiveTabIndex(index)}
						/>
					</>
				))}
				<div style={{ flexGrow: 10, borderBottom: "1px white solid" }} />
			</div>

			<div>
				{{ ...tabs[activeTabIndex].content, key: activeTabIndex }}
			</div>
		</div>
	)
}

export default TabComponent
