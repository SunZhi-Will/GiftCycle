export default function ChristmasTree() {
    return (
        <svg
            viewBox="0 0 600 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
        >
            {/* 樹幹 */}
            <rect x="275" y="600" width="50" height="150" fill="#8B4513" />

            {/* 樹的層次 - 從底部開始，確保層次重疊 */}
            <path
                d="M300 100 
                   L550 600 
                   H300 
                   H50 
                   Z"
                fill="#0F5132"
                opacity="0.7"
            />
            <path
                d="M300 50 
                   L500 450 
                   H300 
                   H100 
                   Z"
                fill="#0F5132"
                opacity="0.8"
            />
            <path
                d="M300 20 
                   L450 300 
                   H300 
                   H150 
                   Z"
                fill="#0F5132"
                opacity="0.9"
            />

            {/* 樹頂星星 - ��整位置 */}
            <path
                d="M300 10 
                   L310 30 
                   L330 35 
                   L315 50 
                   L320 70 
                   L300 60 
                   L280 70 
                   L285 50 
                   L270 35 
                   L290 30 
                   Z"
                fill="#FFD700"
            />

            {/* 添加一些小裝飾點 */}
            {[...Array(25)].map((_, i) => (
                <circle
                    key={`decoration-${i}`}
                    cx={150 + Math.random() * 300}
                    cy={50 + Math.random() * 500}
                    r={3}
                    fill="#FFD700"
                    opacity={0.4 + Math.random() * 0.4}
                />
            ))}

            {/* 添加一些小雪點 */}
            {[...Array(40)].map((_, i) => (
                <circle
                    key={`snow-${i}`}
                    cx={100 + Math.random() * 400}
                    cy={50 + Math.random() * 500}
                    r={1.5}
                    fill="#FFFFFF"
                    opacity={0.3 + Math.random() * 0.3}
                />
            ))}
        </svg>
    );
} 