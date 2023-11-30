import { PassiveAppState, useAppContext } from "../AppState";
import React, { useRef } from 'react';
import { parseWithInfiniteArray } from "../wfc/InfiniteArray";

interface UploadButtonProps {
  onUpload: (data: any) => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = parseWithInfiniteArray(e.target?.result as string);
        console.log(json)
        onUpload(json);
      } catch (err) {
        console.error("Error parsing JSON:", err);
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <>
      <button onClick={handleClick}>Upload Config</button>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleFileChange} 
      />
    </>
  );
}

export default UploadButton;

export const Configs = () => {
    const config = useAppContext() 
    const handleDownload = () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(config as PassiveAppState)], { type: "application/json" }))
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'wfc.json';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    
        // Optional: Release the object URL to free up memory
        URL.revokeObjectURL(url);
    };

    return <div style={{padding:"1em", display:"flex", flexDirection:"row", gap:"1em"}}>
        <button onClick={handleDownload}>Save current config</button>
        <UploadButton onUpload={config.updateState} />
    </div>

}