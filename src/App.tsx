import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom';

const Btn = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ children, onClick, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
            onClick={onClick} {...props}
        >{children}</button>
    )
});

const ShyBtn = () => {
    const btnRef = useRef<HTMLButtonElement>(null);

    const getCoordinates = (e: any) => {
        if (e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    const handleMove = (e: any) => {
        const { x: mouseX, y: mouseY } = getCoordinates(e);
        const button = btnRef.current;
        if (!button) return;

        const buttonRect = button.getBoundingClientRect();
        const distanceX = Math.abs(buttonRect.left + buttonRect.width / 2 - mouseX);
        const distanceY = Math.abs(buttonRect.top + buttonRect.height / 2 - mouseY);

        if (distanceX < 50 && distanceY < 50) {
            const newX = mouseX + (mouseX < window.innerWidth / 2 ? 100 : -100);
            const newY = mouseY + (mouseY < window.innerHeight / 2 ? 100 : -100);
            const boundedX = Math.max(0, Math.min(newX, window.innerWidth - buttonRect.width));
            const boundedY = Math.max(0, Math.min(newY, window.innerHeight - buttonRect.height));

            button.style.position = 'absolute';
            button.style.left = `${boundedX}px`;
            button.style.top = `${boundedY}px`;
        }
    };

    useEffect(() => {
        const currentButton = btnRef.current;
        if (currentButton) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('touchmove', handleMove, { passive: false });
        }

        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('touchmove', handleMove);
        };
    }, []);

    const spawnSwiningText = () => {
        // const alreadyExists = document.getElementById('nu-uh');
        // if (alreadyExists) return;

        // If ShyBtn is clicked, create a new element with the text "Nu-uh" and append it to the body
        const nuUh = document.createElement('div');
        // nuUh.id = 'nu-uh';
        nuUh.style.position = 'absolute';
        nuUh.style.top = `${btnRef.current!.getBoundingClientRect().top + 15}px`;
        nuUh.style.left = `${btnRef.current!.getBoundingClientRect().left + 15}px`;
        nuUh.style.fontSize = '3rem';
        nuUh.style.color = 'red';
        nuUh.textContent = '☝🏻';
        nuUh.style.zIndex = '1000';
        document.body.appendChild(nuUh);

        // Animate the text with rotation that goes from -20deg to 20deg from its original titlt
        setTimeout(() => {
            if (nuUh) {
                nuUh.style.animation = 'swing .5s infinite';
                setTimeout(() => {
                    nuUh.remove();
                }, 1500);
            }
        }, 0);
    }

    return (
        <Btn
            ref={btnRef}
            style={{
                position: 'static',
                transition: 'left 100ms, top 100ms',
                willChange: 'left, top'
            }}
            onClick={spawnSwiningText}
        >No</Btn>
    );
}

const yesWords = ['Yes!', 'Sure!', 'Ofcourse!', 'Definitely!', 'Absolutely!', 'Yea!', 'Yeah!',];
const randomEmojis = ['😊', '🥰', '😍', '💖', '🌹', '💕'];
const redirectToSocial = () => {
    window.location.href = 'https://www.instagram.com/limpn__/';
}

const MovingCloud = () => {
    const cloudRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCloud = () => {
            const cloud = cloudRef.current;
            if (!cloud) return;

            const cloudRect = cloud.getBoundingClientRect();
            const newX = cloudRect.left + 1; // Move cloud to the right by 1 pixel

            if (newX > (window.visualViewport?.width || window.innerWidth)) {
                // Reset the cloud to start from the left again with a random vertical position
                cloud.style.left = `-${cloudRect.width}px`;
                cloud.style.top = `${Math.floor(Math.random() * (window.innerHeight - cloudRect.height))}px`;
            } else {
                cloud.style.left = `${newX}px`; // Update the left style to move the cloud
            }
        };

        const intervalId = setInterval(moveCloud, 30); // Use setInterval for continuous movement

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    // Initial random positions
    const randomStartX = Math.floor(Math.random() * window.innerWidth);
    const randomStartY = Math.floor(Math.random() * window.innerHeight);

    return (
        <div
            ref={cloudRef}
            style={{
                position: 'absolute',
                top: `${randomStartY}px`,
                left: `${randomStartX}px`,
                willChange: 'left',
                transition: 'left 30ms',
            }}
        >
            <i className="cloud"></i>
        </div>
    );
};

const PortalContainer = () => {
    const randomAmountOfCloudsBetween5and25 = Math.floor(Math.random() * 20) + 5;
    return (
        Array.from({ length: randomAmountOfCloudsBetween5and25 }).map((_, i) => (
            <MovingCloud key={i} />
        ))
    )
}

const Game = () => {
    const randomWordForYes = yesWords[Math.floor(Math.random() * yesWords.length)];
    const randomEmoji = () => randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
    return (
        <div>
            <h1 className="text-4xl font-bold">Will you be my gf? {randomEmoji()}</h1>
            <div className='flex items-center justify-center gap-4 mt-12'>
                <Btn onClick={redirectToSocial}>{randomWordForYes}{' '}{randomEmoji()}</Btn>
                <ShyBtn />
            </div>
        </div>
    )
}

// const MessageShownToMobileUsers = () => {
//     return (
//         <div className='p-4 bg-white rounded-lg shadow-lg'>
//             <h1 className='text-2xl font-bold'>This website is only available on desktop</h1>
//             <p className='text-lg'>Please visit this website on a desktop to see the magic 🪄</p>
//         </div>
//     )
// }

const Link = ({ href, children }: { href: string, children: React.ReactNode }) => {
    return (
        <a href={href} target="_blank" rel="noreferrer" className='text-blue-500 hover:underline'>{children}</a>
    )
}

const Spacer = () => {
    return <div style={{ height: '1rem' }} />
}

function App() {
    return (
        <>
            <main className="grid place-items-center w-screen h-screen bg-blue-300 ">
                <div className='z-50 space-y-10'>
                    <Game />
                </div>
            </main>
            <footer className='absolute bottom-0 left-0 w-full z-50'>
                <Spacer />
                <div className='text-center text-gray-700 p-2 text-sm'>
                    <p>Made with ❤️ by <Link href="https://www.limpan.dev/">l1mpan 🍞</Link></p>
                </div>
            </footer>
            {createPortal(<PortalContainer />, document.body)}
        </>
    )
}

export default App
