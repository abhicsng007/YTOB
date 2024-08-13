"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState ,useCallback } from "react";
import Heading from "@/components/ui/Heading";
import { Youtube } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/services/axiosInstance";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BlogPost from "@/components/ui/BlogPost";
import UpgradeModal from "@/components/ui/UpgradeModal";
import LoadingProvider from "@/components/ui/LoadingProvider";

function VideoToBlog() {
    const [blog, setBlog] = useState("");
    const [url, setUrl] = useState("");
    const [credits, setCredits] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const creditsSetter = useCallback((value) => {
        setCredits(value);
        if (value === 0) {
            setShowUpgradeModal(true);
        }
        console.log(`credits: ${value}`);
      }, []);
    

    useEffect(() => {
        async function fetchCredits() {
          try {
            const response = await axiosInstance.post('/credits/get-credits');
            creditsSetter(response.data.creditCount);
           
          } catch (error) {
            console.error('Error fetching credits:', error);
          }
        }
      
        fetchCredits();
      }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 1000); // Adjust this delay as needed

      return () => clearTimeout(timer);
    }, []);

    const onSubmit = async (values) => {
        try {
            setBlog("");
            setUrl(values.prompt);
            
            const response = await axiosInstance.get('/blogs/generate', {
                params: {
                    url: values.prompt
                }
            });
        
            if (response.status === 200) {
                setBlog(response.data.data);
                console.log('Blog generated successfully:', response.data.data);
                
            } else {
                console.error('Failed to generate blog post');
            }
        
            form.reset();
        } catch (error) {
            console.error('Error generating blog post:', error);
        }
    }

    const handleCloseModal = () => {
        setShowUpgradeModal(false);
    }

    const handleUpgrade = (plan) => {
        console.log(`Upgrading to ${plan}`);
        setShowUpgradeModal(false);
    }

    return (
        <LoadingProvider isLoading={initialLoading || isLoading}>
            {!initialLoading && (
                <div>
                    <Heading
                        title="Youtube to Blog"
                        description="Convert youtube videos into quality blogs"
                        Icon={Youtube}
                        iconColor="text-red-700"
                        bgColor="bg-violet-500/10"
                    />
                    <div className="px-4 lg:px-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}
                                className="rounded-lg border w-full p-4 px-3 md:px-6
                                    focus-within:shadow-sm grid grid-cols-12 gap-2"
                            >
                                <FormField
                                    name="prompt"
                                    render={({field}) => (
                                        <FormItem className="col-span-12 lg:col-span-10">
                                            <FormControl className="m-0 p-0">
                                                <Input
                                                    className="border-0 outline-none focus-visible:ring-0 
                                                    focus-visible:ring-transparent"
                                                    disabled={isLoading}
                                                    placeholder="Enter url of youtube video"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button className="col-span-12 lg:col-span-2 w-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg" disabled={isLoading || credits === 0}>
                                    Generate
                                </Button>
                            </form>
                        </Form>
                    </div>
                    
                    <div className="flex justify-center items-center">
                        {blog && <BlogPost text={blog} defVideoUrl={url} />}
                    </div>

                    <UpgradeModal 
                        isOpen={showUpgradeModal}
                        onClose={handleCloseModal}
                        onUpgrade={handleUpgrade}
                    />
                </div>
            )}
        </LoadingProvider>
    );
}

export default VideoToBlog;