const tabs = [
  { id: 'browse', label: 'Browse' },
  { id: 'post', label: 'Post a Gig' },
  { id: 'posts', label: 'My Posts' },
  { id: 'applications', label: 'My Applications' },
]

function GigTabs({ activeTab, onChange }) {
  return (
    <div className="tabs tabs-boxed w-full overflow-x-auto bg-base-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab whitespace-nowrap ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default GigTabs
