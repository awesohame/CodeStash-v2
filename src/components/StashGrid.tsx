'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStash } from '@/context/StashContext';
import { PlusCircle, Code, FileText, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function StashGrid() {
    const router = useRouter();
    const { stashes, createStash, readStashes } = useStash();
    console.log(stashes);
    const { user, username } = useAuth();

    useEffect(() => {
        if (user && user.email) {
            readStashes(user.email);
        }
    }, [user]);

    const handleCreateNewStash = async () => {
        const newStash = await createStash(user?.email as string, {
            title: 'New Stash',
            desc: '',
            tags: [],
            stashSections: []
        });

        if (newStash && newStash.id) {
            router.push(`/${username}/${newStash.id}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Your Stashes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* New Stash Card */}
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCreateNewStash}>
                    <CardContent className="flex items-center justify-center h-full">
                        <PlusCircle className="w-16 h-16 text-gray-400" />
                    </CardContent>
                </Card>

                {/* Stash Cards */}
                {stashes.map((stash) => (
                    <Card
                        key={stash.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => router.push(`/${username}/${stash.id}`)}
                    >
                        <CardHeader>
                            <CardTitle>{stash.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 mb-2">{stash.desc}</p>
                            <div className="flex items-center text-sm text-gray-400 mb-2">
                                <Clock className="w-4 h-4 mr-1" />
                                {new Date(stash.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {stash.tags.map((tag, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <div className="flex items-center">
                                    <Code className="w-4 h-4 mr-1" />
                                    {stash.stashSections.filter(section => section.type === 'code').length} code snippets
                                </div>
                                <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-1" />
                                    {stash.stashSections.filter(section => section.type === 'text').length} notes
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}