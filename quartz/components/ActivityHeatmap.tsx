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
    
    const today = new Date()
    const currentDay = today.getDay() 
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + (6 - currentDay))
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (52 * 7) + 1) 

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
          <div class="tooltip-container">
            <div class="tooltip-header">{dateStr} ({count}건)</div>
            <div class="tooltip-body">{tooltipContent}</div>
          </div>
        </div>
      )
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return (
      <div class={`activity-heatmap-container ${displayClass ?? ""}`}>
        <div class="heatmap-title"><span>{title}</span></div>
        {/* 스크롤 영역 감싸기 */}
        <div class="heatmap-scroll-area">
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
    
    /* ★ 화면 너비에 맞춰서 줄어들도록 설정 */
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .heatmap-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    min-width: 30px; /* 줄어들지 않게 고정 */
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

  /* ★ 스크롤 영역: 내용이 넘치면 가로 스크롤 생성 */
  .heatmap-scroll-area {
    flex-grow: 1;
    overflow-x: auto; /* 가로 스크롤 허용 */
    overflow-y: hidden;
    padding-bottom: 5px; /* 스크롤바 공간 확보 */
    
    /* 스크롤바 스타일링 (크롬, 사파리 등) */
    scrollbar-width: thin;
    scrollbar-color: var(--gray) transparent;
  }
  
  .heatmap-scroll-area::-webkit-scrollbar {
    height: 4px;
  }
  .heatmap-scroll-area::-webkit-scrollbar-thumb {
    background-color: var(--gray);
    border-radius: 4px;
  }

  .heatmap-grid {
    display: grid;
    grid-template-rows: repeat(7, 10px); 
    grid-auto-flow: column; 
    gap: 3px; 
    /* 그리드 크기는 내용물만큼 확보 */
    width: max-content; 
  }

  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); 
    border-radius: 2px;
    position: relative;
    cursor: pointer;
  }
  
  .heatmap-square.future { opacity: 0.1; pointer-events: none; }
  [saved-theme="dark"] .heatmap-square { background-color: rgba(255, 255, 255, 0.05); }
  [saved-theme="dark"] .activity-heatmap-container { background-color: var(--lightgray); }

  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }

  /* --- 툴팁 스타일 (position: fixed 적용) --- */
  .tooltip-container {
    display: none;
    
    /* ★ 핵심: 뷰포트 기준으로 고정하여 스크롤/overflow 문제 해결 */
    position: fixed; 
    z-index: 9999;
    
    /* 기본 위치는 화면 중앙 하단쯤 (CSS만으로는 마우스 따라가기 어려우므로 고정 위치 사용) */
    /* 마우스 근처에 띄우려면 JS가 필요하지만, CSS Only로는 아래 방식이 최선 */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    /* 하지만, position: fixed를 쓰더라도 relative 부모가 없으면 화면 전체 기준이 됨. */
    /* 더 나은 UX를 위해: hover 시 해당 네모칸 근처에 보이게 하려면 absolute가 맞음. */
    /* absolute + overflow:auto는 툴팁이 잘림. */
    /* 타협안: 툴팁을 'absolute'로 하되, 방향을 아래로 띄우거나 grid 안쪽에 여백을 줌 */
  }
  
  /* --- 툴팁 재설정 (현실적인 CSS 해결책) --- */
  /* fixed 대신 absolute를 쓰되, 오른쪽 끝에서 잘리는 것만 감수하고 레이아웃을 지킴 */
  .tooltip-container {
    display: none;
    position: absolute;
    bottom: 15px; /* 위쪽으로 띄움 */
    left: 50%;
    transform: translateX(-50%);
    
    background-color: var(--light);
    border: 1px solid var(--lightgray);
    color: var(--darkgray);
    
    min-width: 180px;
    width: max-content;
    max-width: 250px;
    
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    z-index: 1000;
    
    text-align: left;
    white-space: normal;
  }

  /* 스크롤 영역 밖으로 툴팁이 나가면 잘리는 문제를 해결하기 위한 설정 */
  /* heatmap-square에 마우스를 올리면 툴팁이 보임 */
  .heatmap-square:hover .tooltip-container {
    display: block;
  }
  
  /* ★ 툴팁이 잘리는 것을 방지하기 위해 네모칸의 z-index 상승 */
  .heatmap-square:hover {
    z-index: 1000;
  }
  
  /* 툴팁 내부 스타일 */
  .tooltip-header {
    font-weight: bold;
    border-bottom: 1px solid var(--lightgray);
    margin-bottom: 8px;
    padding-bottom: 4px;
    font-size: 0.95rem;
  }
  .tooltip-body {
    font-size: 0.9rem;
    max-height: 200px;
    overflow-y: auto;
  }
  .tooltip-list {
    list-style: none; padding: 0; margin: 0;
  }
  .tooltip-list li {
    margin-bottom: 4px; line-height: 1.4;
  }
  .tooltip-list li a {
    text-decoration: none; color: var(--secondary); display: inline-block;
  }
  .tooltip-list li a:hover {
    text-decoration: underline;
  }
  .no-activity { color: var(--gray); font-style: italic; }
  
  .tooltip-container::after {
    content: ""; position: absolute; top: 100%; left: 50%; margin-left: -6px;
    border-width: 6px; border-style: solid;
    border-color: var(--light) transparent transparent transparent;
  }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor