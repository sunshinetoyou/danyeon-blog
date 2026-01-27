import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  title?: string
  targetTag?: string 
}

// 하루 동안의 활동 정보 타입 정의
type DailyActivity = {
  title: string
  slug: string
}

export default ((opts?: Options) => {
  const ActivityHeatmap: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
    const title = opts?.title ?? "Activity"
    
    // 1. 날짜 계산 (기존과 동일)
    const today = new Date()
    const currentDay = today.getDay() 
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + (6 - currentDay))
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (52 * 7) + 1) 

    // 2. 데이터 집계 (★변경: 개수 대신 글 정보 목록 저장)
    const dataset: Record<string, DailyActivity[]> = {}
    allFiles.forEach((file) => {
      if (opts?.targetTag && !file.frontmatter?.tags?.includes(opts.targetTag)) return
      
      const fileDate = file.dates?.created
      // 제목과 슬러그(링크)가 모두 있는 경우에만 수집
      if (fileDate && file.frontmatter?.title && file.slug) {
        const offset = fileDate.getTimezoneOffset() * 60000
        const localDate = new Date(fileDate.getTime() - offset)
        const dateStr = localDate.toISOString().split('T')[0]
        
        // 해당 날짜에 배열이 없으면 새로 만듦
        if (!dataset[dateStr]) {
            dataset[dateStr] = []
        }
        // 글 정보 추가
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
      
      // 해당 날짜의 활동 목록 가져오기
      const dailyActivities = dataset[dateStr] || []
      const count = dailyActivities.length
      
      const isFuture = currentDate > today

      let level = 0
      if (!isFuture && count > 0) level = 1
      if (!isFuture && count > 1) level = 2
      if (!isFuture && count > 3) level = 3
      if (!isFuture && count > 5) level = 4

      // ★ 툴팁 내용 HTML 생성
      const tooltipContent = count > 0 ? (
        <ul class="tooltip-list">
          {dailyActivities.map((activity) => (
            <li>
              {/* 클릭하면 해당 글로 이동하는 내부 링크 */}
              <a href={`/${activity.slug}`} class="internal">{activity.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <span>활동 없음</span>
      )

      squares.push(
        <div class={`heatmap-square level-${level} ${isFuture ? "future" : ""}`}>
          {/* ★ 내부에 숨겨진 툴팁 구조 추가 */}
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
    overflow-y: visible; /* 툴팁이 잘리지 않게 설정 */
  }
  
  .heatmap-grid {
    display: grid;
    grid-template-rows: repeat(7, 10px); 
    grid-auto-flow: column; 
    gap: 3px; 
  }

  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); 
    border-radius: 2px;
    position: relative; /* ★ 툴팁 위치 기준점 */
    cursor: pointer;    /* 마우스 커서 손가락 모양 */
  }
  
  .heatmap-square.future { opacity: 0.1; pointer-events: none; }

  [saved-theme="dark"] .heatmap-square { background-color: rgba(255, 255, 255, 0.05); }
  [saved-theme="dark"] .activity-heatmap-container { background-color: var(--lightgray); }

  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }

  /* ★★★ 툴팁 스타일 시작 ★★★ */
  .tooltip-container {
    visibility: hidden; /* 평소엔 숨김 */
    opacity: 0;
    position: absolute;
    bottom: 150%; /* 네모칸 위쪽에 배치 */
    left: 50%;
    transform: translateX(-50%); /* 가운데 정렬 */
    
    background-color: var(--light); /* 배경색 */
    color: var(--darkgray);         /* 글자색 */
    border: 1px solid var(--lightgray);
    border-radius: 6px;
    padding: 10px;
    z-index: 1000; /* 다른 요소보다 위에 뜨도록 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 그림자 효과 */
    
    width: max-content; /* 내용만큼 너비 자동 조절 */
    min-width: 150px;
    max-width: 250px; /* 너무 넓어지지 않게 제한 */
    
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out; /* 부드러운 효과 */
    pointer-events: none; /* 툴팁이 마우스 이벤트를 가로채지 않게 함 */
  }

  /* 마우스 올렸을 때 툴팁 보이기 */
  .heatmap-square:hover .tooltip-container {
    visibility: visible;
    opacity: 1;
    pointer-events: auto; /* 툴팁 내의 링크 클릭 가능하게 변경 */
  }

  /* 말풍선 꼬리 (화살표) 만들기 */
  .tooltip-container::after, .tooltip-container::before {
    content: "";
    position: absolute;
    top: 100%; /* 툴팁 바로 아래 */
    left: 50%;
    border-style: solid;
  }
  /* 내부 색상 삼각형 */
  .tooltip-container::after {
    margin-left: -6px;
    border-width: 6px;
    border-color: var(--light) transparent transparent transparent;
  }
  /* 테두리용 삼각형 (약간 더 크게 만들어서 뒤에 배치) */
  .tooltip-container::before {
    margin-left: -7px;
    border-width: 7px;
    border-color: var(--lightgray) transparent transparent transparent;
    z-index: -1;
  }

  /* 툴팁 내부 콘텐츠 스타일 */
  .tooltip-header {
    font-weight: bold;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--lightgray);
    padding-bottom: 5px;
    font-size: 0.9rem;
  }
  .tooltip-body {
    max-height: 150px; /* 목록이 너무 길면 스크롤 생김 */
    overflow-y: auto;
  }
  .tooltip-list {
    list-style: none; /* 불릿 제거 */
    padding: 0;
    margin: 0;
  }
  .tooltip-list li {
    margin-bottom: 4px;
    font-size: 0.85rem;
    white-space: nowrap; /* 한 줄로 표시 */
    overflow: hidden;
    text-overflow: ellipsis; /* 내용 넘치면 ... 표시 */
  }
  .tooltip-list li a {
      text-decoration: none;
      color: var(--secondary); /* 링크 색상은 테마 강조색 사용 */
      display: block; /* 영역 전체 클릭 가능하게 */
  }
  .tooltip-list li a:hover {
      text-decoration: underline;
      opacity: 0.8;
  }

  /* 툴팁 스크롤바 예쁘게 (선택사항) */
  .tooltip-body::-webkit-scrollbar { width: 4px; }
  .tooltip-body::-webkit-scrollbar-thumb { background-color: var(--gray); border-radius: 2px; }
  /* ★★★ 툴팁 스타일 끝 ★★★ */
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor