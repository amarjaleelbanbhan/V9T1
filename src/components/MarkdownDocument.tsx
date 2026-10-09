import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
export function MarkdownDocument({source,onDocument}:{source:string;onDocument?:(href:string)=>boolean}){
 return <div className="markdown-document"><Markdown remarkPlugins={[remarkGfm]} skipHtml components={{a:({href,children})=><a href={href} onClick={e=>{if(href&&onDocument?.(href))e.preventDefault();}}>{children}</a>}}>{source}</Markdown></div>;
}
