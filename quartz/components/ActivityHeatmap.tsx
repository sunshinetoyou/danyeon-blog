import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  title?: string
  targetTag?: string 
}

type DailyActivity = {
  title: string
  slug: string
}

export default ((opts?: Options) => {
  const ActivityHeatmap: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
    const title = opts?.title ?? "Activity"
    
    // 1. 날짜 계산
    const today = new Date()
    const currentDay = today.getDay() 
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + (6 - currentDay))
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (52 * 7) + 1) 

    // 2. 데이터 집계
    const dataset: Record<string, DailyActivity[]> = {}
    allFiles.forEach((file) => {
      if (opts?.targetTag && !file.frontmatter?.tags?.includes(opts.targetTag)) return
      
      const fileDate = file.dates?.created
      if (fileDate && file.frontmatter?.title && file.slug) {
        const offset = fileDate.getTimezoneOffset() * 60000
        const localDate = new Date(fileDate.getTime() - offset)
        const dateStr = localDate.toISOString().split('T')[0]
        
        if (!dataset[dateStr]) dataset[dateStr] = []
        dataset[dateStr].push({ title: file.frontmatter.title, slug: file.slug })
      }
    })

    // 3. 그리드 생성
    const squares = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const offset = currentDate.getTimezoneOffset() * 60000
      const localCurrent = new Date(currentDate.getTime() - offset)
      const dateStr = localCurrent.toISOString().split('T')[0]
      
      const dailyActivities = dataset[dateStr] || []
      const count = dailyActivities.length
      const isFuture = currentDate > today

      let level = 0
      if (!isFuture && count > 0) level = 1
      if (!isFuture && count > 1) level = 2
      if (!isFuture && count > 3) level = 3
      if (!isFuture && count > 5) level = 4

      const tooltipContent = count > 0 ? (
        <ul class="tooltip-list">
          {dailyActivities.map((activity) => (
            <li><a href={`/${activity.slug}`} class="internal">{activity.title}</a></li>
          ))}
        </ul>
      ) : (
        <span class="no-activity">활동 없음</span>
      )

      squares.push(
        <div class={`heatmap-square level-${level} ${isFuture ? "future" : ""}`}>
          {/* 유령 래퍼 */}
          <div class="sq-content-wrapper">
             <div class="tooltip-card">
               <div class="tooltip-header">{dateStr} ({count}건)</div>
               <div class="tooltip-body">{tooltipContent}</div>
             </div>
          </div>
        </div>
      )
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return (
      <div class={`activity-heatmap-container ${displayClass ?? ""}`}>
        <div class="heatmap-title"><span>{title}</span></div>
        <div class="heatmap-content">
          <div class="heatmap-grid">{squares}</div>
        </div>
      </div>
    )
  }

  ActivityHeatmap.css = `
  .activity-heatmap-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1rem;
    padding: 10px;
    background-color: var(--lightgray);
    border-radius: 8px;
    gap: 15px;
  }

  .heatmap-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    border-right: 2px solid var(--gray);
    padding-right: 10px;
  }

  .heatmap-title span {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    font-weight: bold;
    font-size: 0.9rem;
    color: var(--dark);
    white-space: nowrap;
    letter-spacing: 2px;
  }

  .heatmap-content {
    flex-grow: 1;
    overflow: visible !important;
  }
  
  .heatmap-grid {
    display: grid;
    grid-template-rows: repeat(7, 10px); 
    grid-auto-flow: column; 
    gap: 3px; 
    overflow: visible !important;
  }

  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); 
    border-radius: 2px;
    position: relative;
    cursor: pointer;
    /* 마우스 호버 시 가장 앞으로 가져오기 */
    transition: z-index 0s; 
  }
  
  /* ★ 핵심 수정: 호버된 네모칸의 z-index를 높여서 툴팁이 가려지지 않게 함 */
  .heatmap-square:hover {
    z-index: 10001;
  }
  
  .heatmap-square.future { opacity: 0.1; pointer-events: none; }
  [saved-theme="dark"] .heatmap-square { background-color: rgba(255, 255, 255, 0.05); }
  [saved-theme="dark"] .activity-heatmap-container { background-color: var(--lightgray); }

  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }

  /* --- 유령 래퍼 --- */
  .sq-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    overflow: visible;
  }

  /* --- 툴팁 카드 --- */
  .tooltip-card {
    display: none;
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    
    background-color: var(--light) !important;
    border: 1px solid var(--lightgray) !important;
    color: var(--darkgray) !important;
    
    /* 너비 조정 */
    min-width: 180px;
    width: max-content;
    max-width: 280px;
    
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.25);
    z-index: 10002 !important; /* 네모칸보다 더 위에 */
  }

  .heatmap-square:hover .tooltip-card {
    display: block !important;
  }

  /* 툴팁 내부 스타일 (글자 크기 키움) */
  .tooltip-header {
    font-weight: bold;
    border-bottom: 1px solid var(--lightgray);
    margin-bottom: 8px;
    padding-bottom: 5px;
    font-size: 1.0rem; /* 날짜 크게 */
    text-align: center;
  }
  
  .tooltip-body {
    font-size: 0.9rem; /* 본문 크게 */
    max-height: 250px;
    overflow-y: auto;
  }
  
  .tooltip-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .tooltip-list li {
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .tooltip-list li a {
    text-decoration: none;
    color: var(--secondary);
    display: block;
    padding: 2px 0;
  }
  
  .tooltip-list li a:hover {
    text-decoration: underline;
  }
  
  .no-activity {
    color: var(--gray);
    font-style: italic;
    display: block;
    text-align: center;
    padding: 5px 0;
  }
  
  /* 꼬리 모양 */
  .tooltip-card::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -6px;
    border-width: 6px;
    border-style: solid;
    border-color: var(--light) transparent transparent transparent;
  }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor