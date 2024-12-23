'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageBackground() {
    const [snowflakes, setSnowflakes] = useState<Array<{
        left: string;
        opacity: number;
        duration: string;
        delay: string;
    }>>([]);

    useEffect(() => {
        // 在客戶端生成雪花
        const flakes = [...Array(100)].map(() => ({
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.4,
            duration: `${Math.random() * 3 + 4}s`,
            delay: `${Math.random() * 4}s`
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none">
            {/* 聖誕樹裝飾 */}
            <div className="absolute left-[5%] top-[10%] w-32 h-32 opacity-20">
                <Image
                    src="/christmas-tree.svg"
                    width={128}
                    height={128}
                    alt="聖誕樹"
                    className="animate-float"
                />
            </div>
            <div className="absolute right-[8%] top-[15%] w-24 h-24 opacity-20">
                <Image
                    src="/christmas-ball.svg"
                    width={96}
                    height={96}
                    alt="聖誕球"
                    className="animate-swing"
                />
            </div>

            {/* 雪花效果 */}
            {snowflakes.map((flake, i) => (
                <div
                    key={i}
                    className="snowflake"
                    style={{
                        left: flake.left,
                        opacity: flake.opacity,
                        animationDuration: flake.duration,
                        animationDelay: flake.delay
                    }}
                />
            ))}

            {/* 聖誕老人 */}
            <div className="santa">
                <Image
                    src="/santa-sleigh.svg"
                    width={200}
                    height={120}
                    alt="聖誕老人"
                    priority
                />
            </div>
        </div>
    );
} 