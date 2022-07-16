import { ReactNode, useEffect, useState } from "react"
import style from "./styles.module.css";

type TabsType = {
  tabs: Array<TabType>
}
type TabType = {
  title: string | ReactNode,
  component: ReactNode
}

const Tabs = ({ tabs }: TabsType) => {
  const [currIdx, setCurrIdx] = useState(0)
  const [activeTab, setActiveTab] = useState(tabs[currIdx]);

  useEffect(() => {
    setActiveTab(tabs[currIdx]);
  }, [currIdx])

  return (
    <div className={style.tabs}>
      <div className={style.header}>
        {tabs.map(({ title }, index) => (
          <button
            key={index}
            onClick={() => setCurrIdx(index)}
            className={index == currIdx ? style.active : ''}>
            {title}
          </button>
        ))}
      </div>
      <div className={style.body}>
        {activeTab.component}
      </div>
    </div>
  )
}

export default Tabs;