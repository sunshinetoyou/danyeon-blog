import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  title?: string
  targetTag?: string 
}

export default ((opts?: Options) => {
  const ActivityHeatmap: QuartzComponent = ({ allFiles, displayClass }: QuartzComponentProps) => {
    const title = opts?.title ?? "Activity"
    
    // 1. 날짜 계산: "오늘이 포함된 주"의 토요일을 끝으로 잡고, 52주 전 일요일을 시작으로 잡음
    const today = new Date()
    const currentDay = today.getDay() // 0(일) ~ 6(토)
    
    // 마지막 날짜 (End): 이번 주 토요일 (미래 날짜 포함해서 칸을 확보)
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + (6 - currentDay))
    
    // 시작 날짜 (Start): 정확히 52주 전 일요일
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - (52 * 7) + 1) // +1은 보정값

    // 2. 데이터 집계
    const dataset: Record<string, number> = {}
    allFiles.forEach((file) => {
      // 태그 필터링 (targetTag가 있으면 해당 태그가 포함된 글만 카운트)
      if (opts?.targetTag && !file.frontmatter?.tags?.includes(opts.targetTag)) return
      
      const fileDate = file.dates?.created
      if (fileDate) {
        // KST(한국 시간) 기준 날짜 변환 (ISOString은 UTC라 날짜가 밀릴 수 있음)
        const offset = fileDate.getTimezoneOffset() * 60000
        const localDate = new Date(fileDate.getTime() - offset)
        const dateStr = localDate.toISOString().split('T')[0]
        dataset[dateStr] = (dataset[dateStr] || 0) + 1
      }
    })

    // 3. 그리드 생성
    const squares = []
    const currentDate = new Date(startDate)

    // 날짜 루프: 시작일부터 엔드일까지
    while (currentDate <= endDate) {
      // UTC 오프셋 보정하여 문자열 생성
      const offset = currentDate.getTimezoneOffset() * 60000
      const localCurrent = new Date(currentDate.getTime() - offset)
      const dateStr = localCurrent.toISOString().split('T')[0]
      
      const count = dataset[dateStr] || 0
      
      // 미래 날짜인지 확인 (오늘 이후는 색칠 안 함)
      const isFuture = currentDate > today

      let level = 0
      if (!isFuture && count > 0) level = 1
      if (!isFuture && count > 1) level = 2
      if (!isFuture && count > 3) level = 3
      if (!isFuture && count > 5) level = 4

      squares.push(
        <div 
          class={`heatmap-square level-${level} ${isFuture ? "future" : ""}`}
          title={`${dateStr}: ${count} posts`} 
        ></div>
      )
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return (
      <div class={`activity-heatmap-container ${displayClass ?? ""}`}>
        {/* 왼쪽 세로 제목 */}
        <div class="heatmap-title">
          <span>{title}</span>
        </div>
        
        {/* 오른쪽 히트맵 그리드 */}
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
    flex-direction: row; /* 가로 배치 */
    align-items: center;
    margin-top: 1rem;
    padding: 10px;
    background-color: var(--lightgray);
    border-radius: 8px;
    gap: 15px;
  }

  /* 왼쪽 세로 제목 스타일 */
  .heatmap-title {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px; /* 제목 영역 너비 */
    border-right: 2px solid var(--gray);
    padding-right: 10px;
  }

  .heatmap-title span {
    writing-mode: vertical-rl; /* 세로 쓰기 */
    transform: rotate(180deg); /* 텍스트 방향 조정 */
    font-weight: bold;
    font-size: 0.9rem;
    color: var(--dark);
    white-space: nowrap;
    letter-spacing: 2px;
  }

  .heatmap-content {
    flex-grow: 1;
    overflow-x: auto; /* 화면 작으면 스크롤 */
  }
  
  .heatmap-grid {
    display: grid;
    /* 세로 7칸 (일~토) 고정 */
    grid-template-rows: repeat(7, 10px); 
    grid-auto-flow: column; 
    gap: 3px; 
  }

  .heatmap-square {
    width: 10px;
    height: 10px;
    background-color: rgba(200, 200, 200, 0.2); 
    border-radius: 2px;
  }
  
  /* 미래 날짜는 아예 투명하게 혹은 더 연하게 */
  .heatmap-square.future {
    opacity: 0.1;
  }

  /* 다크모드 대응 */
  [saved-theme="dark"] .heatmap-square {
    background-color: rgba(255, 255, 255, 0.05);
  }
  [saved-theme="dark"] .activity-heatmap-container {
    background-color: var(--lightgray); 
  }

  /* 색상 레벨 (테마 색상 활용) */
  .heatmap-square.level-1 { background-color: var(--secondary); opacity: 0.4; }
  .heatmap-square.level-2 { background-color: var(--secondary); opacity: 0.6; }
  .heatmap-square.level-3 { background-color: var(--secondary); opacity: 0.8; }
  .heatmap-square.level-4 { background-color: var(--secondary); opacity: 1.0; }
  `

  return ActivityHeatmap
}) satisfies QuartzComponentConstructor