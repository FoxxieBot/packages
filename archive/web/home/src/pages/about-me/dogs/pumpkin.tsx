import Meta from '@ui/Meta';
import { useSize } from 'ahooks';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

const PumpkinParallax = dynamic(() => import('@about-me/dogs/pumpkin/ui/PumpkinParallax/PumpkinParallax'), { ssr: false });

const Pumpkin: NextPage = () => {
    const size = useSize(() => document.querySelector('body'));

    return (
        <>
            <Meta
                title='Pumpkin Through the Years'
                description='This is a timeline of my dog Pumpkin. Explore from when we got her to now.'
                keywords={['reese', 'reese harlak', 'web', 'react', 'next.js', 'developer', 'my dog', 'pumpkin']}
                subject='My dog pumpkin'
                image={{
                    image: 'https://rsehrk.com/cdn/assets/reese/pumpkin/pumpkin_oct_4_2021.jpg',
                    alt: 'Pumpkin excited',
                    format: 'image/jpg'
                }}
            />

            {(size?.width || 0) < 1536 ? (
                <div className='flex h-screen w-screen items-center justify-center 2xl:hidden'>
                    <h1 className='mb-10 text-xl'>Please view this page on a larger screen</h1>
                </div>
            ) : (
                <PumpkinParallax />
            )}
        </>
    );
};

export default Pumpkin;
