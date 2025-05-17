import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";

export const Pdf = () => {
    const location = useLocation();
    const [pdfData, setPdfData] = useState(null);
    const searchParams = new URLSearchParams(location.search);
    const pdfUrl = searchParams.get('url');
    useEffect(() => {
        if (pdfUrl) {
            setPdfData(pdfUrl);
        }
    }, [pdfUrl]);
    return (
        pdfData && (
            <iframe src={pdfData} width="100%" style={{ border: "none", height: '97vh', marginTop: '100px' }}></iframe>
        )
    );
};