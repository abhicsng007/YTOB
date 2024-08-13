"use client";

import { useForm } from "react-hook-form";
import {z} from "zod";
import { useState, useEffect , useCallback } from "react";
import Heading from "@/components/ui/Heading";
import {FileCheck2} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"
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

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    

    const onSubmit = async (values) => {
       

        console.log(values);
        try {
            setBlog("");
            setUrl(values.prompt);
            console.log(url);
            const response = await axiosInstance.post('/summaries/generate-summary', {
                response: values.prompt
            });

            if (response.status === 200) {
                setBlog(response.data.data);
                
            } else {
                console.error('Failed to generate blog post');
            }

            
            form.reset();
            // fetchCredits(); // Fetch updated credits after generation
        } catch (error) {
            console.error('Error generating blog post:', error);
        }
    }

    const handleCloseModal = () => {
        setShowUpgradeModal(false);
    }

    const handleUpgrade = (plan) => {
        console.log(`Upgrading to ${plan}`);
        // Implement your upgrade logic here
        setShowUpgradeModal(false);
    }

    return (
        <LoadingProvider isLoading={initialLoading || isLoading}>
            {!initialLoading && ( 
                <div>
                    <Heading
                        title="Text Summarization"
                        description="Convert large text into precise and well explained summary"
                        Icon={FileCheck2}
                        iconColor="text-blue-700"
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
                                        <FormItem className="col-span-12">
                                            <FormControl className="m-0 p-0 ">
                                                <Textarea
                                                    className="w-full border-0 outline-none focus-visible:ring-0 
                                                    focus-visible:ring-transparent resize-none min-h-48 lg:min-h-64"
                                                    disabled={isLoading}
                                                    placeholder="Enter the text"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button className="col-span-12 lg:col-span-2 w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg" disabled={isLoading || credits === 0}>
                                    Summarize
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