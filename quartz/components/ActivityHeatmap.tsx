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
        
        if (!dataset[dateStr]) {
            dataset[dateStr] = []
        }
        dataset[dateStr].push({
            title: file.frontmatter.title,
            slug: file.slug,
        })
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

      // 툴팁 내용
      const tooltipContent = count > 0 ? (
        <ul class="tooltip-list">
          {dailyActivities.map((activity) => (
            <li>
              <a href={`/${activity.slug}`} class="internal">{activity.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <span class="no-activity">활동 없음</span>
      )

      squares.push(
        <div class={`heatmap-square level-${level} ${isFuture ? "future" : ""}`}>
          <div class="tooltip-container">
            <div class="tooltip-header">{dateStr} ({count}건)</div>
            <div class="tooltip-body">
              {tooltipContent}
            </div>
          </div>
        </div>
      )
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return (
      <div class={`activity-heatmap-container ${displayClass ?? ""}`}>
        <div class="heatmap-title">
          <span>{title}</span>
        </div>
        <div class="heatmap-content">
          <div class="heatmap-grid">
            {squares}
          </div>
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
    position: relative; /* 툴팁 위치 기준점 보호 */
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
    overflow-x: auto;
    overflow-y: visible; /* 툴팁이 잘리지 않도록 설정 */
  }
  
  .heatmap-grid {
    display: grid;
    grid-template-rows: repeat(7, 10px); 
    grid-auto-flow: column; 
    gap: 3px; 
    overflow: visible; /* 그리드 밖으로 툴팁이 나가도 보이게 */
  }

  /* 네모칸 스타일 */
  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); 
    border-radius: 2px;
    position: relative; /* 툴팁의 절대 위치 기준점 */
    overflow: visible;  /* 내부의 툴팁이 밖으로 튀어나오게 허용 */
    cursor: pointer;
  }
  
  .heatmap-square.future { opacity: 0.1; pointer-events: none; }
  [saved-theme="dark"] .heatmap-square { background-color: rgba(255, 255, 255, 0.05); }
  [saved-theme="dark"] .activity-heatmap-container { background-color: var(--lightgray); }

  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }

  /* ★★★ 툴팁 스타일 (수정됨) ★★★ */
  .tooltip-container {
    display: none; /* ★ 중요: 평소엔 아예 렌더링 공간을 차지하지 않음 */
    position: absolute;
    bottom: 14px; /* 네모칸 바로 위 */
    left: 50%;
    transform: translateX(-50%); /* 가운데 정렬 */
    
    background-color: var(--light);
    color: var(--darkgray);
    border: 1px solid var(--lightgray);
    border-radius: 6px;
    padding: 8px 12px;
    z-index: 9999; /* 제일 위에 뜨도록 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    width: max-content; /* 내용에 맞게 너비 조절 */
    min-width: 120px;
    max-width: 220px;
    
    pointer-events: none; /* 깜빡임 방지 (링크 클릭 필요 시 auto로 변경 가능) */
  }

  /* 마우스 올렸을 때만 보이게 */
  .heatmap-square:hover .tooltip-container {
    display: block;
    animation: fadeIn 0.2s ease-in-out;
  }
  
  /* 마우스가 툴팁 위에 있을 때도 유지하려면 아래 주석 해제 */
  /* .tooltip-container:hover { display: block; } */

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 5px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  /* 말풍선 꼬리 */
  .tooltip-container::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--light) transparent transparent transparent;
  }

  .tooltip-header {
    font-weight: bold;
    font-size: 0.8rem;
    margin-bottom: 5px;
    border-bottom: 1px solid var(--lightgray);
    padding-bottom: 3px;
    text-align: center;
  }
  
  .tooltip-body {
    font-size: 0.75rem;
    max-height: 150px;
    overflow-y: auto;
  }
  
  .tooltip-list {
    list-style: none; 
    padding: 0; 
    margin: 0;
  }
  
  .tooltip-list li {
    margin: 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .tooltip-list li a {
    text-decoration: none;
    color: var(--secondary);
    display: block;
  }
  
  .tooltip-list li a:hover {
    text-decoration: underline;
  }
  
  .no-activity {
    color: var(--gray);
    font-style: italic;
  }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor