// Professional Result Actions - Share & Print Functionality
// Supports PDF generation, PNG card creation, and sharing

class ResultActions {
    constructor() {
        this.loadLibraries();
    }

    // Load required libraries
    async loadLibraries() {
        // Load jsPDF for PDF generation
        if (!window.jsPDF) {
            const script1 = document.createElement('script');
            script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script1);
        }

        // Load html2canvas for image generation
        if (!window.html2canvas) {
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(script2);
        }
    }

    // Add action buttons to results
    addActionButtons(resultsContainer, resultData, calculatorType = 'calorie') {
        const actionsHTML = `
            <div class="result-actions" style="
                display: flex; 
                justify-content: center; 
                gap: 15px; 
                margin-top: 30px; 
                padding: 20px; 
                background: linear-gradient(135deg, #fff5f7, #fef7f0); 
                border-radius: 12px;
                border: 2px solid #e83e8c;
            ">
                <button onclick="resultActions.printResults('${calculatorType}')" class="action-btn print-btn" style="
                    background: linear-gradient(45deg, #28a745, #20c997);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s;
                    font-size: 1rem;
                ">
                    <i class="fas fa-print"></i>
                    Print Results
                </button>
                
                <button onclick="resultActions.generatePDF('${calculatorType}')" class="action-btn pdf-btn" style="
                    background: linear-gradient(45deg, #dc3545, #fd7e14);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s;
                    font-size: 1rem;
                ">
                    <i class="fas fa-file-pdf"></i>
                    Download PDF
                </button>
                
                <button onclick="resultActions.shareResults('${calculatorType}')" class="action-btn share-btn" style="
                    background: linear-gradient(45deg, #007bff, #6f42c1);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s;
                    font-size: 1rem;
                ">
                    <i class="fas fa-share-alt"></i>
                    Share Results
                </button>
            </div>
            
            <style>
                .action-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                }
                
                @media (max-width: 768px) {
                    .result-actions {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .action-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>
        `;

        resultsContainer.insertAdjacentHTML('beforeend', actionsHTML);
        
        // Store result data for later use
        this.currentResultData = resultData;
        this.currentCalculatorType = calculatorType;
    }

    // Print results with professional formatting
    printResults(calculatorType) {
        const printWindow = window.open('', '_blank');
        const resultsContent = document.getElementById('calorieResults') || document.querySelector('.results.active');
        
        if (!resultsContent) {
            alert('No results to print. Please calculate first.');
            return;
        }

        const printHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>HealthXRay - ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Results</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333;
                        background: white;
                    }
                    .print-header {
                        background: linear-gradient(135deg, #e83e8c, #ff7e5f);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .print-header h1 {
                        font-size: 2.5rem;
                        margin-bottom: 10px;
                    }
                    .print-header p {
                        font-size: 1.2rem;
                        opacity: 0.9;
                    }
                    .patient-info {
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 10px;
                        margin-bottom: 30px;
                        border-left: 5px solid #e83e8c;
                    }
                    .patient-info h3 {
                        color: #e83e8c;
                        margin-bottom: 15px;
                    }
                    .results-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin: 30px 0;
                    }
                    .result-card {
                        background: linear-gradient(135deg, #fff5f7, #fef7f0);
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        border: 2px solid #e83e8c;
                    }
                    .result-card h3 {
                        color: #e83e8c;
                        margin-bottom: 10px;
                    }
                    .result-value {
                        font-size: 2rem;
                        font-weight: 700;
                        color: #e83e8c;
                        margin: 10px 0;
                    }
                    .result-unit {
                        color: #6c757d;
                        font-size: 0.9rem;
                    }
                    .footer {
                        margin-top: 50px;
                        padding: 20px;
                        background: #f8f9fa;
                        text-align: center;
                        border-top: 3px solid #e83e8c;
                    }
                    .footer p {
                        color: #6c757d;
                        margin: 5px 0;
                    }
                    .website-url {
                        color: #e83e8c;
                        font-weight: 600;
                        font-size: 1.1rem;
                    }
                    @media print {
                        .no-print { display: none !important; }
                        body { background: white !important; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1><i class="fas fa-heartbeat"></i> HealthXRay</h1>
                    <p>Professional ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Analysis Report</p>
                </div>
                
                <div class="patient-info">
                    <h3><i class="fas fa-user"></i> Patient Information</h3>
                    <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    <p><strong>Calculator Type:</strong> ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Calculator</p>
                    <p><strong>Website:</strong> <span class="website-url">https://healthxray.online</span></p>
                </div>
                
                ${resultsContent.innerHTML}
                
                <div class="footer">
                    <p><strong>HealthXRay - Professional Health Tools</strong></p>
                    <p>Visit us at: <span class="website-url">https://healthxray.online</span></p>
                    <p>© 2024 HealthXRay. All rights reserved.</p>
                    <p style="font-size: 0.8rem; margin-top: 10px;">
                        <strong>Disclaimer:</strong> This report is for informational purposes only. 
                        Consult healthcare professionals for personalized medical advice.
                    </p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(printHTML);
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // Generate professional PDF
    async generatePDF(calculatorType) {
        try {
            // Wait for jsPDF to load
            await this.waitForLibrary('jsPDF');
            
            const { jsPDF } = window;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // PDF dimensions
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Header
            pdf.setFillColor(232, 62, 140);
            pdf.rect(0, 0, pageWidth, 40, 'F');
            
            // Logo and title
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(24);
            pdf.setFont('helvetica', 'bold');
            pdf.text('HealthXRay', 20, 25);
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Professional ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Analysis Report`, 20, 35);
            
            // Patient info section
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Patient Information', 20, 55);
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Report Generated: ${new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, 20, 65);
            
            pdf.text(`Calculator Type: ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Calculator`, 20, 75);
            pdf.text('Website: https://healthxray.online', 20, 85);
            
            // Results section
            const resultsElement = document.getElementById('calorieResults') || document.querySelector('.results.active');
            if (resultsElement) {
                // Get result cards
                const resultCards = resultsElement.querySelectorAll('.result-card');
                let yPosition = 100;
                
                pdf.setFontSize(14);
                pdf.setFont('helvetica', 'bold');
                pdf.text('Analysis Results', 20, yPosition);
                yPosition += 15;
                
                resultCards.forEach((card, index) => {
                    const title = card.querySelector('h3')?.textContent || '';
                    const value = card.querySelector('.result-value')?.textContent || '';
                    const unit = card.querySelector('.result-unit')?.textContent || '';
                    
                    pdf.setFontSize(12);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(title, 20, yPosition);
                    
                    pdf.setFontSize(16);
                    pdf.setTextColor(232, 62, 140);
                    pdf.text(`${value} ${unit}`, 20, yPosition + 10);
                    
                    pdf.setTextColor(0, 0, 0);
                    yPosition += 25;
                });
            }
            
            // Footer
            const footerY = pageHeight - 30;
            pdf.setFillColor(248, 249, 250);
            pdf.rect(0, footerY - 10, pageWidth, 40, 'F');
            
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'bold');
            pdf.text('HealthXRay - Professional Health Tools', 20, footerY);
            pdf.text('Visit us at: https://healthxray.online', 20, footerY + 8);
            pdf.text('© 2024 HealthXRay. All rights reserved.', 20, footerY + 16);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.text('Disclaimer: This report is for informational purposes only. Consult healthcare professionals for personalized medical advice.', 20, footerY + 24);
            
            // Save PDF
            const fileName = `HealthXRay_${calculatorType}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    // Share results with image card
    async shareResults(calculatorType) {
        try {
            // Generate image card first
            const imageBlob = await this.generateImageCard(calculatorType);
            
            if (navigator.share && imageBlob) {
                // Use native sharing if available
                const file = new File([imageBlob], `healthxray_${calculatorType}_results.png`, { type: 'image/png' });
                
                await navigator.share({
                    title: `HealthXRay ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Results`,
                    text: `Check out my health analysis results from HealthXRay!`,
                    url: 'https://healthxray.online',
                    files: [file]
                });
            } else {
                // Fallback: Show share options
                this.showShareModal(calculatorType, imageBlob);
            }
        } catch (error) {
            console.error('Share error:', error);
            // Fallback to simple URL sharing
            this.showShareModal(calculatorType);
        }
    }

    // Generate professional image card
    async generateImageCard(calculatorType) {
        try {
            await this.waitForLibrary('html2canvas');
            
            // Create a temporary card element
            const cardElement = this.createImageCardElement(calculatorType);
            document.body.appendChild(cardElement);
            
            // Generate image
            const canvas = await html2canvas(cardElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                width: 800,
                height: 600
            });
            
            // Remove temporary element
            document.body.removeChild(cardElement);
            
            // Convert to blob
            return new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png', 0.9);
            });
            
        } catch (error) {
            console.error('Image generation error:', error);
            return null;
        }
    }

    // Create image card element
    createImageCardElement(calculatorType) {
        const resultsElement = document.getElementById('calorieResults') || document.querySelector('.results.active');
        const resultCards = resultsElement?.querySelectorAll('.result-card') || [];
        
        const cardDiv = document.createElement('div');
        cardDiv.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 800px;
            height: 600px;
            background: linear-gradient(135deg, #e83e8c, #ff7e5f);
            color: white;
            font-family: 'Segoe UI', Arial, sans-serif;
            padding: 40px;
            box-sizing: border-box;
            border-radius: 20px;
        `;
        
        let resultsHTML = '';
        resultCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent || '';
            const value = card.querySelector('.result-value')?.textContent || '';
            const unit = card.querySelector('.result-unit')?.textContent || '';
            
            resultsHTML += `
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 15px;
                    margin: 10px 0;
                    text-align: center;
                    backdrop-filter: blur(10px);
                ">
                    <h3 style="margin: 0 0 10px 0; font-size: 1.2rem;">${title}</h3>
                    <div style="font-size: 2.5rem; font-weight: bold; margin: 10px 0;">${value}</div>
                    <div style="font-size: 1rem; opacity: 0.9;">${unit}</div>
                </div>
            `;
        });
        
        cardDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 3rem; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                    HealthXRay
                </h1>
                <p style="font-size: 1.3rem; margin: 10px 0; opacity: 0.9;">
                    ${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Analysis Results
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 30px;">
                ${resultsHTML}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 1.1rem; margin: 5px 0;">
                    Professional Health Tools
                </p>
                <p style="font-size: 1.3rem; font-weight: bold; margin: 5px 0;">
                    https://healthxray.online
                </p>
                <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 15px;">
                    Generated on ${new Date().toLocaleDateString()}
                </p>
            </div>
        `;
        
        return cardDiv;
    }

    // Show share modal
    showShareModal(calculatorType, imageBlob = null) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const shareUrl = 'https://healthxray.online';
        const shareText = `Check out my ${calculatorType} analysis results from HealthXRay!`;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            ">
                <h3 style="color: #e83e8c; margin-bottom: 20px;">Share Your Results</h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}', '_blank')" style="
                        background: #25D366;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i>
                        WhatsApp
                    </button>
                    
                    <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}', '_blank')" style="
                        background: #1877F2;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fab fa-facebook" style="font-size: 1.5rem;"></i>
                        Facebook
                    </button>
                    
                    <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}', '_blank')" style="
                        background: #1DA1F2;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fab fa-twitter" style="font-size: 1.5rem;"></i>
                        Twitter
                    </button>
                    
                    <button onclick="resultActions.copyToClipboard('${shareUrl}')" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 5px;
                    ">
                        <i class="fas fa-copy" style="font-size: 1.5rem;"></i>
                        Copy Link
                    </button>
                </div>
                
                ${imageBlob ? `
                    <button onclick="resultActions.downloadImage()" style="
                        background: linear-gradient(45deg, #e83e8c, #ff7e5f);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        margin: 10px;
                        font-weight: 600;
                    ">
                        <i class="fas fa-download"></i> Download Result Card
                    </button>
                ` : ''}
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    margin-top: 15px;
                ">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store image blob for download
        if (imageBlob) {
            this.currentImageBlob = imageBlob;
        }
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            alert('Link copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    }

    // Download image
    downloadImage() {
        if (this.currentImageBlob) {
            const url = URL.createObjectURL(this.currentImageBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `healthxray_results_${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    // Wait for library to load
    waitForLibrary(libraryName) {
        return new Promise((resolve) => {
            const checkLibrary = () => {
                if (window[libraryName]) {
                    resolve();
                } else {
                    setTimeout(checkLibrary, 100);
                }
            };
            checkLibrary();
        });
    }
}

// Initialize global instance
const resultActions = new ResultActions();