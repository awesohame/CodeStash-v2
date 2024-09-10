"use client";

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface Stash {
    title: string;
    desc: string;
    created_at: string;
    tags: string[];
}

const StashCards = ({ className, style }: { className: string, style: React.CSSProperties }) => {
    const [stashes, setStashes] = useState<Stash[]>([]);

    useEffect(() => {
        const fetchStashes = async () => {
            // Simulated fetch, replace with actual API call
            setStashes([
                {
                    title: 'Grocery List',
                    desc: 'Remember to pick up milk, eggs, and bread.',
                    created_at: '2023-04-15',
                    tags: ['grocery', 'list'],
                },
                {
                    title: 'Workout Routine',
                    desc: 'Complete 3 sets of push-ups, squats, and lunges.',
                    created_at: '2023-04-16',
                    tags: ['fitness', 'exercise'],
                },
                {
                    title: 'Recipe Ideas',
                    desc: 'Try out new recipes for pasta, pizza, and salad.',
                    created_at: '2023-04-17',
                    tags: ['cooking', 'food'],
                },
                {
                    title: 'Travel Plans',
                    desc: 'Explore new destinations and create an itinerary.',
                    created_at: '2023-04-18',
                    tags: ['travel', 'adventure'],
                },
                {
                    title: 'Book Recommendations',
                    desc: 'Discover new books to read and create a reading list.',
                    created_at: '2023-04-19',
                    tags: ['books', 'reading'],
                },
            ]);
        };
        fetchStashes();
    }, []);

    return (
        <>
            {stashes.map((stash, idx) => (
                <Card key={idx} className={
                    cn(
                        'bg-light-1 bg-opacity-10 backdrop-blur-lg border-none shadow-lg hover:shadow-xl transition-all duration-300',
                        className,
                    )
                } style={style}>
                    <CardHeader>
                        <CardTitle className='text-light-1 text-xl font-semibold'>{stash.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className='text-light-2 text-base'>{stash.desc}</CardDescription>
                        <div className='flex flex-wrap gap-2 mt-3'>
                            {stash.tags.map((tag, idx) => (
                                <span key={idx} className='text-xs text-light-1 bg-dark-4 bg-opacity-50 px-3 py-1 rounded-full'>{tag}</span>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className='text-light-3 text-sm'>{stash.created_at}</p>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

export default StashCards;