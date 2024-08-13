import React, { useState } from 'react';

const MarkdownRenderer = ({markdown}) => {
    const [markdownText, setMarkdownText] = useState(markdown);

    const parseMarkdown = (markdown) => {
        const rules = [
            { regex: /###### (.*?)(\n|$)/g, replace: '<h6 class="text-xs font-bold mb-2">$1</h6>' },
            { regex: /##### (.*?)(\n|$)/g, replace: '<h5 class="text-sm font-bold mb-2">$1</h5>' },
            { regex: /#### (.*?)(\n|$)/g, replace: '<h4 class="text-base font-bold mb-2">$1</h4>' },
            { regex: /### (.*?)(\n|$)/g, replace: '<h3 class="text-3xl font-bold mb-2">$1</h3>' },
            { regex: /## (.*?)(\n|$)/g, replace: '<h2 class="text-4xl font-bold mb-2">$1</h2>' },
            { regex: /# (.*?)(\n|$)/g, replace: '<h1 class="text-5xl font-bold mb-2">$1</h1>' },
            { regex: /\*\*(.*?)\*\*/g, replace: '<strong class="font-bold">$1</strong>' },
            { regex: /\*(.*?)\*/g, replace: '<em class="italic">$1</em>' },
            { regex: /\[(.*?)\]\((.*?)\)/g, replace: '<a href="$2" class="text-blue-500 underline">$1</a>' },
            { regex: /\n/g, replace: '<br />' },
            
        ];

        let html = markdown;
        rules.forEach(rule => {
            html = html.replace(rule.regex, rule.replace);
        });

        return html;
    };

    const createMarkup = (text) => {
        return { __html: parseMarkdown(text) };
    };

    return (
        <div className="flex justify-center items-center mx-8 my-6">
            <div dangerouslySetInnerHTML={createMarkup(markdownText)} />
        </div>
    );
};

export default MarkdownRenderer;
