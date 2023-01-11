import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import Video from 'react-player'
import { Database } from "../types/supabase";

import { supabase } from "../utils/supabase";

export default function LessonDetails({ lesson }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [videoUrl, setVideoUrl] = useState<string | null>();
    const supabase = useSupabaseClient()

    useEffect(() => {
        const fetchPremiumContentData = async (lessonId: number) => {
            const { data } = await supabase.from('premium_content').select('*').eq('id', lessonId).single();
            setVideoUrl(data?.video_url)
        }

        if (lesson) fetchPremiumContentData(lesson.id)
    }, [])

    return (
        <div className="max-w-3xl mx-auto py-16 px-8">
            <h1 className="text-3xl mb-6">{lesson?.title}</h1>
            <p className="mb-8">{lesson?.description}</p>
            {!!videoUrl && <Video url={videoUrl} width='100%' />}
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data: lessons } = await supabase.from('lesson').select('id');

    const paths = lessons?.map(lesson => ({
        params: {
            id: lesson.id.toString()
        }
    })) ?? []

    return {
        paths,
        fallback: false,
    }
}

type Tables = Database['public']['Tables']

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
    const { data: lesson } = await supabase.from('lesson').select('*').eq('id', params?.id).single();

    return {
        props: {
            lesson,
        }
    }
}
